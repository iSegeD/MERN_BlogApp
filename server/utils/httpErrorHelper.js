export const httpError = (message, statusCode) => {
  const error = new Error(message);
  error.status = statusCode;
  throw error;
};
