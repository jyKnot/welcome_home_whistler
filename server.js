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

app.use("/api/auth", authRoutes);
app.use("/api/groceries", groceryRoutes);
app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  credentials: true,
}));

app.get("/", (req, res) => {
  res.send("✅ Welcome Home Whistler API running locally!");
});

// 👇 Add your new route
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running locally on port ${PORT}`);
});
