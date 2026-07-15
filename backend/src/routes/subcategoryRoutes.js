import express from "express";
import Subcategory from "../models/Subcategory.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   GET /api/subcategories
// @desc    Get all active subcategories (public) or all (admin)
// @access  Public
router.get("/", async (req, res) => {
  try {
    const filter = req.query.all === "true" ? {} : { isActive: true };
    if (req.query.category) {
      filter.category = req.query.category;
    }
    const subcategories = await Subcategory.find(filter).sort({ order: 1, createdAt: 1 });
    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/subcategories/:slug
// @desc    Get single subcategory by slug
// @access  Public
router.get("/:slug", async (req, res) => {
  try {
    const subcategory = await Subcategory.findOne({ slug: req.params.slug });
    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }
    res.json(subcategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/subcategories
// @desc    Create a new subcategory
// @access  Admin
router.post("/", protect, admin, async (req, res) => {
  try {
    const { slug, name, category, image, order, isActive } = req.body;

    const exists = await Subcategory.findOne({ slug });
    if (exists) {
      return res.status(400).json({ message: "A subcategory with this slug already exists" });
    }

    const subcategory = await Subcategory.create({
      slug,
      name,
      category,
      image: image || "",
      order: order ?? 0,
      isActive: isActive !== false,
    });

    res.status(201).json(subcategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/subcategories/:slug
// @desc    Update a subcategory
// @access  Admin
router.put("/:slug", protect, admin, async (req, res) => {
  try {
    const subcategory = await Subcategory.findOne({ slug: req.params.slug });
    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    const { name, category, image, order, isActive, slug: newSlug } = req.body;

    if (newSlug && newSlug !== subcategory.slug) {
      const slugExists = await Subcategory.findOne({ slug: newSlug });
      if (slugExists) {
        return res.status(400).json({ message: "A subcategory with this slug already exists" });
      }
      subcategory.slug = newSlug;
    }

    if (name !== undefined) subcategory.name = name;
    if (category !== undefined) subcategory.category = category;
    if (image !== undefined) subcategory.image = image;
    if (order !== undefined) subcategory.order = order;
    if (isActive !== undefined) subcategory.isActive = isActive;

    await subcategory.save();
    res.json(subcategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/subcategories/:slug
// @desc    Delete a subcategory
// @access  Admin
router.delete("/:slug", protect, admin, async (req, res) => {
  try {
    const subcategory = await Subcategory.findOne({ slug: req.params.slug });
    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    await subcategory.deleteOne();
    res.json({ message: "Subcategory removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
