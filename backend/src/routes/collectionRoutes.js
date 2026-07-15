import express from "express";
import Collection from "../models/Collection.js";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   GET /api/collections
// @desc    Get all active collections (public) or all collections (admin)
// @access  Public
router.get("/", async (req, res) => {
  try {
    const filter = req.query.all === "true" ? {} : { isActive: true };
    const collections = await Collection.find(filter).sort({ order: 1, createdAt: 1 });
    res.json(collections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/collections/:slug
// @desc    Get single collection by slug
// @access  Public
router.get("/:slug", async (req, res) => {
  try {
    const collection = await Collection.findOne({ slug: req.params.slug });
    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }
    res.json(collection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/collections
// @desc    Create a new collection
// @access  Admin
router.post("/", protect, admin, async (req, res) => {
  try {
    const { slug, name, tagline, navbarDescription, image, order, isActive } = req.body;

    const exists = await Collection.findOne({ slug });
    if (exists) {
      return res.status(400).json({ message: "A collection with this slug already exists" });
    }

    const collection = await Collection.create({
      slug,
      name,
      tagline: tagline || "",
      navbarDescription: navbarDescription || "",
      image: image || "",
      order: order ?? 0,
      isActive: isActive !== false,
    });

    res.status(201).json(collection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/collections/:slug
// @desc    Update a collection
// @access  Admin
router.put("/:slug", protect, admin, async (req, res) => {
  try {
    const collection = await Collection.findOne({ slug: req.params.slug });
    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    const { name, tagline, navbarDescription, image, order, isActive, slug: newSlug } = req.body;

    if (newSlug && newSlug !== collection.slug) {
      const slugExists = await Collection.findOne({ slug: newSlug });
      if (slugExists) {
        return res.status(400).json({ message: "A collection with this slug already exists" });
      }
      collection.slug = newSlug;
    }

    if (name !== undefined) collection.name = name;
    if (tagline !== undefined) collection.tagline = tagline;
    if (navbarDescription !== undefined) collection.navbarDescription = navbarDescription;
    if (image !== undefined) collection.image = image;
    if (order !== undefined) collection.order = order;
    if (isActive !== undefined) collection.isActive = isActive;

    await collection.save();
    res.json(collection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/collections/:slug
// @desc    Delete a collection
// @access  Admin
router.delete("/:slug", protect, admin, async (req, res) => {
  try {
    const collection = await Collection.findOne({ slug: req.params.slug });
    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    await collection.deleteOne();
    res.json({ message: "Collection removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
