import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    date: {
      type: String,
      required: true,
    },
    total: {
      type: String,
      required: true, // e.g., "₹12,800"
    },
    status: {
      type: String,
      required: true,
      default: "Processing",
      enum: ["Processing", "Shipped", "Delivered"],
    },
    items: {
      type: String,
      required: true, // short text summary e.g., "Travertine Table (x1)"
    },
    products: [
      {
        id: Number,
        name: String,
        price: Number,
        image: String,
        quantity: Number,
        color: String,
        size: String,
      },
    ],
    shippingDetails: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      phone: { type: String, required: true },
      method: { type: String, required: true }, // e.g., "standard" or "express"
    },
    paymentDetails: {
      cardName: { type: String, required: true },
      cardNumber: { type: String, required: true }, // masked stub e.g. "•••• •••• •••• 4242"
    },
    pricingBreakdown: {
      subtotal: { type: Number, required: true },
      discount: { type: Number, default: 0 },
      shipping: { type: Number, default: 0 },
      total: { type: Number, required: true },
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
