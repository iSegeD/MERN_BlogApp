import { createSlice } from "@reduxjs/toolkit";
import {
  getAllPosts,
  getPost,
  getPostForEdit,
  create,
  edit,
  remove,
  getTagPosts,
  getUserPosts,
  newComment,
  removeComment,
} from "../services/postService";
import { setNotification } from "./notificationReducer";

import { toast } from "react-toastify";

const postSlice = createSlice({
  name: "post",
  initialState: {
    all: [],
    single: null,
    singleForEdit: null,
    userPosts: [],
    tagPosts: [],
    loading: {
      all: true,
      userPosts: true,
      single: true,
      singleForEdit: true,
      tags: true,
    },
  },
  reducers: {
    setPosts(state, action) {
      state.all = action.payload;
    },
    addPost(state, action) {
      state.all.push(action.payload);
    },
    editPost(state, action) {
      state.all = state.all.map((item) =>
        item.id !== action.payload.id ? item : action.payload
      );
    },
    deletePost(state, action) {
      const postId = action.payload;
      state.all = state.all.filter((item) => item.id !== postId);
      state.userPosts = state.userPosts.filter((item) => item.id !== postId);
      state.tagPosts = state.tagPosts.filter((item) => item.id !== postId);
    },
    setSinglePost(state, action) {
      state.single = action.payload;
    },
    clearSinglePost(state) {
      state.single = null;
      state.loading.single = true;
    },
    setSingleForEdit(state, action) {
      state.singleForEdit = action.payload;
    },
    clearSingleForEdit(state) {
      state.singleForEdit = null;
      state.loading.singleForEdit = true;
    },
    setTagPosts(state, action) {
      state.tagPosts = action.payload;
    },
    clearTagPosts(state) {
      state.tagPosts = [];
      state.loading.tags = true;
    },
    setUserPosts(state, action) {
      state.userPosts = action.payload;
    },
    clearUserPosts(state) {
      state.userPosts = [];
      state.loading.userPosts = true;
    },
    setLoading(state, action) {
      const { key, value } = action.payload;
      state.loading[key] = value;
    },
  },
});

export const {
  setPosts,
  addPost,
  setSinglePost,
  clearSinglePost,
  setSingleForEdit,
  clearSingleForEdit,
  editPost,
  deletePost,
  setTagPosts,
  clearTagPosts,
  setUserPosts,
  clearUserPosts,
  setLoading,
} = postSlice.actions;

export const initializePosts = () => {
  return async (dispatch) => {
    const posts = await getAllPosts();
    dispatch(setPosts(posts));
    dispatch(setLoading({ key: "all", value: false }));
  };
};

export const createPost = (formData) => {
  return async (dispatch, getState) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      const newPost = await create(formData, token);
      dispatch(addPost(newPost));
      toast.success("Post created!");
      return { success: true };
    } catch (error) {
      dispatch(setNotification(`Error: ${error.response.data.message}`));
      return { success: false };
    }
  };
};

export const patchPost = (formData, id) => {
  return async (dispatch, getState) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      const updatedPost = await edit(formData, id, token);
      dispatch(editPost(updatedPost));
      toast.success("Post has been updated!");
      return { success: true };
    } catch (error) {
      dispatch(setNotification(`Error: ${error.response.data.message}`));
      return { success: false };
    }
  };
};

export const removePost = (id) => {
  return async (dispatch, getState) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      await remove(id, token);
      dispatch(deletePost(id));
      toast.success("Post has been deleted!");
      return { success: true };
    } catch (error) {
      toast.error(error.response.data.message);
      return { success: false };
    }
  };
};

export const getPostById = (id) => {
  return async (dispatch) => {
    try {
      const post = await getPost(id);
      dispatch(setSinglePost(post));
      dispatch(setLoading({ key: "single", value: false }));
      return { success: true };
    } catch (error) {
      dispatch(setSinglePost(null));
      dispatch(setLoading({ key: "single", value: false }));
      return { success: false };
    }
  };
};

export const getPostByIdForEdit = (id) => {
  return async (dispatch) => {
    try {
      const post = await getPostForEdit(id);
      dispatch(setSingleForEdit(post));
      dispatch(setLoading({ key: "singleForEdit", value: false }));
      return { success: true };
    } catch (error) {
      dispatch(setSingleForEdit(null));
      dispatch(setLoading({ key: "singleForEdit", value: false }));
      return { success: false };
    }
  };
};

export const getPostsByTag = (tag) => {
  return async (dispatch) => {
    try {
      const posts = await getTagPosts(tag);
      dispatch(setTagPosts(posts));
      dispatch(setLoading({ key: "tags", value: false }));
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  };
};

export const getPostsByUserId = (id) => {
  return async (dispatch) => {
    try {
      const posts = await getUserPosts(id);
      dispatch(setUserPosts(posts));
      dispatch(setLoading({ key: "userPosts", value: false }));
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  };
};

export const addComment = (postId, comment) => {
  return async (dispatch, getState) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      const updatedPost = await newComment(comment, postId, token);

      dispatch(setSinglePost(updatedPost));
      toast.success("Comment added!");
      return { success: true };
    } catch (error) {
      dispatch(setNotification(`Error: ${error.response.data.message}`));
      return { success: false };
    }
  };
};

export const deleteComment = (postId, commentId) => {
  return async (dispatch, getState) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      const updatedPost = await removeComment(postId, commentId, token);
      dispatch(setSinglePost(updatedPost));
      toast.success("Comment has been deleted");
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  };
};

export default postSlice.reducer;
