import express from "express";
import Category from "../models/Category.js";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   GET /api/categories
// @desc    Get all active categories (public) or all categories (admin)
// @access  Public
router.get("/", async (req, res) => {
  try {
    const filter = req.query.all === "true" ? {} : { isActive: true };
    const categories = await Category.find(filter).sort({ order: 1, createdAt: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/categories/:slug
// @desc    Get single category by slug
// @access  Public
router.get("/:slug", async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/categories
// @desc    Create a new category
// @access  Admin
router.post("/", protect, admin, async (req, res) => {
  try {
    const { slug, name, description, heroImage, order, isActive } = req.body;

    const exists = await Category.findOne({ slug });
    if (exists) {
      return res.status(400).json({ message: "A category with this slug already exists" });
    }

    const category = await Category.create({
      slug,
      name,
      description: description || "",
      heroImage: heroImage || "",
      order: order ?? 0,
      isActive: isActive !== false,
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/categories/:slug
// @desc    Update a category
// @access  Admin
router.put("/:slug", protect, admin, async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const { name, description, heroImage, order, isActive, slug: newSlug } = req.body;

    if (newSlug && newSlug !== category.slug) {
      const slugExists = await Category.findOne({ slug: newSlug });
      if (slugExists) {
        return res.status(400).json({ message: "A category with this slug already exists" });
      }
      category.slug = newSlug;
    }

    if (name !== undefined) category.name = name;
    if (description !== undefined) category.description = description;
    if (heroImage !== undefined) category.heroImage = heroImage;
    if (order !== undefined) category.order = order;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/categories/:slug
// @desc    Delete a category
// @access  Admin
router.delete("/:slug", protect, admin, async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await category.deleteOne();
    res.json({ message: "Category removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
