import PromoCode from "../models/PromoCode.js";

// @desc    Validate a promo code
// @route   POST /api/promos/validate
// @access  Protected
export const validatePromoCode = async (req, res) => {
  const { code, cartSubtotal } = req.body;
  console.log(`[PROMO VALIDATION] Request received for code: "${code}", subtotal: ${cartSubtotal}`);

  try {
    if (!code) {
      console.log("[PROMO VALIDATION] Failed: code is empty");
      return res.status(400).json({ message: "Promo code string is required." });
    }

    const promo = await PromoCode.findOne({ code: code.toUpperCase() });
    console.log("[PROMO VALIDATION] Found promo document:", promo);

    if (!promo) {
      console.log(`[PROMO VALIDATION] Failed: code "${code}" not found in database`);
      return res.status(404).json({ message: "Invalid promo code." });
    }

    if (!promo.isActive) {
      console.log(`[PROMO VALIDATION] Failed: promo "${code}" is inactive`);
      return res.status(400).json({ message: "This promo code is no longer active." });
    }

    if (promo.expiryDate && new Date(promo.expiryDate) < new Date()) {
      console.log(`[PROMO VALIDATION] Failed: promo "${code}" is expired. Expiry: ${promo.expiryDate}, Current: ${new Date()}`);
      return res.status(400).json({ message: "This promo code has expired." });
    }

    const numericSubtotal = Number(cartSubtotal) || 0;
    console.log(`[PROMO VALIDATION] Comparing subtotal ${numericSubtotal} against minimum ${promo.minPurchase}`);
    if (numericSubtotal < promo.minPurchase) {
      console.log(`[PROMO VALIDATION] Failed: subtotal ${numericSubtotal} < minPurchase ${promo.minPurchase}`);
      return res.status(400).json({
        message: `This promo requires a minimum purchase of ₹${promo.minPurchase.toLocaleString("en-IN")}. Your order total is ₹${numericSubtotal.toLocaleString("en-IN")}.`,
      });
    }

    // Calculate discount amount based on type
    let discountAmount = 0;
    if (promo.discountType === "percentage") {
      discountAmount = Math.round((numericSubtotal * promo.value) / 100);
    } else {
      discountAmount = Math.min(promo.value, numericSubtotal); // Cannot discount more than the subtotal
    }

    res.status(200).json({
      valid: true,
      code: promo.code,
      discountType: promo.discountType,
      value: promo.value,
      discountAmount,
      message: `Promo code "${promo.code}" applied successfully!`
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to validate promo code: " + error.message });
  }
};

// @desc    Get all promo codes (Admin only)
// @route   GET /api/promos/admin
// @access  Protected/Admin
export const getAllPromosForAdmin = async (req, res) => {
  try {
    const promos = await PromoCode.find({}).sort("-createdAt");
    res.status(200).json(promos);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch promotions: " + error.message });
  }
};

// @desc    Create a new promo code (Admin only)
// @route   POST /api/promos
// @access  Protected/Admin
export const createPromoCode = async (req, res) => {
  const { code, discountType, value, minPurchase, expiryDate } = req.body;

  try {
    if (!code || !value || !expiryDate) {
      return res.status(400).json({ message: "Code, discount value, and expiry date are required." });
    }

    const promoExists = await PromoCode.findOne({ code: code.toUpperCase() });
    if (promoExists) {
      return res.status(400).json({ message: "A promo code with this name already exists." });
    }

    const promo = await PromoCode.create({
      code: code.toUpperCase(),
      discountType: discountType || "percentage",
      value: Number(value),
      minPurchase: minPurchase ? Number(minPurchase) : 0,
      expiryDate: new Date(expiryDate),
      isActive: true
    });

    res.status(201).json(promo);
  } catch (error) {
    res.status(500).json({ message: "Failed to create promo code: " + error.message });
  }
};

// @desc    Delete a promo code (Admin only)
// @route   DELETE /api/promos/:id
// @access  Protected/Admin
export const deletePromoCode = async (req, res) => {
  try {
    const promo = await PromoCode.findById(req.params.id);
    if (!promo) {
      return res.status(404).json({ message: "Promo code not found." });
    }

    await promo.deleteOne();
    res.status(200).json({ message: "Promo code deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete promo code: " + error.message });
  }
};
