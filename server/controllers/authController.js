import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { createAccessToken, createRefreshToken } from "../utils/token.js";
import { httpError } from "../utils/httpErrorHelper.js";

// ================= USER REGISTRATION =================
// POST: api/auth/register
const userRegister = async (req, res) => {
  const { name, username, email, password } = req.body;

  const correctEmail = email.toLowerCase();

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    username,
    email: correctEmail,
    password: hashPassword,
  });

  res.status(201).json(newUser);
};

// ================= LOGIN USER =================
// POST: api/auth/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const correctEmail = email.toLowerCase();

  const user = await User.findOne({ email: correctEmail });

  if (!user) {
    httpError("Invalid credentials", 401);
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    httpError("Invalid credentials", 401);
  }

  const payload = { id: user._id, name: user.name };
  const accessToken = createAccessToken(payload);
  const refreshToken = createRefreshToken(payload);

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: 1 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    id: user._id,
    name: user.name,
    token: accessToken,
  });
};

// ================= REFRESH TOKEN =================
// POST: api/auth/refresh
const refreshToken = async (req, res) => {
  const tokenFromCookie = req.cookies.refreshToken;

  if (!tokenFromCookie) {
    httpError("Refresh token missing", 401);
  }

  const decoded = jwt.verify(tokenFromCookie, process.env.REFRESH_SECRET);

  const user = await User.findOne({
    _id: decoded.id,
    refreshToken: tokenFromCookie,
  });

  if (!user) {
    httpError("Refresh token invalid", 401);
  }

  const accessToken = createAccessToken({ id: user._id, name: user.name });

  res.status(200).json({ token: accessToken, id: user._id, name: user.name });
};

// ================= LOG OUT =================
// POST: api/auth/logout
const logOut = async (req, res) => {
  const tokenFromCookie = req.cookies.refreshToken;

  if (!tokenFromCookie) {
    return res.sendStatus(204);
  }

  const user = await User.findOne({ refreshToken: tokenFromCookie });

  if (user) {
    user.refreshToken = null;
    await user.save();
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  });

  res.sendStatus(204);
};

export { userRegister, loginUser, logOut, refreshToken };
