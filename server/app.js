import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { MONGODB_URI } from "./config/serverConfig.js";
import { infoMessage, errorMessage } from "./utils/logger.js";

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { unknownEndpoint, errorHandler } from "./middleware/errorMiddleware.js";
import { tokenExtractor } from "./middleware/authMiddleware.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";

const app = express();

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    infoMessage("Connected to MongoDB");
  })
  .catch((error) => {
    errorMessage("Error connection to MongoDB", error.message);
  });

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(tokenExtractor);

app.use("/uploads", express.static(__dirname + "/uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

/* app.use(express.static(path.resolve(__dirname, "dist")));
app.get("/*path", (req, res) => {
  res.sendFile(path.resolve(__dirname, "dist", "index.html"));
}); */

app.use(unknownEndpoint);
app.use(errorHandler);

export default app;
