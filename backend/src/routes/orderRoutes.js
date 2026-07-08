import express from "express";
import {
  createOrder,
  createRazorpayOrder,
  getMyOrders,
  getAdminOrders,
  updateOrderStatus,
  getOrderById,
  cancelOrder,
  returnOrder,
} from "../controllers/orderControllers.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { validateBody } from "../middleware/validationMiddleware.js";
import { orderSchema, razorpayOrderSchema } from "../validation/schemas.js";

const router = express.Router();

// Customer checkout route (must be logged in)
router.route("/")
  .post(protect, validateBody(orderSchema), createOrder);

// Razorpay secure order creation
router.route("/razorpay")
  .post(protect, validateBody(razorpayOrderSchema), createRazorpayOrder);

// Fetch logged-in customer's order history
router.route("/myorders")
  .get(protect, getMyOrders);

// Admin-only order registry management
router.route("/admin")
  .get(protect, admin, getAdminOrders);

router.route("/:orderId")
  .get(protect, getOrderById);

router.route("/:orderId/status")
  .put(protect, admin, updateOrderStatus);

router.route("/:orderId/cancel")
  .put(protect, cancelOrder);

router.route("/:orderId/return")
  .put(protect, returnOrder);

export default router;
