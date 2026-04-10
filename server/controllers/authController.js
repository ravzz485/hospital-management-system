import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import asyncHandler from "express-async-handler";

// ==========================
// REGISTER USER
// ==========================
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // 🔍 Validate input
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill all required fields");
  }

  // 🔍 Check existing user
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // 🔐 Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 👤 Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || "patient",
  });

  // ✅ Response
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id, user.role),
  });
});

// ==========================
// LOGIN USER
// ==========================
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 🔍 Validate input
  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  // 🔍 Find user
  const user = await User.findOne({ email });

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // 🔐 Check password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // 🔁 Update last login (optional upgrade)
  user.lastLogin = new Date();
  await user.save();

  // ✅ Response
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id, user.role),
  });
});