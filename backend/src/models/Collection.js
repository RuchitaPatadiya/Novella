import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: [true, "Collection slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Collection display name is required"],
      trim: true,
    },
    tagline: {
      type: String,
      default: "",
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

const Collection = mongoose.model("Collection", collectionSchema);
export default Collection;
