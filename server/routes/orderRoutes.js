// server/routes/orderRoutes.js
import express from "express";
import {
  createOrder,
  getOrderById,
  getOrdersForCurrentUser,
} from "../controllers/orderController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a new order
// POST /api/orders
router.post("/", createOrder);

// Get a specific order by id
// GET /api/orders/:id
router.get("/:id", getOrderById);

// Get all orders for the current user (requires auth)
// GET /api/orders
router.get("/", requireAuth, getOrdersForCurrentUser);

export default router;
