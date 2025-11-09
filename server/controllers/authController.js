import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { users } from "../models/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "testsecret";

// Register new user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user
    const newUser = { id: Date.now(), name, email, password: hashed };
    users.push(newUser);

    // Create JWT
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: "1h" });

    // Send cookie + response
    res
      .cookie("token", token, { httpOnly: true })
      .status(201)
      .json({ message: "User registered successfully!", user: { id: newUser.id, name, email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
