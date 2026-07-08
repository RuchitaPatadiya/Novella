import express from "express";
import ContactMessage from "../models/ContactMessage.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc    Submit a new contact message (public)
// @route   POST /api/contact
// @access  Public
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const contactMessage = await ContactMessage.create({
      name,
      email,
      subject,
      message,
    });

    res.status(201).json({
      message: "Your message has been sent successfully. We'll get back to you within 24 hours.",
      id: contactMessage._id,
    });
  } catch (error) {
    console.error("Contact form error:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Failed to send message. Please try again." });
  }
});

// @desc    Get all contact messages (admin only)
// @route   GET /api/contact/admin
// @access  Admin
router.get("/admin", protect, admin, async (req, res) => {
  try {
    const messages = await ContactMessage.find({}).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    res.status(500).json({ message: "Failed to fetch contact messages." });
  }
});

// @desc    Update contact message status (admin only)
// @route   PUT /api/contact/:id/status
// @access  Admin
router.put("/:id/status", protect, admin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["New", "Read", "Replied", "Archived"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: "Message not found." });
    }

    res.json(message);
  } catch (error) {
    console.error("Error updating message status:", error);
    res.status(500).json({ message: "Failed to update message status." });
  }
});

// @desc    Delete a contact message (admin only)
// @route   DELETE /api/contact/:id
// @access  Admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({ message: "Message not found." });
    }

    res.json({ message: "Contact message deleted." });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ message: "Failed to delete message." });
  }
});

export default router;
