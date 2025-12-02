// server/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const JWT_EXPIRES_IN = "7d";

function createToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// POST /api/auth/register
export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    // Hash the password -> passwordHash (matches your model)
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name: name || "", // optional name
      email,
      passwordHash,
    });

    // Create JWT token
    const token = createToken(user._id);

    // Set HTTP-only cookie with token
    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(201)
      // This shape matches what you're putting into localStorage
      .json({
        id: user._id,
        name: user.name,
        email: user.email,
      });
  } catch (err) {
    console.error("Register error:", err);
    res
      .status(500)
      .json({ message: "Server error during registration. Please try again." });
  }
}

// We'll fill these in next steps
export async function login(req, res) {
  return res.status(501).json({ message: "Not implemented yet." });
}

export async function me(req, res) {
  return res.status(501).json({ message: "Not implemented yet." });
}

export async function logout(req, res) {
  return res.status(501).json({ message: "Not implemented yet." });
}
