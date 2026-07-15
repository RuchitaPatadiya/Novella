import Showcase from "../models/Showcase.js";

// @desc    Get all community showcases
// @route   GET /api/showcases
// @access  Public
export const getShowcases = async (req, res) => {
  try {
    const showcases = await Showcase.find({}).sort("-createdAt");
    res.status(200).json(showcases);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch showcases: " + error.message });
  }
};

// @desc    Create a new showcase
// @route   POST /api/showcases
// @access  Protected/Admin
export const createShowcase = async (req, res) => {
  const { handle, image, space, productName, productId } = req.body;

  if (!handle || !image || !space || !productName || !productId) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const showcase = await Showcase.create({
      handle,
      image,
      space,
      productName,
      productId,
    });
    res.status(201).json(showcase);
  } catch (error) {
    res.status(500).json({ message: "Failed to create showcase: " + error.message });
  }
};

// @desc    Delete a showcase
// @route   DELETE /api/showcases/:id
// @access  Protected/Admin
export const deleteShowcase = async (req, res) => {
  try {
    const showcase = await Showcase.findById(req.params.id);

    if (showcase) {
      await showcase.deleteOne();
      res.status(200).json({ message: "Showcase removed successfully" });
    } else {
      res.status(404).json({ message: "Showcase not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to delete showcase: " + error.message });
  }
};
