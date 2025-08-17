import express from "express";

import {
  userRegister,
  loginUser,
  logOut,
  refreshToken,
} from "../controllers/authController.js";

import {
  registerValidation,
  loginValidation,
} from "../middleware/validationsMiddleware.js";
import { handleValidationErrors } from "../middleware/handleValidationErrorsMiddleware.js";

const router = express.Router();

router.post(
  "/register",
  registerValidation,
  handleValidationErrors("Fill in all fields", 422),
  userRegister
);
router.post(
  "/login",
  loginValidation,
  handleValidationErrors("Fill in all fields", 422),
  loginUser
);

router.post("/logout", logOut);
router.post("/refresh", refreshToken);

export default router;
