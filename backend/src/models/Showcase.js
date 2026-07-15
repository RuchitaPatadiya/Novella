import mongoose from "mongoose";

const showcaseSchema = new mongoose.Schema(
  {
    handle: {
      type: String,
      required: [true, "Creator handle is required (e.g. @jules_minimalist)"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Showcase image URL is required"],
    },
    space: {
      type: String,
      required: [true, "Space description is required (e.g. Bedroom Suite)"],
      trim: true,
    },
    productName: {
      type: String,
      required: [true, "Featured product name is required"],
      trim: true,
    },
    productId: {
      type: String,
      required: [true, "Featured product ID is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Showcase = mongoose.model("Showcase", showcaseSchema);

export default Showcase;
