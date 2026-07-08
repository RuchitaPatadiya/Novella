import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      enum: [
        "Order Query",
        "Styling Advice",
        "Returns & Exchanges",
        "Custom Order",
        "Press & Media",
        "General Enquiry",
      ],
      index: true,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      maxlength: [500, "Message cannot exceed 500 characters"],
    },
    status: {
      type: String,
      enum: ["New", "Read", "Replied", "Archived"],
      default: "New",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const ContactMessage = mongoose.model("ContactMessage", contactMessageSchema);

export default ContactMessage;
