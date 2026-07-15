import express from "express";
import { getAdminAnalytics, getPublicStats } from "../controllers/analyticsController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route — live-computed stats for About page
router.get("/public-stats", getPublicStats);

// Admin-only route
router.get("/admin", protect, admin, getAdminAnalytics);

export default router;
