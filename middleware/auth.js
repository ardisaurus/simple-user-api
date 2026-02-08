const { verifyAccessToken } = require("../utils/jwt");

const authMiddleware = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "No token provided. Please login first.",
        hint: "Use: Authorization: Bearer YOUR_ACCESS_TOKEN",
      });
    }

    // Extract token
    const accessToken = authHeader.split(" ")[1];

    // Verify access token
    const decoded = verifyAccessToken(accessToken);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      error: err.message || "Unauthorized",
      hint: "Access token expired or invalid. Use refresh token to get a new one.",
    });
  }
};

module.exports = authMiddleware;
