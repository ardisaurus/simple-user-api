const jwt = require("jsonwebtoken");

// ✅ UPDATED: Add role parameter
const generateAccessToken = (userId, email, role = "user") => {
  return jwt.sign(
    { userId, email, role, type: "access" },
    process.env.JWT_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRE || "15m" },
  );
};

// ✅ UPDATED: Add role parameter
const generateRefreshToken = (userId, email, role = "user") => {
  return jwt.sign(
    { userId, email, role, type: "refresh" },
    process.env.JWT_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRE || "7d" },
  );
};

const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== "access") {
      throw new Error("Invalid token type");
    }
    return decoded;
  } catch (err) {
    throw new Error("Invalid or expired access token");
  }
};

const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== "refresh") {
      throw new Error("Invalid token type");
    }
    return decoded;
  } catch (err) {
    throw new Error("Invalid or expired refresh token");
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
