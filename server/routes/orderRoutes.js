// server/routes/orderRoutes.js
import express from "express";
import Order from "../models/Order.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * POST /api/orders
 * Create a new order
 */
router.post("/", requireAuth, async (req, res) => {
  try {
    const {
      arrivalDate,
      arrivalTime,
      address,
      notes,
      items,
      addOns,
      totals,
    } = req.body;

    // Validate required fields
    if (!arrivalDate || !address) {
      return res.status(400).json({
        message: "Arrival date and address are required.",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Order must contain at least one item.",
      });
    }

    // Create order object matching your schema EXACTLY
    const order = new Order({
      user: req.user._id, // REAL ObjectId from auth middleware

      arrival: {
        date: arrivalDate,
        time: arrivalTime || "",
        address,
        notes: notes || "",
      },

      items: items.map((item) => ({
        productId: item.productId,
        name: item.label || item.name,
        category: item.category,
        price: item.price,
        quantity: item.quantity,
      })),

      addOns: addOns || {
        warmHome: false,
        lightsOn: false,
        flowers: false,
        turndown: false,
      },

      totals: {
        groceries: totals?.groceries || 0,
        addOns: totals?.addOns || 0,
        grandTotal: totals?.grandTotal || 0,
      },
    });

    // Save and return
    const saved = await order.save();
    return res.status(201).json(saved);
  } catch (err) {
    console.error("Error creating order:", err);
    return res.status(500).json({ message: "Server error creating order." });
  }
});

/**
 * GET /api/orders/my
 */
router.get("/my", requireAuth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    return res.json(orders);
  } catch (err) {
    console.error("Fetch my orders error:", err);
    return res.status(500).json({ message: "Server error fetching orders." });
  }
});

/**
 * GET /api/orders/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({ message: "Order not found." });
    return res.json(order);
  } catch (err) {
    console.error("Fetch single order error:", err);
    return res.status(500).json({ message: "Server error." });
  }
});

export default router;
