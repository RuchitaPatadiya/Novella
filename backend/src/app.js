import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

const app = express();

// Configure CORS to allow secure cross-origin requests
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5174",
    credentials: true, // Crucial! Allows the browser to send and receive authentication cookies
  })
);

// Body parser middlewares to read JSON and form submissions
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware (gives us access to req.cookies)
app.use(cookieParser());

// Base API health check route
app.get("/", (req, res) => {
  res.send("API RUNNING");
});

// Register the Authentication routes under /api/auth
app.use("/api/auth", authRoutes);

// Register the Product routes under /api/products
app.use("/api/products", productRoutes);

// Register the Order routes under /api/orders
app.use("/api/orders", orderRoutes);

export default app;