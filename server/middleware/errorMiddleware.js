import { infoMessage } from "../utils/logger.js";

const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: "Unknown endpoint" });
};

const errorHandler = (error, req, res, next) => {
  infoMessage(error.message);

  if (
    error.name === "MongoServerError" &&
    error.message.includes("E11000 duplicate key error")
  ) {
    let field = "field";
    if (error.message.includes("email_1")) {
      field = "Email";
    } else if (error.message.includes("username_1")) {
      field = "Username";
    }

    return res.status(400).json({ message: `${field} already exists` });
  } else if (error.name === "CastError") {
    return res.status(400).send({ error: "Malformatted id" });
  } else if (error.name === "JsonWebTokenError") {
    return res.status(401).json({ message: "Invalid token" });
  } else if (error.name === "TokenExpiredError") {
    return res.status(401).json({ message: "Token expired" });
  } else if (
    error.message ===
    "Only images are allowed: jpg, jpeg, png, webp, heic, heif"
  ) {
    return res.status(400).json({ message: error.message });
  } else if (error.status === 400) {
    return res.status(400).json({ message: error.message });
  } else if (error.status === 401) {
    return res.status(401).json({ message: error.message });
  } else if (error.status === 404) {
    return res.status(404).json({ massage: error.message });
  } else if (error.status === 422) {
    return res.status(422).json({ message: error.message });
  }

  res.status(500).json({ message: "Something goes wrong" });
};

export { unknownEndpoint, errorHandler };
