# User Management API with JWT Authentication

A complete Node.js REST API for user management with role-based access control (RBAC), featuring access tokens, refresh tokens, and a hardcoded admin master account.

## ✨ Features

### Core Features

- ✅ User Registration (any user can register)
- ✅ User Login (with role-based access)
- ✅ JWT Access Token (15 minutes expiry)
- ✅ Refresh Token (7 days expiry, stored in DB)
- ✅ User Logout (token revocation)
- ✅ Role-Based Access Control (Admin & User roles)
- ✅ Admin Master Account (hardcoded credentials)
- ✅ User CRUD Operations (Admin only)

### Security Features

- 🔐 Password Hashing (bcryptjs)
- 🔐 JWT Token Validation
- 🔐 Protected Routes (Authentication required)
- 🔐 Admin-Only Routes
- 🔐 Input Validation (Joi schema validation)
- 🔐 Token Expiration & Refresh Mechanism
- 🔐 Token Revocation on Logout

### Technical Features

- 📦 MongoDB Database
- 🏗️ Modular Architecture (MVC pattern)
- ⚡ Express.js Framework
- 📝 Error Handling Middleware
- 🔗 RESTful API Design
- 📊 Comprehensive Logging

---

## 🚀 Installation

### Prerequisites Check

Before you begin, ensure you have:

```bash
# Verify Node.js installation
node --version   # Should be v14 or higher
npm --version    # Should be v6 or higher

# Verify MongoDB is running
mongod --version
```

### 1. Clone the Repository

```bash
# Clone from GitHub
git clone https://github.com/ardisaurus/simple-user-api.git

# Navigate to project directory
cd user-api
```

### 2. Install Dependencies

```bash
npm install
```

**What gets installed:**

```
✓ express          - Web framework
✓ mongodb          - Database driver
✓ dotenv           - Environment variables
✓ cors             - Cross-origin resource sharing
✓ bcryptjs         - Password hashing
✓ joi              - Input validation
✓ jsonwebtoken     - JWT authentication
✓ nodemon          - Development auto-reload
```

**Verify installation:**

```bash
npm list
```

### 3. Setup Environment Variables

```bash
# Copy example environment file to .env
cp .env.example .env
```

**Or create `.env` manually and add:**

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017
DB_NAME=user-api

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_very_secure_secret_key_min_32_chars_recommended
ACCESS_TOKEN_EXPIRE=15m
REFRESH_TOKEN_EXPIRE=7d

# Admin Master Account
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@123456
```

---

## 🗄️ Database Setup

### Option A: Local MongoDB Installation

#### Windows

1. Download from [mongodb.com/community](https://www.mongodb.com/try/download/community)
2. Run installer and follow setup wizard
3. MongoDB starts automatically as a service
4. Verify with: `mongod --version`

#### macOS (using Homebrew)

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
mongod --version
```

#### Linux (Ubuntu/Debian)

```bash
# Add MongoDB repository
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
mongod --version
```

### Option B: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create a new cluster
4. Get connection string
5. Update `.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   ```

---

## ▶️ Running the Application

### Development Mode (with auto-reload)

```bash
npm run dev
```

**Expected output:**

```
[nodemon] 3.0.1
[nodemon] to restart at any time, type `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,json
✅ Connected to MongoDB
🚀 Server running on http://localhost:5000
```

### Production Mode

```bash
npm start
```

---

## ✅ Verify Installation

### 1. Check Server Health

```bash
curl http://localhost:5000/api/health
```

**Expected response:**

```json
{
  "message": "✅ Server is running"
}
```

### 2. Test Admin Login

```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin@123456"
  }'
```

**Expected response:**

```json
{
  "message": "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "email": "admin@example.com",
    "name": "Admin",
    "role": "admin"
  }
}
```

### 3. Test Protected Route

```bash
# Replace TOKEN with the accessToken from login
curl -X GET http://localhost:5000/api/users/me \
  -H "Authorization: Bearer TOKEN"
```

---

## 🔄 API Endpoints Summary

```
┌─────────────────────────────────────────────────┐
│            USER MANAGEMENT API                  │
├─────────────────────────────────────────────────┤
│ PUBLIC ROUTES                                   │
├──────┬──────────┬─────────────────────────────┤
│ POST │ /login   │ Login user                  │
│ POST │ /refresh │ Refresh access token        │
├──────┼──────────┼─────────────────────────────┤
│ PROTECTED ROUTES (Auth Required)              │
├──────┼──────────┼─────────────────────────────┤
│ POST │ /        │ Register new user           │
│ GET  │ /me      │ Get current user profile    │
│ POST │ /logout  │ Logout user                 │
├──────┼──────────┼─────────────────────────────┤
│ ADMIN ROUTES (Admin Only)                     │
├──────┼──────────┼─────────────────────────────┤
│ GET  │ /        │ Get all users               │
│ GET  │ /:id     │ Get user by ID              │
│ PUT  │ /:id     │ Update user                 │
│ DEL  │ /:id     │ Delete user                 │
└──────┴──────────┴─────────────────────────────┘
```

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api/users
```

### Authentication Header

```
Authorization: Bearer [ACCESS_TOKEN]
```

### 🔓 Public Endpoints

#### 1. Login

**Login as admin or regular user**

```http
POST /login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "Admin@123456"
}
```

**Response (200 OK):**

```json
{
  "message": "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "email": "admin@example.com",
    "name": "Admin",
    "role": "admin"
  }
}
```

**Error Response (401):**

```json
{
  "error": "Invalid email or password"
}
```

#### 2. Refresh Token

**Get new access token using refresh token**

```http
POST /refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**

```json
{
  "message": "Token refreshed successfully",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 🔒 Protected Endpoints (All require authentication)

#### 3. Register New User

**Any authenticated user can register new users**

```http
POST /
Authorization: Bearer [ACCESS_TOKEN]
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201 Created):**

```json
{
  "id": "65a8f3c2d4e1f9a2b3c4d5e6",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user"
}
```

**Error Response (409 Conflict):**

```json
{
  "error": "Email already exists"
}
```

#### 4. Get Current User

**Get logged-in user's profile**

```http
GET /me
Authorization: Bearer [ACCESS_TOKEN]
```

**Response (200 OK):**

```json
{
  "_id": "65a8f3c2d4e1f9a2b3c4d5e6",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "createdAt": "2024-01-16T10:30:00.000Z"
}
```

#### 5. Logout

**Revoke refresh token and logout**

```http
POST /logout
Authorization: Bearer [ACCESS_TOKEN]
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**

```json
{
  "message": "Logged out successfully"
}
```

### 👑 Admin-Only Endpoints

#### 6. Get All Users

**Only admin can view all users**

```http
GET /
Authorization: Bearer [ADMIN_ACCESS_TOKEN]
```

**Response (200 OK):**

```json
[
  {
    "_id": "65a8f3c2d4e1f9a2b3c4d5e6",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-16T10:30:00.000Z"
  },
  {
    "_id": "65a8f4d3e5f2g9b3c4d5e7f7",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "user",
    "createdAt": "2024-01-16T10:35:00.000Z"
  }
]
```

**Error Response (403 Forbidden):**

```json
{
  "error": "Forbidden: Admin access required",
  "userRole": "user"
}
```

#### 7. Get User by ID

**Only admin can view specific user**

```http
GET /:id
Authorization: Bearer [ADMIN_ACCESS_TOKEN]
```

**Response (200 OK):**

```json
{
  "_id": "65a8f3c2d4e1f9a2b3c4d5e6",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "createdAt": "2024-01-16T10:30:00.000Z"
}
```

#### 8. Update User

**Only admin can update users**

```http
PUT /:id
Authorization: Bearer [ADMIN_ACCESS_TOKEN]
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "newpassword123"
}
```

**Response (200 OK):**

```json
{
  "_id": "65a8f3c2d4e1f9a2b3c4d5e6",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "user",
  "updatedAt": "2024-01-16T11:00:00.000Z"
}
```

#### 9. Delete User

**Only admin can delete users**

```http
DELETE /:id
Authorization: Bearer [ADMIN_ACCESS_TOKEN]
```

**Response (200 OK):**

```json
{
  "message": "User deleted successfully"
}
```

---

## 🔐 Authentication Flow

### Login Flow

```
┌─────────────────────────────────┐
│  1. User submits credentials    │
│     email + password            │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│  2. Server validates password   │
│     (bcryptjs comparison)       │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│  3. Generate tokens:            │
│  - Access Token (15m)           │
│  - Refresh Token (7d)           │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│  4. Store Refresh Token in DB   │
│     (only for regular users)    │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│  5. Return tokens to client     │
└─────────────────────────────────┘
```

### Protected Request Flow

```
┌─────────────────────────────────┐
│  1. Client sends request with   │
│     Authorization header        │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│  2. Extract token from header   │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│  3. Verify token signature      │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│  4. Check token expiration      │
└──────────┬──────────────────────┘
           │
           ▼
  ┌────────┴────────┐
  │                 │
  ▼                 ▼
Valid            Expired
  │                 │
  ▼                 ▼
Grant Access   Return 401
```

### Refresh Token Flow

```
┌──────────────────────────────────┐
│  Access Token Expired (401)      │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│  Send Refresh Token Endpoint     │
│  POST /refresh                   │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│  Verify Refresh Token:           │
│  - Check signature              │
│  - Check expiration             │
│  - Check database (if not admin)│
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│  Generate New Access Token       │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│  Return New Token to Client      │
└──────────────────────────────────┘
```

---

## ❌ Error Handling

### Common Error Responses

| Status | Error                              | Cause                        | Solution                          |
| ------ | ---------------------------------- | ---------------------------- | --------------------------------- |
| 400    | `Refresh token required`           | Missing refresh token        | Include `refreshToken` in body    |
| 400    | `Invalid user ID format`           | Malformed MongoDB ID         | Check ID length                   |
| 401    | `No token provided`                | Missing Authorization header | Add `Authorization: Bearer TOKEN` |
| 401    | `Invalid or expired token`         | Token expired or invalid     | Use refresh token or login again  |
| 401    | `Invalid email or password`        | Wrong credentials            | Verify email and password         |
| 403    | `Forbidden: Admin access required` | Non-admin trying admin route | Login as admin                    |
| 409    | `Email already exists`             | Duplicate email              | Use different email               |
| 404    | `User not found`                   | User doesn't exist           | Check user ID                     |
| 500    | `Internal server error`            | Server error                 | Check server logs                 |

---
