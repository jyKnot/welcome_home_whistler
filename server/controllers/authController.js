// server/controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const JWT_EXPIRES_IN = "7d";

function setAuthCookie(res, token) {
  res.cookie("token", token, {
    httpOnly: true,
    secure: false, // set to true in production with HTTPS
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

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
      return res.status(409).json({ message: "Email is already in use." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash,
    });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    setAuthCookie(res, token);

    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    return res.status(201).json(safeUser);
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Failed to register user." });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    setAuthCookie(res, token);

    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    return res.json(safeUser);
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Failed to log in." });
  }
}

export async function me(req, res) {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated." });
  }
  return res.json(req.user);
}

export function logout(req, res) {
  res.clearCookie("token");
  return res.json({ message: "Logged out." });
}
