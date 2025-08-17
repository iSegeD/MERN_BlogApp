import bcrypt from "bcrypt";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import User from "../models/userModel.js";

import { avatarsBucket } from "../config/googleStorage.js";
import { httpError } from "../utils/httpErrorHelper.js";

const MAX_AVATAR_SIZE = 500 * 1024;
const EXT = "jpeg";

// ================= GET USERS =================
// GET: api/users/authors
// UNPROTECTED
const getUsers = async (req, res) => {
  const users = await User.find({});

  res.status(200).json(users);
};

// ================= GET USER =================
// GET: api/users/:id
// UNPROTECTED
const getUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    httpError("User not found", 404);
  }

  res.status(200).json(user);
};

// ================= CHANGE USER AVATAR =================
// POST: api/users/change-avatar
// PROTECTED
const changeAvatar = async (req, res) => {
  const file = req.file;

  if (!file) {
    httpError("Please upload a profile avatar", 400);
  }

  const buffer = await sharp(file.buffer).jpeg({ quality: 90 }).toBuffer();

  if (buffer.length > MAX_AVATAR_SIZE) {
    httpError(
      "Profile picture is too large after processing (max. 500KB)",
      400
    );
  }

  const user = await User.findById(req.userId);

  if (user.avatar) {
    const fileName = user.avatar.split("/").pop();
    const oldFile = avatarsBucket.file(fileName);

    try {
      await oldFile.delete();
    } catch (error) {
      if (error !== 404) {
        httpError("Failed to delete old avatar", 400);
      }
    }
  }

  const avatarFileName = `${uuidv4()}.${EXT}`;
  const gcsFile = avatarsBucket.file(avatarFileName);
  await gcsFile.save(buffer, {
    contentType: "image/jpeg",
    resumable: false,
  });

  const publicUrl = `https://storage.googleapis.com/${avatarsBucket.name}/${gcsFile.name}`;

  const updatedAvatar = await User.findByIdAndUpdate(
    req.userId,
    { avatar: publicUrl },
    { new: true }
  );

  res.status(200).json(updatedAvatar);
};

// ================= EDIT USER DETAILS =================
// PATCH: api/users/edit-user
// PROTECTED
const editUser = async (req, res) => {
  const {
    name,
    username,
    email,
    currentPassword,
    newPassword,
    confirmPassword,
  } = req.body;

  const user = await User.findById(req.userId);

  if (!user) {
    httpError("User not found", 404);
  }

  const updatedFields = {};

  if (name) {
    updatedFields.name = name;
  }

  if (username) {
    updatedFields.username = username;
  }

  if (email) {
    updatedFields.email = email;
  }

  if (currentPassword || newPassword || confirmPassword) {
    if (!currentPassword || !newPassword || !confirmPassword) {
      httpError("To change password, fill in all password fields", 422);
    }

    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordCorrect) {
      httpError("Invalid current password", 422);
    }

    if (newPassword !== confirmPassword) {
      httpError("New passwords do not match", 422);
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);
    updatedFields.password = hashPassword;
  }

  const updatedUser = await User.findByIdAndUpdate(req.userId, updatedFields, {
    new: true,
  });

  res.status(200).json(updatedUser);
};

export { getUser, changeAvatar, editUser, getUsers };
