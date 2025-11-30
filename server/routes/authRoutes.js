// server/routes/authRoutes.js
import express from "express";
import {
  register,
  login,
  me,
  logout,
} from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login
router.post("/login", login);

// GET /api/auth/me
router.get("/me", requireAuth, me);

// POST /api/auth/logout
router.post("/logout", logout);

export default router;
