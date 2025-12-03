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

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name || "",
      email,
      passwordHash,
    });

    const token = createToken(user._id);

    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({
        id: user._id,
        name: user.name,
        email: user.email,
      });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({
      message: "Server error during registration. Please try again.",
    });
  }
}

// POST /api/auth/login
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user || !user.passwordHash) {
      // don't reveal which part failed
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = createToken(user._id);

    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        id: user._id,
        name: user.name,
        email: user.email,
      });
  } catch (err) {
    console.error("Login error:", err);
    res
      .status(500)
      .json({ message: "Server error during login. Please try again." });
  }
}

// GET /api/auth/me
// requireAuth attaches req.user
export async function me(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated." });
    }

    res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    });
  } catch (err) {
    console.error("Me error:", err);
    res.status(500).json({ message: "Server error." });
  }
}

// POST /api/auth/logout
export async function logout(req, res) {
  try {
    res
      .clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json({ message: "Logged out successfully." });
  } catch (err) {
    console.error("Logout error:", err);
    res
      .status(500)
      .json({ message: "Server error during logout. Please try again." });
  }
}
