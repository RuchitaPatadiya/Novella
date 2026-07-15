import express from "express";
import {
  getShowcases,
  createShowcase,
  deleteShowcase,
} from "../controllers/showcaseControllers.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(getShowcases)
  .post(protect, admin, createShowcase);

router.route("/:id").delete(protect, admin, deleteShowcase);

export default router;
