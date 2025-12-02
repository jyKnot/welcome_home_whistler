// server/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

export async function requireAuth(req, res, next) {
  try {
    // 1) Try to get token from cookie
    const tokenFromCookie = req.cookies?.token;

    // 2) Also support Authorization: Bearer <token> (handy for tests/tools)
    const authHeader = req.headers.authorization || "";
    const tokenFromHeader = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    const token = tokenFromCookie || tokenFromHeader;

    if (!token) {
      return res.status(401).json({ message: "No auth token provided." });
    }

    // 3) Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // 4) Find user in DB, exclude password hash
    const user = await User.findById(decoded.userId).select("-passwordHash");
    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    // 5) Attach to req and continue
    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}
