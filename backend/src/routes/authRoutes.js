import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/authControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes (accessible by anyone)
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Protected routes (require the user to be logged in with a valid token)
router.route("/profile")
  .get(protect, getUserProfile) // GET requests to retrieve user details
  .put(protect, updateUserProfile); // PUT requests to update user details

export default router;