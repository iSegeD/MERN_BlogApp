import { validationResult } from "express-validator";
import { httpError } from "../utils/httpErrorHelper.js";

export const handleValidationErrors = (message, statusCode) => {
  return (req, res, next) => {
    const hasFile = req.file;
    const hasBodyValues =
      req.body &&
      Object.keys(req.body).length > 0 &&
      Object.values(req.body).some((val) => val !== "");

    if (!hasFile && !hasBodyValues) {
      httpError(message, statusCode);
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const uniqueMessage = [
        ...new Set(errors.array().map((item) => item.msg)),
      ];
      httpError(uniqueMessage.join(", "), statusCode);
    }

    next();
  };
};
