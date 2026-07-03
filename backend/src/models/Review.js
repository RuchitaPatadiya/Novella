import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Enforce a compound index so a user can only review a specific product once
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Static method to calculate average rating and update product document
reviewSchema.statics.calculateAverageRating = async function (productId) {
  const stats = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "$product",
        numOfReviews: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  try {
    if (stats.length > 0) {
      await mongoose.model("Product").findByIdAndUpdate(productId, {
        reviewsCount: stats[0].numOfReviews,
        rating: Math.round(stats[0].avgRating * 10) / 10, // e.g. 4.8
      });
    } else {
      await mongoose.model("Product").findByIdAndUpdate(productId, {
        reviewsCount: 0,
        rating: 0,
      });
    }
  } catch (error) {
    console.error("Error updating product ratings:", error);
  }
};

// Recompute average ratings after saving a review
reviewSchema.post("save", function () {
  this.constructor.calculateAverageRating(this.product);
});

// Recompute average ratings after removing a review
reviewSchema.post("remove", function () {
  this.constructor.calculateAverageRating(this.product);
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;
