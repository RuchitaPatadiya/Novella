import Order from "../models/Order.js";
import Product from "../models/Product.js";
import ContactMessage from "../models/ContactMessage.js";
import Review from "../models/Review.js";
import Category from "../models/Category.js";
import User from "../models/User.js";
import CmsSetting from "../models/CmsSetting.js";

// @desc    Get public-facing stats for the About page (computed live)
// @route   GET /api/analytics/public-stats
// @access  Public
export const getPublicStats = async (req, res) => {
  try {
    // Run all counts in parallel for speed
    const [
      productCount,
      deliveredOrderCount,
      uniqueCustomerCount,
      categoryCount,
      reviewAgg,
      cmsOverrides,
    ] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments({ status: "Delivered" }),
      Order.distinct("user").then(ids => ids.length),
      Category.countDocuments({ isActive: true }),
      Review.aggregate([
        { $match: { isApproved: true } },
        { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
      ]),
      CmsSetting.findOne({ key: "about_stats" }),
    ]);

    const avgRating = reviewAgg.length > 0
      ? (Math.round(reviewAgg[0].avg * 10) / 10)
      : 4.9; // graceful fallback if no reviews yet
    const reviewCount = reviewAgg.length > 0 ? reviewAgg[0].count : 0;

    // Format numbers nicely
    const formatCount = (n) => {
      if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k+`;
      return `${n}+`;
    };

    // Dynamic stats computed from database
    const dynamicStats = [
      {
        key: "products",
        number: formatCount(productCount),
        label: "Original Designs",
        desc: "Every piece conceived in-house",
        source: "dynamic",
      },
      {
        key: "happy_homes",
        number: formatCount(deliveredOrderCount || uniqueCustomerCount),
        label: "Happy Homes",
        desc: "Across India and beyond",
        source: "dynamic",
      },
      {
        key: "avg_rating",
        number: reviewCount > 0 ? `${avgRating}★` : "4.9★",
        label: "Average Rating",
        desc: reviewCount > 0
          ? `From ${reviewCount} verified reviews`
          : "From our verified customers",
        source: "dynamic",
      },
      {
        key: "categories",
        number: `${categoryCount}`,
        label: "Categories",
        desc: "Curated design collections",
        source: "dynamic",
      },
    ];

    // If admin has CMS overrides, merge them in:
    // Any CMS stat with source:"manual" replaces the dynamic one at that index
    if (cmsOverrides?.value && Array.isArray(cmsOverrides.value)) {
      const manualStats = cmsOverrides.value.filter(s => s.source === "manual");
      // Append manual-only stats at the end (admin can add extra stats)
      manualStats.forEach(manual => {
        const existingIdx = dynamicStats.findIndex(d => d.key === manual.key);
        if (existingIdx >= 0) {
          dynamicStats[existingIdx] = { ...manual };
        } else {
          dynamicStats.push({ ...manual });
        }
      });
    }

    res.status(200).json(dynamicStats);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch public stats: " + error.message });
  }
};

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
