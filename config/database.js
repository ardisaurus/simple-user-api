const { MongoClient } = require("mongodb");

let db = null;

const connectDB = async () => {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    db = client.db(process.env.DB_NAME || "user-api");
    console.log("✅ Connected to MongoDB");
    return db;
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

const getDB = () => {
  if (!db) {
    throw new Error("Database not connected. Call connectDB first.");
  }
  return db;
};

module.exports = { connectDB, getDB };
