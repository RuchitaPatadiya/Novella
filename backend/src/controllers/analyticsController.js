import Order from "../models/Order.js";
import Product from "../models/Product.js";
import ContactMessage from "../models/ContactMessage.js";

// @desc    Get dashboard analytics metrics
// @route   GET /api/analytics/admin
// @access  Protected/Admin
export const getAdminAnalytics = async (req, res) => {
  try {
    const orders = await Order.find({});
    const products = await Product.find({});
    const contacts = await ContactMessage.find({});

    // 1. Calculate General Aggregations
    const paidOrders = orders.filter(ord => ord.paymentDetails?.paymentStatus === "Paid");
    const totalRevenue = paidOrders.reduce((sum, ord) => sum + (ord.pricingBreakdown?.total || 0), 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const openEnquiries = contacts.filter(c => c.status === "New" || c.status === "Read").length;

    // 2. Order Status Counts
    const statusCounts = {
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
    };
    orders.forEach(ord => {
      if (statusCounts[ord.status] !== undefined) {
        statusCounts[ord.status]++;
      }
    });

    // 3. Product Inventory Status
    const outOfStock = products.filter(p => p.stock === 0).length;
    const lowStock = products.filter(p => p.stock > 0 && p.stock <= 5).length;
    const totalStockValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

    // 4. Sales Revenue by Month (Last 6 Months)
    const monthlySalesMap = {};
    
    // Seed last 6 months to make sure we always have data points even if empty
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const label = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      monthlySalesMap[label] = 0;
    }

    paidOrders.forEach(ord => {
      const date = new Date(ord.createdAt);
      const label = date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      if (monthlySalesMap[label] !== undefined) {
        monthlySalesMap[label] += ord.pricingBreakdown?.total || 0;
      }
    });

    const salesTrend = Object.keys(monthlySalesMap).map(month => ({
      month,
      revenue: monthlySalesMap[month]
    }));

    // 5. Top 5 Best Selling Products
    const productSalesMap = {};
    paidOrders.forEach(ord => {
      ord.products.forEach(item => {
        if (!productSalesMap[item.id]) {
          productSalesMap[item.id] = {
            name: item.name,
            quantity: 0,
            revenue: 0
          };
        }
        productSalesMap[item.id].quantity += item.quantity;
        productSalesMap[item.id].revenue += item.price * item.quantity;
      });
    });

    const bestSellers = Object.values(productSalesMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    res.status(200).json({
      summary: {
        totalRevenue,
        totalOrders,
        totalProducts,
        openEnquiries,
        outOfStock,
        lowStock,
        totalStockValue
      },
      statusCounts,
      salesTrend,
      bestSellers
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch analytics: " + error.message });
  }
};
