// server/routes/orderRoutes.js
import express from "express";
import Order from "../models/Order.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * POST /api/orders
 * Create a new order
 */
router.post("/", async (req, res) => {
  try {
    // req.body should match the shape of your Order schema:
    // {
    //   user,               // optional (user id)
    //   arrival: { date, time, address, notes },
    //   items: [ { productId, name, category, price, quantity }, ... ],
    //   addOns: { warmHome, lightsOn, flowers, turndown },
    //   totals: { groceries, addOns, grandTotal }
    // }

    const orderData = req.body;

    // Basic guard: must have at least one item
    if (
      !orderData.items ||
      !Array.isArray(orderData.items) ||
      orderData.items.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Order must include at least one item." });
    }

    // Create and save the order
    const order = new Order(orderData);
    const savedOrder = await order.save();

    return res.status(201).json(savedOrder);
  } catch (err) {
    console.error("Error creating order:", err);

    // Handle Mongoose validation errors nicely
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({
        message: "Order validation failed",
        errors: messages,
      });
    }

    return res.status(500).json({ message: "Server error creating order" });
  }
});

/**
 * GET /api/orders/my
 * Get orders for the currently authenticated user
 */
router.get("/my", requireAuth, async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ user: userId }).sort({
      createdAt: -1,
    });

    return res.json(orders);
  } catch (err) {
    console.error("Error fetching user orders:", err);
    return res
      .status(500)
      .json({ message: "Server error fetching user orders" });
  }
});

/**
 * GET /api/orders/:id
 * Fetch a single order by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.json(order);
  } catch (err) {
    console.error("Error fetching order:", err);
    return res.status(500).json({ message: "Server error fetching order" });
  }
});

export default router;
