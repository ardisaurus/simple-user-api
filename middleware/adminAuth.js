const adminAuth = (req, res, next) => {
  try {
    // Check if user exists (from authMiddleware)
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        error: "Forbidden: Admin access required",
        userRole: req.user.role,
      });
    }

    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = adminAuth;
