import express from "express";
import axios from "axios";
const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const r = await axios.get("https://simple-grocery-store-api.glitch.me/products");
    res.json(r.data);
  } catch (e) {
    console.error("Grocery API error:", e.message);
    res.status(500).json({ message: "Failed to fetch groceries" });
  }
});

export default router;


