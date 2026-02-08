const { ObjectId } = require("mongodb");
const { getDB } = require("../config/database");

class Token {
  static getCollection() {
    return getDB().collection("refreshTokens");
  }

  static async saveRefreshToken(userId, token) {
    const result = await this.getCollection().insertOne({
      userId: new ObjectId(userId),
      token,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });
    return result.insertedId;
  }

  static async findRefreshToken(token) {
    return await this.getCollection().findOne({ token });
  }

  static async deleteRefreshToken(token) {
    const result = await this.getCollection().deleteOne({ token });
    return result.deletedCount > 0;
  }

  static async deleteAllRefreshTokens(userId) {
    const result = await this.getCollection().deleteMany({
      userId: new ObjectId(userId),
    });
    return result.deletedCount;
  }

  static async isTokenExpired(token) {
    const storedToken = await this.findRefreshToken(token);
    if (!storedToken) return true;
    return new Date() > storedToken.expiresAt;
  }
}

module.exports = Token;
