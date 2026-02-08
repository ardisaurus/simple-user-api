const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { connectDB } = require("./config/database");
const userRoutes = require("./routes/users");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database
connectDB();

// Routes
app.get("/api/health", (req, res) => {
  res.json({ message: "✅ Server is running" });
});

app.use("/api/users", userRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
