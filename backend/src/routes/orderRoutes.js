import express from "express";
import {
  createOrder,
  getMyOrders,
  getAdminOrders,
  updateOrderStatus,
} from "../controllers/orderControllers.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Customer checkout route (must be logged in)
router.route("/")
  .post(protect, createOrder);

// Fetch logged-in customer's order history
router.route("/myorders")
  .get(protect, getMyOrders);

// Admin-only order registry management
router.route("/admin")
  .get(protect, admin, getAdminOrders);

router.route("/:orderId/status")
  .put(protect, admin, updateOrderStatus);

export default router;
