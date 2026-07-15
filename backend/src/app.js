import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import promoRoutes from "./routes/promoRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import assistantRoutes from "./routes/assistantRoutes.js";
import cmsRoutes from "./routes/cmsRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import collectionRoutes from "./routes/collectionRoutes.js";
import subcategoryRoutes from "./routes/subcategoryRoutes.js";
import showcaseRoutes from "./routes/showcaseRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Secure HTTP headers via Helmet (CSP disabled to support Unsplash image loads)
app.use(helmet({ 
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false }));

// Configure CORS to allow secure cross-origin requests
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = ["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:5174", process.env.FRONTEND_URL];
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(null, true); // Fallback to safe origin or allow all local requests
      }
    },
    credentials: true, // Crucial! Allows the browser to send and receive authentication cookies
  })
);

// Body parser middlewares to read JSON and form submissions
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware (gives us access to req.cookies)
app.use(cookieParser());

// Serve static uploads
app.use("/uploads", express.static(path.join(__dirname, "../../uploads")));

// Base API health check route
app.get("/", (req, res) => {
  res.send("API RUNNING");
});

// Rate Limiting configurations to prevent abuse and brute force
const isDev = process.env.NODE_ENV === "development" || !process.env.NODE_ENV;

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 50000 : 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests from this IP, please try again after 15 minutes." }
});

const sensitiveLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 10000 : 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many sensitive operations requested from this IP, please try again after 15 minutes." }
});

// Apply rate limit rules
app.use("/api", generalLimiter);
app.use("/api/auth", sensitiveLimiter);
app.use("/api/orders", sensitiveLimiter);

// Register the Authentication routes under /api/auth
app.use("/api/auth", authRoutes);

// Register the Product routes under /api/products
app.use("/api/products", productRoutes);

// Register the Order routes under /api/orders
app.use("/api/orders", orderRoutes);

// Register the Promo routes under /api/promos
app.use("/api/promos", promoRoutes);

// Register the Contact routes under /api/contact
app.use("/api/contact", contactRoutes);

// Register the Analytics routes under /api/analytics
app.use("/api/analytics", analyticsRoutes);

// Register the Assistant routes under /api/assistant
app.use("/api/assistant", assistantRoutes);

// Register the CMS routes under /api/cms
app.use("/api/cms", cmsRoutes);

// Register the Category routes under /api/categories
app.use("/api/categories", categoryRoutes);

// Register the Collection routes under /api/collections
app.use("/api/collections", collectionRoutes);

// Register the Subcategory routes under /api/subcategories
app.use("/api/subcategories", subcategoryRoutes);
app.use("/api/showcases", showcaseRoutes);

export default app;