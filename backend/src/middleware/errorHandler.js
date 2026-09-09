import mongoose from "mongoose";

export const errorHandler = (
  error,
  req,
  res,
  next
) => {
  console.error("Application error:", error);

  let statusCode = error.statusCode || 500;
  let message =
    error.message || "Internal server error";

  // Mongoose validation error
  if (
    error instanceof mongoose.Error.ValidationError
  ) {
    statusCode = 400;
    message = "Validation failed";
  }

  // Invalid MongoDB ObjectId
  if (
    error instanceof mongoose.Error.CastError
  ) {
    statusCode = 400;
    message = "Invalid resource ID";
  }

  // MongoDB duplicate key
  if (error.code === 11000) {
    statusCode = 409;
    message = "A resource with this value already exists";
  }

  const response = {
    success: false,
    message,
  };

  if (
    process.env.NODE_ENV !== "production" &&
    error.stack
  ) {
    response.stack = error.stack;
  }

  return res.status(statusCode).json(response);
};