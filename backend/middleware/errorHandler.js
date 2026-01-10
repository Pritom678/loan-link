const logger = require("../utils/logger");
const ResponseHelper = require("../utils/responseHelper");

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error("Error occurred:", {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  // Handle specific error types
  if (err.name === "ValidationError") {
    return ResponseHelper.error(res, 400, "Validation Error", err.message);
  }

  if (err.name === "CastError") {
    return ResponseHelper.error(res, 400, "Invalid ID format");
  }

  if (err.code === 11000) {
    return ResponseHelper.error(res, 409, "Duplicate entry found");
  }

  if (err.name === "JsonWebTokenError") {
    return ResponseHelper.error(res, 401, "Invalid token");
  }

  if (err.name === "TokenExpiredError") {
    return ResponseHelper.error(res, 401, "Token expired");
  }

  // Default error response
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  ResponseHelper.error(
    res,
    statusCode,
    message,
    process.env.NODE_ENV === "development" ? err.stack : null
  );
};

/**
 * Handle 404 errors
 */
const notFoundHandler = (req, res) => {
  ResponseHelper.error(res, 404, `Route ${req.originalUrl} not found`);
};

/**
 * Async error wrapper
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler,
};
