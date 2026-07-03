import Order from "../models/Order.js";

// @desc    Create a new order
// @route   POST /api/orders
// @access  Protected
export const createOrder = async (req, res) => {
  const {
    orderId,
    date,
    total,
    items,
    products,
    shippingDetails,
    paymentDetails,
    pricingBreakdown,
  } = req.body;

  try {
    const order = await Order.create({
      user: req.user._id, // Set by protect middleware
      orderId,
      date,
      total,
      items,
      products,
      shippingDetails,
      paymentDetails,
      pricingBreakdown,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to create order: " + error.message });
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Protected
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort("-createdAt");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders: " + error.message });
  }
};

// @desc    Get all orders across the store (Admin Only)
// @route   GET /api/orders/admin
// @access  Protected/Admin
export const getAdminOrders = async (req, res) => {
  try {
    // Populate user name and email from the User collection
    const orders = await Order.find({})
      .populate("user", "name email")
      .sort("-createdAt");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch store orders: " + error.message });
  }
};

// @desc    Update order shipping/delivery status (Admin Only)
// @route   PUT /api/orders/:orderId/status
// @access  Protected/Admin
export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const order = await Order.findOne({ orderId: req.params.orderId });

    if (order) {
      order.status = status;
      const updatedOrder = await order.save();
      res.status(200).json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order registry not found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status: " + error.message });
  }
};
