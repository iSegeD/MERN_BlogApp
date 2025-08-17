import Post from "../models/postModel.js";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import User from "../models/userModel.js";

import { thumbnailsBucket } from "../config/googleStorage.js";
import { httpError } from "../utils/httpErrorHelper.js";

const MAX_THUMBNAIL_SIZE = 2 * 1024 * 1024;
const EXT = "jpeg";

// ================== GET ALL POST ==================
// GET : api/posts
// UNPROTECTED
const getPosts = async (req, res) => {
  const posts = await Post.find({})
    .sort({ createdAt: -1 })
    .populate("user", { username: 1, avatar: 1 });
  res.status(200).json(posts);
};

// ================== GET SINGLE POST ==================
// GET : api/posts/:id
// UNPROTECTED
const getPost = async (req, res) => {
  const selectedPost = await Post.findByIdAndUpdate(
    req.params.id,
    { $inc: { viewsCount: 1 } },
    { new: true }
  )
    .populate("user", { username: 1, avatar: 1 })
    .populate("comments.user", { username: 1, avatar: 1 })
    .lean();

  if (!selectedPost) {
    httpError("Post not found", 404);
  }

  selectedPost.comments.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  res.status(200).json(selectedPost);
};

// ================== GET SINGLE POST FOR EDIT ==================
// GET : api/posts/:id/edit
// UNPROTECTED
const getPostForEdit = async (req, res) => {
  const selectedPost = await Post.findById(req.params.id);

  if (!selectedPost) {
    httpError("Post not found", 404);
  }

  res.status(200).json(selectedPost);
};

// ================== GET USER POST ==================
// GET : api/posts/users/:id
// UNPROTECTED
const getUserPosts = async (req, res) => {
  const posts = await Post.find({ user: req.params.id })
    .sort({
      createdAt: -1,
    })
    .populate("user", { username: 1, avatar: 1 });
  res.status(200).json(posts);
};

// ================== GET POSTS BY TAG ==================
// GET : api/posts/tags/:tag
// UNPROTECTED
const getTagPost = async (req, res) => {
  const { tag } = req.params;
  const posts = await Post.find({ tags: { $in: [tag] } })
    .sort({
      createdAt: -1,
    })
    .populate("user", { username: 1, avatar: 1 });

  res.status(200).json(posts);
};

// ================== CREATE POST ==================
// POST : api/posts
// PROTECTED
const createPost = async (req, res) => {
  const file = req.file;
  const { title, desc, tags } = req.body;

  if (!file) {
    httpError("Please upload a post thumbnail", 400);
  }

  const buffer = await sharp(file.buffer).jpeg({ quality: 90 }).toBuffer();

  if (buffer.length > MAX_THUMBNAIL_SIZE) {
    httpError("Thumbnail too large after processing (max. 2MB)", 400);
  }

  const thumbnailFileName = `${uuidv4()}.${EXT}`;
  const gcsFile = thumbnailsBucket.file(thumbnailFileName);
  await gcsFile.save(buffer, {
    contentType: "image/jpeg",
    resumable: false,
  });

  const publicUrl = `https://storage.googleapis.com/${thumbnailsBucket.name}/${gcsFile.name}`;

  const newPost = await Post.create({
    title,
    desc,
    thumbnail: publicUrl,
    tags: tags?.split(",").map((item) => item.trim()),
    user: req.userId,
  });

  await User.findByIdAndUpdate(
    req.userId,
    { $push: { posts: newPost._id } },
    { new: true }
  );

  const populatedPost = await Post.findById(newPost._id).populate("user", {
    username: 1,
    avatar: 1,
  });

  res.status(201).json(populatedPost);
};

// ================== EDIT POST ==================
// PATCH : api/posts/:id
// PROTECTED
const editPost = async (req, res) => {
  const file = req.file;
  const { title, desc, tags } = req.body;

  const post = await Post.findById(req.params.id);

  if (!post) {
    httpError("Post not found", 404);
  } else if (post.user.toString() !== req.userId) {
    httpError("You have no authorization to update this post", 401);
  }

  const updatedFields = {};

  if (title) {
    updatedFields.title = title;
  }

  if (desc) {
    updatedFields.desc = desc;
  }

  if (tags) {
    updatedFields.tags = Array.isArray(tags)
      ? tags.map((tag) => tag.trim())
      : tags.split(",").map((tag) => tag.trim());
  }

  if (file) {
    const buffer = await sharp(file.buffer).jpeg({ quality: 90 }).toBuffer();

    if (buffer.length > MAX_THUMBNAIL_SIZE) {
      httpError("Thumbnail is too large after processing (max. 2MB)", 400);
    }

    const fileName = post.thumbnail.split("/").pop();
    const oldFile = thumbnailsBucket.file(fileName);

    try {
      await oldFile.delete();
    } catch (error) {
      if (error !== 404) {
        httpError("Failed to delete old thumbnail", 400);
      }
    }

    const newThumbnailFileName = `${uuidv4()}.${EXT}`;
    const gcsFile = thumbnailsBucket.file(newThumbnailFileName);
    await gcsFile.save(buffer, {
      contentType: "image/jpeg",
      resumable: false,
    });

    const publicUrl = `https://storage.googleapis.com/${thumbnailsBucket.name}/${gcsFile.name}`;
    updatedFields.thumbnail = publicUrl;
  }

  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    updatedFields,
    { new: true }
  ).populate("user", { username: 1, avatar: 1 });

  res.status(200).json(updatedPost);
};

// ================== DELETE POST ==================
// DELETE : api/posts/:id
// PROTECTED
const deletePost = async (req, res) => {
  const postToDelete = await Post.findById(req.params.id);

  if (!postToDelete) {
    httpError("Post not found", 404);
  } else if (postToDelete.user.toString() !== req.userId) {
    httpError("You have no authorization to delete this post", 401);
  }

  const fileName = postToDelete.thumbnail.split("/").pop();
  const oldFile = thumbnailsBucket.file(fileName);

  try {
    oldFile.delete();
  } catch (error) {
    if (error !== 404) {
      httpError("Failed to delete thumbnail", 404);
    }
  }

  await Post.findByIdAndDelete(req.params.id);
  await User.findByIdAndUpdate(
    req.userId,
    { $pull: { posts: req.params.id } },
    { new: true }
  );

  res.status(204).end();
};

// ================== ADD COMMENT ==================
// PATCH : api/posts/:id/comments
// PROTECTED
const addComment = async (req, res) => {
  const { comment } = req.body;

  const post = await Post.findById(req.params.id);

  if (!post) {
    return httpError("Post not found", 404);
  }

  post.comments.push({
    text: comment,
    user: req.userId,
    createdAt: new Date(),
  });

  await post.save();

  const populatedPost = await Post.findById(req.params.id)
    .populate("comments.user", { username: 1, avatar: 1 })
    .lean();

  populatedPost.comments.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  res.status(201).json(populatedPost);
};

// ================== DELETE COMMENT ==================
// DELETE : api/posts/:id/comments/:commentId
// PROTECTED
const deleteComment = async (req, res) => {
  const { id, commentId } = req.params;

  const post = await Post.findOne({ _id: id, "comments._id": commentId });

  if (!post) {
    httpError("Post or comment not found", 404);
  }

  const comment = post.comments.id(commentId);
  if (comment.user.toString() !== req.userId) {
    httpError("You have no authorization to delete this comment", 401);
  }

  await Post.findByIdAndUpdate(id, { $pull: { comments: { _id: commentId } } });

  const populatedPost = await Post.findById(id)
    .populate("comments.user", { username: 1, avatar: 1 })
    .lean();

  populatedPost.comments.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  res.status(201).json(populatedPost);
};

export {
  createPost,
  getPost,
  getPosts,
  getPostForEdit,
  getTagPost,
  getUserPosts,
  editPost,
  deletePost,
  addComment,
  deleteComment,
};
