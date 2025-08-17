import express from "express";

import {
  createPost,
  getPost,
  getPostForEdit,
  getPosts,
  getTagPost,
  getUserPosts,
  editPost,
  deletePost,
  addComment,
  deleteComment,
} from "../controllers/postsController.js";

import { userIdextractor } from "../middleware/authMiddleware.js";

import {
  postValidation,
  patchPostValidation,
  commentValidation,
} from "../middleware/validationsMiddleware.js";
import { handleValidationErrors } from "../middleware/handleValidationErrorsMiddleware.js";

import { uploadPost } from "../config/multerConfig.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/:id", getPost);
router.get("/:id/edit", getPostForEdit);
router.get("/users/:id", getUserPosts);
router.get("/tags/:tag", getTagPost);
router.post(
  "/",
  userIdextractor,
  uploadPost.single("thumbnail"),
  postValidation,
  handleValidationErrors(
    "Please fill in the title, description, and upload a post thumbnail",
    422
  ),
  createPost
);
router.patch(
  "/:id",
  userIdextractor,
  uploadPost.single("thumbnail"),
  patchPostValidation,
  handleValidationErrors("Fill in at least one field", 422),
  editPost
);

router.patch(
  "/:id/comments",
  userIdextractor,
  commentValidation,
  handleValidationErrors("Please write a comment", 422),
  addComment
);

router.delete("/:id/comments/:commentId", userIdextractor, deleteComment);
router.delete("/:id", userIdextractor, deletePost);

export default router;
