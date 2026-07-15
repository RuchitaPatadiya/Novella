import mongoose from "mongoose";

const subcategorySchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: [true, "Subcategory slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Subcategory display name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Parent category slug is required"],
      lowercase: true,
      trim: true,
      index: true,
    },
    image: {
      type: String,
      default: "",
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Subcategory = mongoose.model("Subcategory", subcategorySchema);
export default Subcategory;
