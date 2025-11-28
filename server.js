import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./server/routes/authRoutes.js";
import groceryRoutes from "./server/routes/groceryRoutes.js";
import orderRoutes from "./server/routes/orderRoutes.js";

dotenv.config();

const app = express();

// middleware
app.use(helmet());
app.use(morgan("dev"));
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/groceries", groceryRoutes);
app.use("/api/orders", orderRoutes);


app.get("/", (req, res) => {
  res.send("Welcome Home Whistler API running locally!");
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running locally on port ${PORT}`);
});
