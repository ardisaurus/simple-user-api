const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err.message);

  // MongoDB Invalid ObjectId
  if (err.message === "Invalid user ID") {
    return res.status(400).json({ error: "Invalid user ID format" });
  }

  // Generic errors
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
};

module.exports = errorHandler;
