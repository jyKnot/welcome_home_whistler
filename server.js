// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./server/routes/authRoutes.js";
import groceryRoutes from "./server/routes/groceryRoutes.js";
import orderRoutes from "./server/routes/orderRoutes.js";
import mongoose from "mongoose";

dotenv.config();

const app = express();

console.log("Loaded MONGODB_URI:", process.env.MONGODB_URI);


// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// middleware
app.use(helmet());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/groceries", groceryRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("Welcome Home Whistler API running locally!");
});

// export the app for Jest
export default app;

// only start the server when NOT running tests
const PORT = process.env.PORT || 4000;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running locally on port ${PORT}`);
  });
}
