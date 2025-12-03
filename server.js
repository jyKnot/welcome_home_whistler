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

// -------------------------------------------
// 🧪 TEST ENVIRONMENT HANDLING
// -------------------------------------------
const isTest = process.env.NODE_ENV === "test";

// -------------------------------------------
// MONGO CONNECTION (DISABLED IN TESTS)

if (!isTest) {
  console.log("Connecting to MongoDB...");

  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => {
      console.error("MongoDB connection error:", err);
      process.exit(1);
    });
} else {
  console.log("MongoDB connection skipped in test environment");
}


// MIDDLEWARE

app.use(helmet());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


//  ROUTES

app.use("/api/auth", authRoutes);
app.use("/api/groceries", groceryRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("Welcome Home Whistler API running locally!");
});


// EXPORT APP FOR JEST (no server running)

export default app;


// START SERVER (ONLY OUTSIDE TEST)

if (!isTest) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running locally on port ${PORT}`);
  });
}
