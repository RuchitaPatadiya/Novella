import express from "express";
import { chatWithAssistant } from "../controllers/assistantController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Expose POST /api/assistant/chat as a protected route (requires user login)
router.post("/chat", protect, chatWithAssistant);

export default router;