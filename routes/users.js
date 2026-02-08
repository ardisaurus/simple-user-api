const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

// ============================================
// 📋 PUBLIC ROUTES (No authentication)
// ============================================
router.post("/login", userController.loginUser);
router.post("/refresh", userController.refreshAccessToken);

// ============================================
// 🔒 PROTECTED ROUTES (Authentication required)
// ============================================
router.get("/me", authMiddleware, userController.getCurrentUser);
router.post("/", authMiddleware, userController.createUser);
router.post("/logout", authMiddleware, userController.logoutUser);
router.get("/", authMiddleware, adminAuth, userController.getAllUsers);
router.get("/:id", authMiddleware, adminAuth, userController.getUserById);
router.put("/:id", authMiddleware, adminAuth, userController.updateUser);
router.delete("/:id", authMiddleware, adminAuth, userController.deleteUser);

module.exports = router;
