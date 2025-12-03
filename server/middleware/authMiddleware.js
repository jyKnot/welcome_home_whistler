import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Please sign in." });
    }

    // verify JWT
    const decoded = jwt.verify(token, JWT_SECRET);

    // find the authenticated user
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    // attach full user object
    req.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ message: "Authentication failed." });
  }
}

