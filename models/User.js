const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
const { getDB } = require("../config/database");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");
const Token = require("./Token");

class User {
  static getCollection() {
    return getDB().collection("users");
  }

  static async findAll() {
    return await this.getCollection().find({}).toArray();
  }

  static async findById(id) {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid user ID");
    }
    return await this.getCollection().findOne({ _id: new ObjectId(id) });
  }

  static async findByEmail(email) {
    return await this.getCollection().findOne({ email });
  }

  static async create(userData) {
    const { name, email, password } = userData;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      name,
      email,
      password: hashedPassword,
      role: "user", // ✅ Regular user role
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await this.getCollection().insertOne(newUser);
    return { id: result.insertedId, name, email, role: "user" };
  }

  static async update(id, updateData) {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid user ID");
    }

    const updateObj = { ...updateData };

    // Hash password if provided
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateObj.password = await bcrypt.hash(updateData.password, salt);
    }

    updateObj.updatedAt = new Date();

    const result = await this.getCollection().findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateObj },
      { returnDocument: "after" },
    );

    if (!result.value) {
      throw new Error("User not found");
    }

    const { password, ...userWithoutPassword } = result.value;
    return userWithoutPassword;
  }

  static async delete(id) {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid user ID");
    }

    const result = await this.getCollection().deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      throw new Error("User not found");
    }

    return { message: "User deleted successfully" };
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // ✅ NEW: Admin login method
  static async adminLogin(email, password) {
    // Verify credentials against .env
    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      throw new Error("Invalid admin credentials");
    }

    // Generate tokens
    const accessToken = generateAccessToken(email, email, "admin");
    const refreshToken = generateRefreshToken(email, email, "admin");

    // Admin tokens are not stored in database (optional - can be stored if needed)

    return {
      accessToken,
      refreshToken,
      user: {
        email: process.env.ADMIN_EMAIL,
        name: "Admin",
        role: "admin",
      },
    };
  }

  // ✅ NEW: Regular login method
  static async login(email, password) {
    const user = await this.findByEmail(email);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Compare password
    const isPasswordValid = await this.comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Generate tokens with role
    const accessToken = generateAccessToken(
      user._id.toString(),
      user.email,
      user.role,
    );
    const refreshToken = generateRefreshToken(
      user._id.toString(),
      user.email,
      user.role,
    );

    // Save refresh token to database
    await Token.saveRefreshToken(user._id.toString(), refreshToken);

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    return {
      accessToken,
      refreshToken,
      user: userWithoutPassword,
    };
  }

  static async logout(refreshToken) {
    const deleted = await Token.deleteRefreshToken(refreshToken);
    if (!deleted) {
      throw new Error("Token not found");
    }
  }
}

module.exports = User;
