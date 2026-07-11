import CmsSetting from "../models/CmsSetting.js";

// @desc    Get a specific CMS setting by key
// @route   GET /api/cms/:key
// @access  Public
export const getCmsSetting = async (req, res) => {
  try {
    const setting = await CmsSetting.findOne({ key: req.params.key });
    if (setting) {
      res.status(200).json(setting.value);
    } else {
      res.status(404).json({ message: `CMS setting with key "${req.params.key}" not found` });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching CMS setting: " + error.message });
  }
};

// @desc    Get all CMS settings
// @route   GET /api/cms
// @access  Public
export const getAllCmsSettings = async (req, res) => {
  try {
    const settings = await CmsSetting.find({});
    // Return as key-value map for easier client consumption
    const settingsMap = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    res.status(200).json(settingsMap);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all CMS settings: " + error.message });
  }
};

// @desc    Create or update a CMS setting
// @route   PUT /api/cms/:key
// @access  Protected/Admin
export const updateCmsSetting = async (req, res) => {
  const { value } = req.body;
  
  if (value === undefined) {
    return res.status(400).json({ message: "Setting value is required" });
  }

  try {
    const setting = await CmsSetting.findOneAndUpdate(
      { key: req.params.key },
      { value },
      { new: true, upsert: true }
    );
    res.status(200).json({ message: "Setting updated successfully", key: setting.key, value: setting.value });
  } catch (error) {
    res.status(500).json({ message: "Error updating CMS setting: " + error.message });
  }
};
