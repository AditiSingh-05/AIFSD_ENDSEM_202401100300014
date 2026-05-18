function notFound(req, _res, next) {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

function errorHandler(error, _req, res, _next) {
  let statusCode = error.statusCode || res.statusCode || 500;
  let message = error.message || "Server error";
  const details = {};

  if (error.name === "ValidationError") {
    statusCode = 400;
    message = "Validation error";
    details.fields = Object.values(error.errors).map((fieldError) => fieldError.message);
  }

  if (error.code === 11000) {
    statusCode = 409;
    const duplicateField = Object.keys(error.keyPattern || {})[0] || "field";
    message = `Duplicate ${duplicateField}`;
  }

  if (error.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource id";
  }

  res.status(statusCode).json({
    message,
    ...(Object.keys(details).length ? { details } : {})
  });
}

module.exports = { notFound, errorHandler };
