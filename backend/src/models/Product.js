import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: [true, "Product integer ID is required"],
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      lowercase: true,
      enum: ["furniture", "lighting", "wall-decor", "textiles", "decor-accessories"],
      index: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      default: 0,
    },
    originalPrice: {
      type: Number,
      default: null,
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
    badge: {
      type: String,
      default: null,
    },
    stock: {
      type: Number,
      required: [true, "Product inventory stock is required"],
      default: 10,
      min: 0,
    },
    images: {
      type: [String],
      required: [true, "Product must have at least one image URL"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    specifications: {
      Dimensions: { type: String, default: "" },
      Material: { type: String, default: "" },
    },
    careInstructions: {
      type: String,
      default: "",
    },
    spaces: {
      type: [String],
      default: [], // e.g., ["living-room", "bedroom"]
      index: true,
    },
    collections: {
      type: [String],
      default: [], // e.g., ["modern-minimalist", "best-sellers"]
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
