import jwt from "jsonwebtoken";

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.SECRET, { expiresIn: "15min" });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: "1d" });
};

export { createAccessToken, createRefreshToken };
