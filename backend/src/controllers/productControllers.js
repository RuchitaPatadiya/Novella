import Product from "../models/Product.js";
import Review from "../models/Review.js";
import Order from "../models/Order.js";
import sanitizeHtml from "sanitize-html";

// Helper to sanitize input HTML descriptions to block XSS while keeping rich text layout
const sanitizeInputHTML = (htmlString) => {
  return sanitizeHtml(htmlString || "", {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["h1", "h2", "h3", "span", "div"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      "*": ["class", "style"],
    },
  });
};

// @desc    Get all products from database
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 0;

    if (limit > 0) {
      const skip = (page - 1) * limit;
      const products = await Product.find({}).skip(skip).limit(limit);
      const total = await Product.countDocuments();
      res.status(200).json({
        products,
        page,
        pages: Math.ceil(total / limit),
        total,
      });
    } else {
      const products = await Product.find({});
      res.status(200).json(products);
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products: " + error.message });
  }
};

// @desc    Get product by integer ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    // We search by the custom integer ID (e.g., id: 3), not the default MongoDB ObjectId
    const product = await Product.findOne({ id: Number(req.params.id) });

    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching product details: " + error.message });
  }
};

// @desc    Create a new product (Admin Only)
// @route   POST /api/products
// @access  Protected/Admin
export const createProduct = async (req, res) => {
  const {
    name,
    category,
    price,
    originalPrice,
    stock,
    images,
    description,
    specifications,
    careInstructions,
    spaces,
    collections,
  } = req.body;

  try {
    // 1. Automatically calculate the next available integer ID
    const lastProduct = await Product.findOne().sort("-id");
    const nextId = lastProduct ? lastProduct.id + 1 : 1;

    // 2. Create the product with sanitized HTML inputs
    const product = await Product.create({
      id: nextId,
      name,
      category,
      price,
      originalPrice: originalPrice || null,
      stock: stock !== undefined ? Number(stock) : 10,
      images,
      description: sanitizeInputHTML(description),
      specifications: specifications || {},
      careInstructions: sanitizeInputHTML(careInstructions),
      spaces: spaces || [],
      collections: collections || [],
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to create product: " + error.message });
  }
};

// @desc    Get all reviews for a product
// @route   GET /api/products/:id/reviews
// @access  Public
export const getProductReviews = async (req, res) => {
  try {
    const product = await Product.findOne({ id: Number(req.params.id) });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Return only approved reviews to the public
    const reviews = await Review.find({ product: product._id, isApproved: true }).sort("-createdAt");
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews: " + error.message });
  }
};

// @desc    Create a new review
// @route   POST /api/products/:id/reviews
// @access  Protected
export const createProductReview = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const product = await Product.findOne({ id: Number(req.params.id) });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Purchasing Verification Validation
    const deliveredOrder = await Order.findOne({
      user: req.user._id,
      status: "Delivered",
      "products.id": product.id
    });

    if (!deliveredOrder) {
      return res.status(400).json({
        message: "Only verified buyers who have received this product can leave a review."
      });
    }

    // Check if user already submitted a review for this product
    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      product: product._id,
    });

    if (alreadyReviewed) {
      return res.status(400).json({ message: "You have already reviewed this piece." });
    }

    const review = await Review.create({
      user: req.user._id,
      product: product._id,
      name: req.user.name,
      rating: Number(rating),
      comment: comment || "",
      isVerifiedBuyer: true,
      isApproved: false, // review starts as pending moderation
    });

    res.status(201).json({
      message: "Review submitted. It will appear live once approved by moderation.",
      review
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit review: " + error.message });
  }
};

// @desc    Get recent reviews from database
// @route   GET /api/products/reviews/recent
// @access  Public
export const getRecentReviews = async (req, res) => {
  try {
    // Only return approved reviews
    const reviews = await Review.find({ isApproved: true })
      .populate("product", "name")
      .sort("-createdAt")
      .limit(6);
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch recent reviews: " + error.message });
  }
};

// @desc    Update a product (Admin Only)
// @route   PUT /api/products/:id
// @access  Protected/Admin
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ id: Number(req.params.id) });

    if (product) {
      product.name = req.body.name || product.name;
      product.category = req.body.category || product.category;
      product.price = req.body.price !== undefined ? Number(req.body.price) : product.price;
      product.originalPrice = req.body.originalPrice !== undefined ? (req.body.originalPrice ? Number(req.body.originalPrice) : null) : product.originalPrice;
      product.stock = req.body.stock !== undefined ? Number(req.body.stock) : product.stock;
      product.images = req.body.images || product.images;
      product.description = req.body.description !== undefined ? sanitizeInputHTML(req.body.description) : product.description;
      product.specifications = req.body.specifications || product.specifications;
      product.careInstructions = req.body.careInstructions !== undefined ? sanitizeInputHTML(req.body.careInstructions) : product.careInstructions;
      product.spaces = req.body.spaces || product.spaces;
      product.collections = req.body.collections || product.collections;

      const updatedProduct = await product.save();
      res.status(200).json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to update product: " + error.message });
  }
};

// @desc    Delete a product (Admin Only)
// @route   DELETE /api/products/:id
// @access  Protected/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ id: Number(req.params.id) });

    if (product) {
      await product.deleteOne();
      res.status(200).json({ message: "Product removed successfully" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product: " + error.message });
  }
};

// @desc    Check if user is eligible to write a review for a product
// @route   GET /api/products/:id/review-eligibility
// @access  Protected
export const checkReviewEligibility = async (req, res) => {
  try {
    const product = await Product.findOne({ id: Number(req.params.id) });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if user already reviewed
    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      product: product._id,
    });

    if (alreadyReviewed) {
      return res.status(200).json({
        canReview: false,
        reason: "You have already reviewed this piece."
      });
    }

    // Check if user bought and received the product
    const deliveredOrder = await Order.findOne({
      user: req.user._id,
      status: "Delivered",
      "products.id": product.id
    });

    if (!deliveredOrder) {
      return res.status(200).json({
        canReview: false,
        reason: "Only verified buyers who have received this product can leave a review."
      });
    }

    res.status(200).json({ canReview: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to check review eligibility: " + error.message });
  }
};

// @desc    Get all reviews for admin moderation
// @route   GET /api/products/admin/reviews
// @access  Protected/Admin
export const getAllReviewsForAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 0;

    if (limit > 0) {
      const skip = (page - 1) * limit;
      const reviews = await Review.find({})
        .populate("product", "id name")
        .sort("-createdAt")
        .skip(skip)
        .limit(limit);
      const total = await Review.countDocuments();
      res.status(200).json({
        reviews,
        page,
        pages: Math.ceil(total / limit),
        total,
      });
    } else {
      const reviews = await Review.find({})
        .populate("product", "id name")
        .sort("-createdAt");
      res.status(200).json(reviews);
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews for admin: " + error.message });
  }
};

// @desc    Approve a review (Publish it)
// @route   PUT /api/products/reviews/:reviewId/approve
// @access  Protected/Admin
export const approveReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    review.isApproved = true;
    await review.save(); // triggers recalculation of average rating

    res.status(200).json({ message: "Review approved successfully", review });
  } catch (error) {
    res.status(500).json({ message: "Failed to approve review: " + error.message });
  }
};

// @desc    Delete/Reject a review
// @route   DELETE /api/products/reviews/:reviewId
// @access  Protected/Admin
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const productId = review.product;
    await Review.deleteOne({ _id: req.params.reviewId });

    // Recalculate rating
    await Review.calculateAverageRating(productId);

    res.status(200).json({ message: "Review rejected/deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete review: " + error.message });
  }
};


