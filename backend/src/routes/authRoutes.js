import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword,
} from "../controllers/authControllers.js";
import { protect } from "../middleware/authMiddleware.js";
import { googleLogin } from "../controllers/oauthControllers.js";

import { validateBody } from "../middleware/validationMiddleware.js";
import { registerSchema, loginSchema } from "../validation/schemas.js";

const router = express.Router();

// Public routes (accessible by anyone)
router.post("/register", validateBody(registerSchema), registerUser);
router.post("/login", validateBody(loginSchema), loginUser);
router.post("/logout", logoutUser);
router.post("/google", googleLogin);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

// Protected routes (require the user to be logged in with a valid token)
router.route("/profile")
  .get(protect, getUserProfile) // GET requests to retrieve user details
  .put(protect, updateUserProfile); // PUT requests to update user details

export default router;