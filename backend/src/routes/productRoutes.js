import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  getProductReviews,
  createProductReview,
} from "../controllers/productControllers.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes: Anyone can list all products or view details of a single product
router.route("/")
  .get(getProducts)
  .post(protect, admin, createProduct); // Creating a product requires login + admin role

router.route("/:id")
  .get(getProductById);

// Reviews endpoints
router.route("/:id/reviews")
  .get(getProductReviews)
  .post(protect, createProductReview);

export default router;
