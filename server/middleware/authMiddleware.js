import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "express-async-handler";


// ============================
// PROTECT MIDDLEWARE (AUTH)
// ============================
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 🔐 Check Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // 🔓 Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 👤 Get user without password
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        res.status(401);
        throw new Error("User not found");
      }

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  // ❌ No token
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});


// ============================
// ROLE BASED ACCESS (ADMIN)
// ============================
export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403);
    throw new Error("Access denied: Admin only");
  }
};


// ============================
// GENERIC ROLE MIDDLEWARE (NEW ⭐)
// ============================
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error("Not authorized");
    }

    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`Access denied: ${roles.join(", ")} only`);
    }

    next();
  };
};