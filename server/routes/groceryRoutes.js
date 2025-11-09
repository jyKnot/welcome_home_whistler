import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/products", async (req, res) => {
  try {
    const response = await axios.get("https://simple-grocery-store-api.glitch.me/products");
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching groceries:", error.message);
    res.status(500).json({ message: "Error fetching grocery data" });
  }
});

export default router;

