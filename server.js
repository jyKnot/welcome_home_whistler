import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./server/routes/authRoutes.js";
import groceryRoutes from "./server/routes/groceryRoutes.js";

dotenv.config();

const app = express();

// 🔐 Security & logging & parsing FIRST
app.use(helmet());
app.use(morgan("dev"));
app.use(cors({
  origin: "http://localhost:5173", // your React app
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// 👇 Then your routes
app.use("/api/auth", authRoutes);
app.use("/api/groceries", groceryRoutes);

// Simple health-check route
app.get("/", (req, res) => {
  res.send("✅ Welcome Home Whistler API running locally!");
});

// ❌ remove the duplicate auth route (it was below)
// app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running locally on port ${PORT}`);
});
