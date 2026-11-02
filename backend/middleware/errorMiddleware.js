// Handles requests to routes that don't exist
const notFound = (req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
};

// Central error handler: every next(error) call ends up here
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Mongoose validation errors -> 400 with a list of field messages
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json({
      success: false,
      message: errors.map((e) => e.message).join(", "),
      errors,
    });
  }

  // Malformed JSON in the request body
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, message: "Invalid JSON in request body" });
  }

  console.error(err);
  res.status(500).json({ success: false, message: "Something went wrong on the server" });
};

module.exports = { notFound, errorHandler };
