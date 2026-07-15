import Order from "../models/Order.js";
import Product from "../models/Product.js";
import PromoCode from "../models/PromoCode.js";
import CmsSetting from "../models/CmsSetting.js";
import Razorpay from "razorpay";
import transporter from "../utils/mailer.js";

// Initialize Razorpay SDK client in sandbox test mode
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

// @desc    Create a new order
// @route   POST /api/orders
// @access  Protected
export const createOrder = async (req, res) => {
  const {
    orderId,
    date,
    products,
    shippingDetails,
    billingDetails,
    paymentDetails,
    pricingBreakdown,
  } = req.body;

  try {
    // 1. Verify products & calculate subtotal on the server
    let serverSubtotal = 0;
    const productUpdates = [];
    const sanitizedProducts = [];
    
    for (const item of products) {
      const dbProduct = await Product.findOne({ id: Number(item.id) });
      
      if (!dbProduct) {
        return res.status(404).json({ message: `Piece "${item.name}" was not found in our catalog.` });
      }

      if (dbProduct.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for "${item.name}". Only ${dbProduct.stock} left in stock.`
        });
      }

      productUpdates.push({
        product: dbProduct,
        quantity: item.quantity
      });

      // Calculate line price using database price to prevent tampering
      serverSubtotal += dbProduct.price * item.quantity;

      sanitizedProducts.push({
        id: item.id,
        name: dbProduct.name,
        price: dbProduct.price,
        image: dbProduct.images?.[0] || dbProduct.image || "",
        quantity: item.quantity,
        color: item.color || "",
        size: item.size || ""
      });
    }

    // 2. Validate shipping cost on the server using CMS configuration
    let standardShippingFee = 0;
    let expressShippingFee = 500;
    let freeShippingThreshold = 25000;
    let codFee = 50;

    try {
      const cmsSettings = await CmsSetting.findOne({ key: "checkout_settings" });
      if (cmsSettings && cmsSettings.value) {
        if (cmsSettings.value.standardShippingFee !== undefined) {
          standardShippingFee = Number(cmsSettings.value.standardShippingFee);
        }
        if (cmsSettings.value.expressShippingFee !== undefined) {
          expressShippingFee = Number(cmsSettings.value.expressShippingFee);
        }
        if (cmsSettings.value.freeShippingThreshold !== undefined) {
          freeShippingThreshold = Number(cmsSettings.value.freeShippingThreshold);
        }
        if (cmsSettings.value.codFee !== undefined) {
          codFee = Number(cmsSettings.value.codFee);
        }
      }
    } catch (err) {
      console.error("Failed to load CMS checkout settings:", err);
    }

    const meetsThreshold = serverSubtotal >= freeShippingThreshold;
    let serverShipping = shippingDetails.method === "express"
      ? expressShippingFee
      : (meetsThreshold ? 0 : standardShippingFee);

    if (paymentDetails && (paymentDetails.method === "COD" || paymentDetails.method === "cod")) {
      serverShipping += codFee;
    }

    // 3. Validate promo code & calculate discount on the server
    let serverDiscount = 0;
    const requestedCode = pricingBreakdown?.promoCode;

    if (requestedCode) {
      const promo = await PromoCode.findOne({ code: requestedCode.toUpperCase() });
      if (!promo) {
        return res.status(400).json({ message: "Invalid promo code applied." });
      }
      if (!promo.isActive) {
        return res.status(400).json({ message: "This promo code is no longer active." });
      }
      if (promo.expiryDate && new Date(promo.expiryDate) < new Date()) {
        return res.status(400).json({ message: "This promo code has expired." });
      }
      if (serverSubtotal < promo.minPurchase) {
        return res.status(400).json({
          message: `This promo requires a minimum purchase of ₹${promo.minPurchase.toLocaleString("en-IN")}. Your order subtotal is ₹${serverSubtotal.toLocaleString("en-IN")}.`
        });
      }

      if (promo.discountType === "percentage") {
        serverDiscount = Math.round((serverSubtotal * promo.value) / 100);
      } else {
        serverDiscount = Math.min(promo.value, serverSubtotal);
      }
    }

    // 4. Calculate server total
    const serverTotal = serverSubtotal - serverDiscount + serverShipping;
    const totalCount = products.reduce((acc, p) => acc + p.quantity, 0);

    // 5. Decrement stock for each product
    for (const update of productUpdates) {
      update.product.stock -= update.quantity;
      await update.product.save();
    }

    // 5.5 Resolve payment instrument dynamically
    let resolvedPaymentMethod = "Online Payment";
    let resolvedPaymentStatus = "Pending";
    let resolvedTransactionToken = "";

    if (paymentDetails.method === "cod" || paymentDetails.method === "COD") {
      resolvedPaymentMethod = "Cash on Delivery (COD)";
      resolvedPaymentStatus = "Pending";
      resolvedTransactionToken = paymentDetails.transactionToken || `COD-${Date.now()}`;
    } else if (paymentDetails.razorpayPaymentId) {
      resolvedPaymentStatus = "Paid";
      resolvedTransactionToken = paymentDetails.razorpayPaymentId;
      try {
        const paymentInfo = await razorpay.payments.fetch(paymentDetails.razorpayPaymentId);
        if (paymentInfo && paymentInfo.method) {
          const methodType = paymentInfo.method;
          if (methodType === "card" && paymentInfo.card) {
            resolvedPaymentMethod = `${paymentInfo.card.network || "Credit/Debit"} Card (ending in ${paymentInfo.card.last4})`;
          } else if (methodType === "upi") {
            resolvedPaymentMethod = `UPI (${paymentInfo.vpa || "Paid via UPI"})`;
          } else if (methodType === "netbanking") {
            resolvedPaymentMethod = `Netbanking (${paymentInfo.bank || "Online Banking"})`;
          } else if (methodType === "wallet") {
            resolvedPaymentMethod = `Wallet (${paymentInfo.wallet || "Digital Wallet"})`;
          } else {
            resolvedPaymentMethod = `Razorpay (${methodType.toUpperCase()})`;
          }
        } else {
          resolvedPaymentMethod = "Razorpay Secure Gateway";
        }
      } catch (err) {
        console.error("Failed to fetch Razorpay details:", err);
        resolvedPaymentMethod = "Razorpay Secure Gateway";
      }
    } else {
      resolvedPaymentMethod = paymentDetails.method || "Online Payment";
      resolvedPaymentStatus = "Pending";
      resolvedTransactionToken = paymentDetails.transactionToken || "";
    }

    // 6. Create the order with verified server calculations
    const order = await Order.create({
      user: req.user._id, // Set by protect middleware
      orderId,
      date,
      total: `₹${serverTotal.toLocaleString("en-IN")}`,
      items: sanitizedProducts.map((p) => `${p.name} (x${p.quantity})`).join(", "),
      products: sanitizedProducts,
      shippingDetails: {
        name: shippingDetails.name,
        address: {
          street: shippingDetails.address?.street || "",
          apartment: shippingDetails.address?.apartment || "",
          city: shippingDetails.address?.city || "",
          state: shippingDetails.address?.state || "",
          zipCode: shippingDetails.address?.zipCode || "",
        },
        phone: shippingDetails.phone,
        method: shippingDetails.method,
      },
      billingDetails: {
        name: billingDetails?.name || shippingDetails.name,
        address: {
          street: billingDetails?.address?.street || shippingDetails.address?.street || "",
          apartment: billingDetails?.address?.apartment || shippingDetails.address?.apartment || "",
          city: billingDetails?.address?.city || shippingDetails.address?.city || "",
          state: billingDetails?.address?.state || shippingDetails.address?.state || "",
          zipCode: billingDetails?.address?.zipCode || shippingDetails.address?.zipCode || "",
        },
        phone: billingDetails?.phone || shippingDetails.phone,
      },
      paymentDetails: {
        paymentMethod: resolvedPaymentMethod,
        paymentStatus: resolvedPaymentStatus,
        transactionToken: resolvedTransactionToken
      },
      pricingBreakdown: {
        subtotal: serverSubtotal,
        discount: serverDiscount,
        shipping: serverShipping,
        total: serverTotal,
        promoCode: requestedCode || null
      },
    });

    // Send confirmation email inside createOrder (upon successful database save)
    try {
      const mailOptions = {
        from: `"Novella Atelier" <${process.env.SMTP_USER}>`,
        to: req.user.email,
        subject: `Your Order Confirmation - ${orderId}`,
        html: `
          <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; padding: 32px; border-radius: 4px; background-color: #ffffff;">
            <h2 style="font-size: 20px; font-weight: 300; color: #111827; text-align: center; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 24px;">Novella Atelier</h2>
            <p style="font-size: 13px; color: #4b5563; line-height: 1.6; margin-bottom: 20px;">Dear ${req.user.name || "Customer"},</p>
            <p style="font-size: 13px; color: #4b5563; line-height: 1.6; margin-bottom: 24px;">Thank you for your order! We are preparing your curated designer items for shipment. Here are your order details:</p>
            
            <div style="background-color: #f9fafb; padding: 16px; border-radius: 2px; margin-bottom: 24px; font-size: 12px; color: #4b5563; line-height: 1.6;">
              <strong>Order Reference ID:</strong> ${orderId}<br/>
              <strong>Fulfillment Status:</strong> Processing<br/>
              <strong>Shipping Address:</strong> ${shippingDetails.address?.street || shippingDetails.address || ""}, ${shippingDetails.address?.city || ""}, ${shippingDetails.address?.state || ""} ${shippingDetails.address?.zipCode || ""}<br/>
              <strong>Recalculated Total:</strong> ₹${serverTotal.toLocaleString("en-IN")}
            </div>

            <h3 style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;">Items Ordered</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 12px; color: #4b5563; margin-bottom: 24px;">
              <thead>
                <tr style="border-bottom: 1px solid #e5e7eb; text-align: left;">
                  <th style="padding: 8px 0;">Item</th>
                  <th style="padding: 8px 0; text-align: center;">Qty</th>
                  <th style="padding: 8px 0; text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${sanitizedProducts.map(p => `
                  <tr style="border-bottom: 1px solid #f3f4f6;">
                    <td style="padding: 8px 0;">${p.name}</td>
                    <td style="padding: 8px 0; text-align: center;">${p.quantity}</td>
                    <td style="padding: 8px 0; text-align: right;">₹${p.price.toLocaleString("en-IN")}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>

            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
            <p style="font-size: 10px; color: #9ca3af; text-align: center;">Novella Co. premium home design atelier.</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log(`[ORDER EMAIL CONFIRMATION SENT] to ${req.user.email} for order ${orderId}`);
    } catch (mailError) {
      console.error("Order confirmation email failed to send:", mailError.message);
    }

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

// Helper to restore product stock when an order is cancelled
const restoreOrderStock = async (order) => {
  for (const item of order.products) {
    const product = await Product.findOne({ id: Number(item.id) });
    if (product) {
      product.stock += item.quantity;
      await product.save();
    }
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
      // Validation: Cancelled or Returned orders cannot change status (unless admin explicitly resets it)
      if ((order.status === "Cancelled" || order.status === "Returned") && status === order.status) {
        return res.status(400).json({
          message: `Cannot update status because this order is already ${order.status.toLowerCase()}.`
        });
      }

      // If transitioning to Cancelled, restore stock
      if (status === "Cancelled" && order.status !== "Cancelled") {
        await restoreOrderStock(order);
      }

      // If moving FROM Cancelled back to active state, re-verify and decrement stock
      if (order.status === "Cancelled" && status !== "Cancelled") {
        for (const item of order.products) {
          const product = await Product.findOne({ id: Number(item.id) });
          if (product) {
            if (product.stock < item.quantity) {
              return res.status(400).json({
                message: `Cannot reactivate order: Piece "${item.name}" has insufficient stock. Only ${product.stock} left in database.`
              });
            }
          }
        }
        // Decrement stock
        for (const item of order.products) {
          const product = await Product.findOne({ id: Number(item.id) });
          if (product) {
            product.stock -= item.quantity;
            await product.save();
          }
        }
      }

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

// @desc    Get order by ID
// @route   GET /api/orders/:orderId
// @access  Protected
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    // Security Check: Only the customer who placed the order or an Admin can view it
    if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized to view this order details." });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order: " + error.message });
  }
};

// @desc    Cancel order (Customer only)
// @route   PUT /api/orders/:orderId/cancel
// @access  Protected
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    // Security Check: Only the owner of the order can cancel it
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to cancel this order." });
    }

    // Validation: Only processing orders can be cancelled
    if (order.status !== "Processing") {
      return res.status(400).json({
        message: `Order cannot be cancelled because it is already ${order.status.toLowerCase()}.`,
      });
    }

    order.status = "Cancelled";
    await restoreOrderStock(order);
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Failed to cancel order: " + error.message });
  }
};

// @desc    Return order (Customer only)
// @route   PUT /api/orders/:orderId/return
// @access  Protected
export const returnOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    // Security Check: Only the owner of the order can return it
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to request return for this order." });
    }

    // Validation: Only delivered orders can be returned
    if (order.status !== "Delivered") {
      return res.status(400).json({
        message: "Only delivered orders can be returned.",
      });
    }

    // Validation: Check standard 30-day return policy window
    const createdTime = new Date(order.createdAt).getTime();
    const daysPassed = (Date.now() - createdTime) / (1000 * 60 * 60 * 24);

    if (daysPassed > 30) {
      return res.status(400).json({
        message: "This purchase is past our 30-day return policy limit.",
      });
    }

    order.status = "Return Requested";
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Failed to process return request: " + error.message });
  }
};

// @desc    Initialize a secure Razorpay Order transaction
// @route   POST /api/orders/razorpay
// @access  Protected
export const createRazorpayOrder = async (req, res) => {
  const { products, shippingDetails, pricingBreakdown } = req.body;

  try {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(400).json({ message: "Razorpay credentials are not configured on the backend server." });
    }

    // 1. Verify products & calculate subtotal on the server
    let serverSubtotal = 0;
    for (const item of products) {
      const dbProduct = await Product.findOne({ id: Number(item.id) });
      if (!dbProduct) {
        return res.status(404).json({ message: `Piece "${item.name}" was not found in our catalog.` });
      }
      serverSubtotal += dbProduct.price * item.quantity;
    }

    // 2. Validate shipping cost on the server
    const serverShipping = shippingDetails.method === "express" ? 250 : 0;

    // 3. Validate promo code & calculate discount on the server
    let serverDiscount = 0;
    const requestedCode = pricingBreakdown?.promoCode;

    if (requestedCode) {
      const promo = await PromoCode.findOne({ code: requestedCode.toUpperCase() });
      if (promo && promo.isActive && (!promo.expiryDate || new Date(promo.expiryDate) >= new Date())) {
        if (serverSubtotal >= promo.minPurchase) {
          if (promo.discountType === "percentage") {
            serverDiscount = Math.round((serverSubtotal * promo.value) / 100);
          } else {
            serverDiscount = Math.min(promo.value, serverSubtotal);
          }
        }
      }
    }

    // 4. Calculate server total
    const serverTotal = serverSubtotal - serverDiscount + serverShipping;

    // 5. Create Razorpay order (amount is in smallest currency unit, i.e., paise for INR)
    const isDev = process.env.NODE_ENV === "development" || !process.env.NODE_ENV;
    let finalAmount = serverTotal * 100;
    
    // Razorpay Test Mode has a strict transaction limit of ₹5,00,000 (5 Lakhs INR).
    // In local development, if the order total exceeds this, we clamp it to ₹4,00,000 for the gateway, 
    // while keeping the actual order records correct in MongoDB.
    if (isDev && serverTotal > 400000) {
      console.log(`[DEV MODE] Capping Razorpay payment amount of ₹${serverTotal} to ₹4,00,000 for test sandbox limits.`);
      finalAmount = 400000 * 100;
    }

    const options = {
      amount: finalAmount,
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Return the razorpay order details, including our recalculated pricing breakdown
    res.status(200).json({
      key: process.env.RAZORPAY_KEY_ID,
      razorpayOrder,
      pricingBreakdown: {
        subtotal: serverSubtotal,
        discount: serverDiscount,
        shipping: serverShipping,
        total: serverTotal,
        promoCode: requestedCode || null
      }
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    const detailMsg = error.error?.description || error.message || "Unknown Razorpay error";
    res.status(500).json({ message: "Failed to create Razorpay order: " + detailMsg });
  }
};

// @desc    Refund a cancelled or returned order (Admin Only)
// @route   PUT /api/orders/:orderId/refund
// @access  Protected/Admin
export const refundOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });

    if (!order) {
      return res.status(404).json({ message: "Order not found in registry." });
    }

    // Check if order is eligible for refund
    if (order.status !== "Cancelled" && order.status !== "Returned") {
      return res.status(400).json({
        message: "Only Cancelled or Returned orders can be refunded by the atelier desk."
      });
    }

    if (order.paymentDetails.paymentStatus === "Refunded") {
      return res.status(400).json({ message: "This order has already been fully refunded." });
    }

    // Process refund state
    order.paymentDetails.paymentStatus = "Refunded";
    
    // Track simulated refund transaction ID
    const refundTxId = `ref_${Math.random().toString(36).substring(2, 11)}`;
    order.paymentDetails.transactionToken = refundTxId;

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Refund processing error:", error);
    res.status(500).json({ message: "Failed to process order refund: " + error.message });
  }
};

// @desc    Track order publicly (Sanitized payload, no authentication required)
// @route   GET /api/orders/track/:orderId
// @access  Public
export const trackOrderPublicly = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    // Return only public, non-PII details for tracking
    const sanitizedOrder = {
      orderId: order.orderId,
      status: order.status,
      items: order.products.map(p => ({
        name: p.name,
        quantity: p.quantity,
        price: p.price
      })),
      totalAmount: order.pricingBreakdown?.total || 0,
      createdAt: order.createdAt
    };

    res.status(200).json(sanitizedOrder);
  } catch (error) {
    res.status(500).json({ message: "Failed to track order: " + error.message });
  }
};
