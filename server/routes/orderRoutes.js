// server/routes/orderRoutes.js
import express from "express";

const router = express.Router();

// POST /api/orders
// For now: just validate, log, and echo back the order
router.post("/", (req, res) => {
  const { arrivalDate, arrivalTime, address, notes, addOns, cartItems } = req.body;

  if (!arrivalDate || !address) {
    return res
      .status(400)
      .json({ message: "Arrival date and address are required." });
  }

  const order = {
    id: Date.now().toString(), // temporary ID until MongoDB
    arrivalDate,
    arrivalTime: arrivalTime || "",
    address,
    notes: notes || "",
    addOns: addOns || {},
    cartItems: cartItems || [],
    createdAt: new Date().toISOString(),
  };

  console.log("📦 New Welcome Order received:", order);

  return res.status(201).json(order);
});

export default router;
