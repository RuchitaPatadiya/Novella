import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  getProductReviews,
  createProductReview,
  getRecentReviews,
  updateProduct,
  deleteProduct,
  checkReviewEligibility,
  getAllReviewsForAdmin,
  approveReview,
  deleteReview,
} from "../controllers/productControllers.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { cloudinary, isCloudinaryConfigured } from "../config/cloudinary.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    const filetypes = /jpe?g|png|webp/;
    const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = mimetypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Images only! (jpeg, jpg, png, webp)"));
    }
  },
});

import { validateBody } from "../middleware/validationMiddleware.js";
import { productSchema } from "../validation/schemas.js";

const router = express.Router();

// Public routes: Anyone can list all products or view details of a single product
router.route("/")
  .get(getProducts)
  .post(protect, admin, validateBody(productSchema), createProduct); // Creating a product requires login + admin role

// Recent reviews endpoint must be registered before /:id to avoid conflict
router.route("/reviews/recent")
  .get(getRecentReviews);

// Upload image route
router.post("/upload", protect, admin, upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    if (isCloudinaryConfigured) {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "novella_catalog",
      });
      // Delete the local temporary file
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(200).json({
        url: result.secure_url,
      });
    }

    // Local fallback
    res.status(200).json({
      url: `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`,
    });
  } catch (error) {
    console.error("Cloudinary upload failed, falling back to local storage:", error);
    res.status(200).json({
      url: `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`,
    });
  }
});

// Admin-only reviews moderation list
router.route("/admin/reviews")
  .get(protect, admin, getAllReviewsForAdmin);

// Admin-only review moderation actions
router.route("/reviews/:reviewId/approve")
  .put(protect, admin, approveReview);

router.route("/reviews/:reviewId")
  .delete(protect, admin, deleteReview);

router.route("/:id")
  .get(getProductById)
  .put(protect, admin, validateBody(productSchema), updateProduct)
  .delete(protect, admin, deleteProduct);

// Reviews endpoints
router.route("/:id/reviews")
  .get(getProductReviews)
  .post(protect, createProductReview);

router.route("/:id/review-eligibility")
  .get(protect, checkReviewEligibility);

export default router;
