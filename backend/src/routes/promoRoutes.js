import express from "express";
import {
  validatePromoCode,
  getAllPromosForAdmin,
  createPromoCode,
  deletePromoCode,
} from "../controllers/promoControllers.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public validation route
router.route("/validate")
  .post(protect, validatePromoCode);

// Admin promo code management routes
router.route("/")
  .post(protect, admin, createPromoCode);

router.route("/admin")
  .get(protect, admin, getAllPromosForAdmin);

router.route("/:id")
  .delete(protect, admin, deletePromoCode);

export default router;
