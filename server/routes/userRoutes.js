import express from "express";

import {
  getUser,
  changeAvatar,
  editUser,
  getUsers,
} from "../controllers/userController.js";

import { userIdextractor } from "../middleware/authMiddleware.js";

import { patchUserValidation } from "../middleware/validationsMiddleware.js";
import { handleValidationErrors } from "../middleware/handleValidationErrorsMiddleware.js";

import { uploadAvatar } from "../config/multerConfig.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUser);
router.post(
  "/change-avatar",
  userIdextractor,
  uploadAvatar.single("avatar"),
  changeAvatar
);
router.patch(
  "/edit-user",
  userIdextractor,
  patchUserValidation,
  handleValidationErrors("Fill in at least one field", 422),
  editUser
);

export default router;
