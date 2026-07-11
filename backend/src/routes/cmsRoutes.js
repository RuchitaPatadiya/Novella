import express from "express";
import {
  getCmsSetting,
  getAllCmsSettings,
  updateCmsSetting,
} from "../controllers/cmsController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes to fetch config
router.get("/", getAllCmsSettings);
router.get("/:key", getCmsSetting);

// Admin-protected update route
router.put("/:key", protect, admin, updateCmsSetting);

export default router;
