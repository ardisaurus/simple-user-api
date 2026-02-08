const User = require("../models/User");
const Token = require("../models/Token");
const {
  validateUser,
  validateUserUpdate,
  validateLogin,
} = require("../utils/validation");
const { verifyRefreshToken, generateAccessToken } = require("../utils/jwt");

// ✅ All functions must be defined

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    const usersWithoutPassword = users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    res.json(usersWithoutPassword);
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { error, value } = validateUser(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }

    const existing = await User.findByEmail(value.email);
    if (existing) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const newUser = await User.create(value);
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { error, value } = validateUserUpdate(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }

    if (value.email) {
      const existing = await User.findByEmail(value.email);
      if (existing && existing._id.toString() !== req.params.id) {
        return res.status(409).json({ error: "Email already exists" });
      }
    }

    const updatedUser = await User.update(req.params.id, value);
    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const result = await User.delete(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { error, value } = validateLogin(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }

    const { email, password } = value;

    let result;

    // Check if it's admin login
    if (email === process.env.ADMIN_EMAIL) {
      try {
        result = await User.adminLogin(email, password);
      } catch (err) {
        return res.status(401).json({ error: "Invalid admin credentials" });
      }
    } else {
      // Regular user login
      try {
        result = await User.login(email, password);
      } catch (err) {
        if (err.message === "Invalid email or password") {
          return res.status(401).json({ error: err.message });
        }
        throw err;
      }
    }

    // Set refresh token as httpOnly cookie (optional)
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
    });
  } catch (err) {
    next(err);
  }
};

const refreshAccessToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        error: "Refresh token required",
      });
    }

    // Verify refresh token format
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (err) {
      return res.status(401).json({
        error: "Invalid or expired refresh token",
      });
    }

    // For admin, skip database check
    if (decoded.role === "admin") {
      const newAccessToken = generateAccessToken(
        decoded.userId,
        decoded.email,
        "admin",
      );
      return res.json({
        message: "Token refreshed successfully",
        accessToken: newAccessToken,
      });
    }

    // Check if refresh token exists in database (for regular users)
    const storedToken = await Token.findRefreshToken(refreshToken);
    if (!storedToken) {
      return res.status(401).json({
        error: "Refresh token not found or revoked",
      });
    }

    if (await Token.isTokenExpired(refreshToken)) {
      return res.status(401).json({
        error: "Refresh token has expired",
      });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(
      decoded.userId,
      decoded.email,
      decoded.role,
    );

    res.json({
      message: "Token refreshed successfully",
      accessToken: newAccessToken,
    });
  } catch (err) {
    next(err);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        error: "Refresh token required",
      });
    }

    // For admin, skip database deletion
    if (req.user.role === "admin") {
      return res.json({ message: "Logged out successfully" });
    }

    await User.logout(refreshToken);

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    if (err.message === "Token not found") {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    // Handle admin user
    if (req.user.role === "admin") {
      return res.json({
        email: process.env.ADMIN_EMAIL,
        name: "Admin",
        role: "admin",
      });
    }

    // Regular user
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (err) {
    next(err);
  }
};

// ✅ IMPORTANT: Export all functions
module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getCurrentUser,
};
