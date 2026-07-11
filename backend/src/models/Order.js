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
      enum: ["Processing", "Shipped", "Delivered", "Cancelled", "Return Requested", "Returned"],
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
      address: {
        street: { type: String, default: "" },
        apartment: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        zipCode: { type: String, default: "" },
      },
      phone: { type: String, required: true },
      method: { type: String, required: true }, // e.g., "standard" or "express"
    },
    billingDetails: {
      name: { type: String, required: true },
      address: {
        street: { type: String, default: "" },
        apartment: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        zipCode: { type: String, default: "" },
      },
      phone: { type: String, required: true },
    },
    paymentDetails: {
      paymentMethod: { type: String, required: true, default: "Razorpay" },
      paymentStatus: { type: String, required: true, enum: ["Pending", "Paid", "Refunded"], default: "Paid" },
      transactionToken: { type: String, default: "" },
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
