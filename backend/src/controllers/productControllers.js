import Product from "../models/Product.js";
import Review from "../models/Review.js";

// @desc    Get all products from database
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
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

    // 2. Create the product
    const product = await Product.create({
      id: nextId,
      name,
      category,
      price,
      originalPrice: originalPrice || null,
      images,
      description,
      specifications: specifications || {},
      careInstructions: careInstructions || "",
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

    const reviews = await Review.find({ product: product._id }).sort("-createdAt");
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
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: "Failed to submit review: " + error.message });
  }
};

