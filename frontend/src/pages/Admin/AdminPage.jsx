import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../context/ProductContext";
import API from "../../services/api";

const AdminPage = () => {
  const { logout, user, loading } = useAuth();
  const { products, addProduct, editProduct, deleteProduct } = useProducts();
  const navigate = useNavigate();

  // Navigation Panel State: "overview" | "orders" | "catalog" | "reviews" | "promotions"
  const [activePanel, setActivePanel] = useState("overview");

  // Orders registry state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderSearchQuery, setOrderSearchQuery] = useState("");

  // Reviews moderation state
  const [adminReviews, setAdminReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewFilterStatus, setReviewFilterStatus] = useState("All");

  // Promo code states
  const [promos, setPromos] = useState([]);
  const [promosLoading, setPromosLoading] = useState(true);
  
  // Contact messages state
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Store Analytics state
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      const res = await API.get("/analytics/admin");
      setAnalytics(res.data);
    } catch (err) {
      console.error("Failed to load store analytics:", err);
      setAnalytics(null);
    } finally {
      setAnalyticsLoading(false);
    }
  };
  const [promoFormData, setPromoFormData] = useState({
    code: "",
    discountType: "percentage",
    value: "",
    minPurchase: "",
    expiryDate: ""
  });
  const [promoFormError, setPromoFormError] = useState("");
  const [promoFormSuccess, setPromoFormSuccess] = useState("");

  // Product Form Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null); // null if adding new, number ID if editing
  const [formData, setFormData] = useState({
    name: "",
    category: "furniture",
    price: "",
    originalPrice: "",
    stock: 10,
    images: [""],
    description: "",
    dimSpec: "",
    matSpec: "",
    careInstructions: "",
    spaces: [],
    collections: [],
    subcategory: "",
  });

  const [formSuccess, setFormSuccess] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Editor preview tabs
  const [descTab, setDescTab] = useState("write"); // write | preview
  const [careTab, setCareTab] = useState("write"); // write | preview

  // Catalog filter states
  const [catalogSearch, setCatalogSearch] = useState("");
  const [catalogCategory, setCatalogCategory] = useState("All");
  const [catalogStock, setCatalogStock] = useState("All"); // All | in-stock | low-stock | out-of-stock
  const [catalogSort, setCatalogSort] = useState("name-asc"); // name-asc | name-desc | price-asc | price-desc | stock-asc | stock-desc

  // Dynamic categories, collections, and subcategories states
  const [taxSubTab, setTaxSubTab] = useState("categories"); // categories | collections | subcategories
  const [isUploadingCatImage, setIsUploadingCatImage] = useState(false);
  const [isUploadingCollImage, setIsUploadingCollImage] = useState(false);
  const [isDraggingCat, setIsDraggingCat] = useState(false);
  const [isDraggingColl, setIsDraggingColl] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [collections, setCollections] = useState([]);
  const [collectionsLoading, setCollectionsLoading] = useState(true);
  const [subcategories, setSubcategories] = useState([]);
  const [subcategoriesLoading, setSubcategoriesLoading] = useState(true);
  const [isUploadingSubImage, setIsUploadingSubImage] = useState(false);
  const [isDraggingSub, setIsDraggingSub] = useState(false);
  const [isUploadingCmsHeroImage, setIsUploadingCmsHeroImage] = useState(false);
  const [isDraggingCmsHero, setIsDraggingCmsHero] = useState(false);
  const [isUploadingCmsPromoImage, setIsUploadingCmsPromoImage] = useState(false);
  const [isDraggingCmsPromo, setIsDraggingCmsPromo] = useState(false);
  const [cmsTeamUploadingIdx, setCmsTeamUploadingIdx] = useState(null);

  // Categories form state
  const [categoryFormData, setCategoryFormData] = useState({
    slug: "",
    name: "",
    description: "",
    navbarDescription: "",
    heroImage: "",
    order: 0,
    isActive: true,
  });
  const [editingCategorySlug, setEditingCategorySlug] = useState(null); // null if adding new
  const [categoryFormError, setCategoryFormError] = useState("");
  const [categoryFormSuccess, setCategoryFormSuccess] = useState("");

  // Collections form state
  const [collectionFormData, setCollectionFormData] = useState({
    slug: "",
    name: "",
    tagline: "",
    navbarDescription: "",
    image: "",
    order: 0,
    isActive: true,
  });
  const [editingCollectionSlug, setEditingCollectionSlug] = useState(null); // null if adding new
  const [collectionFormError, setCollectionFormError] = useState("");
  const [collectionFormSuccess, setCollectionFormSuccess] = useState("");

  // Subcategories form state
  const [subcategoryFormData, setSubcategoryFormData] = useState({
    slug: "",
    name: "",
    category: "",
    image: "",
    order: 0,
    isActive: true,
  });
  const [editingSubcategorySlug, setEditingSubcategorySlug] = useState(null); // null if adding new
  const [subcategoryFormError, setSubcategoryFormError] = useState("");
  const [subcategoryFormSuccess, setSubcategoryFormSuccess] = useState("");

  // Showcases states
  const [showcases, setShowcases] = useState([]);
  const [showcasesLoading, setShowcasesLoading] = useState(true);
  const [showcaseFormData, setShowcaseFormData] = useState({
    handle: "",
    space: "",
    productName: "",
    productId: "",
    image: ""
  });
  const [showcaseFormError, setShowcaseFormError] = useState("");
  const [showcaseFormSuccess, setShowcaseFormSuccess] = useState("");
  const [isUploadingShowcaseImage, setIsUploadingShowcaseImage] = useState(false);
  const [isDraggingShowcase, setIsDraggingShowcase] = useState(false);

  // Fetch orders from database
  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const res = await API.get("/orders/admin");
      const mappedDb = res.data.map(order => ({
        id: order.orderId,
        customer: order.shippingDetails?.name || (order.user?.name || "Customer"),
        email: order.user?.email || "customer@example.com",
        date: order.date,
        total: order.total,
        status: order.status,
        items: order.items,
        phone: order.shippingDetails?.phone || "Not specified",
        address: order.shippingDetails?.address || "Not specified",
        method: order.shippingDetails?.method || "standard",
        products: order.products || [],
        pricingBreakdown: order.pricingBreakdown || { subtotal: 0, discount: 0, shipping: 0, total: 0 },
        paymentDetails: order.paymentDetails || { method: "razorpay" }
      }));
      setOrders(mappedDb);
    } catch (err) {
      console.error("Failed to load store orders:", err);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Fetch reviews for admin moderation
  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const res = await API.get("/products/admin/reviews");
      setAdminReviews(res.data);
    } catch (err) {
      console.error("Failed to load admin reviews:", err);
      setAdminReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  // Fetch promo codes
  const fetchPromos = async () => {
    try {
      setPromosLoading(true);
      const res = await API.get("/promos/admin");
      setPromos(res.data);
    } catch (err) {
      console.error("Failed to load promo codes:", err);
      setPromos([]);
    } finally {
      setPromosLoading(false);
    }
  };

  // Fetch contact messages
  const fetchMessages = async () => {
    try {
      setMessagesLoading(true);
      const res = await API.get("/contact/admin");
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to load contact messages:", err);
      setMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  };

  // CMS state management
  const [cmsSubTab, setCmsSubTab] = useState("hero");
  const [cmsHero, setCmsHero] = useState({
    eyebrow: "",
    headline: "",
    subtext: "",
    ctaText: "",
    ctaLink: "",
    image: ""
  });
  const [cmsPromo, setCmsPromo] = useState({
    eyebrow: "",
    title: "",
    code: "",
    subtext: "",
    image: "",
    linkText: "",
    linkPath: ""
  });
  const [cmsFaqs, setCmsFaqs] = useState([]);
  const [cmsTeam, setCmsTeam] = useState([]);
  const [cmsSpaces, setCmsSpaces] = useState([]);
  const [cmsPerks, setCmsPerks] = useState([]);
  const [cmsCheckout, setCmsCheckout] = useState({
    standardShippingFee: 0,
    expressShippingFee: 500,
    freeShippingThreshold: 25000,
    codFee: 50,
    taxRate: 18
  });
  const [cmsAboutStats, setCmsAboutStats] = useState([]);
  const [cmsAboutMilestones, setCmsAboutMilestones] = useState([]);
  const [cmsShopTheLook, setCmsShopTheLook] = useState({
    image: "",
    title: "",
    subtitle: "",
    buttonText: "",
    buttonLink: "",
    hotspots: []
  });
  const [isUploadingCmsShowcaseImage, setIsUploadingCmsShowcaseImage] = useState(false);
  const [isDraggingCmsShowcase, setIsDraggingCmsShowcase] = useState(false);
  const [selectedHotspotIdx, setSelectedHotspotIdx] = useState(0);

  const [cmsLoading, setCmsLoading] = useState(false);
  const [cmsSuccess, setCmsSuccess] = useState("");
  const [cmsError, setCmsError] = useState("");

  const fetchCmsSettings = async () => {
    try {
      setCmsLoading(true);
      const res = await API.get("/cms");
      const data = res.data;
      if (data) {
        if (data.home_hero) setCmsHero(data.home_hero);
        if (data.home_editorial_promo) setCmsPromo(data.home_editorial_promo);
        if (data.faqs_list) setCmsFaqs(data.faqs_list);
        if (data.team_members) setCmsTeam(data.team_members);
        if (data.home_spaces) setCmsSpaces(data.home_spaces);
        if (data.brand_perks) setCmsPerks(data.brand_perks);
        if (data.checkout_settings) setCmsCheckout(data.checkout_settings);
        if (data.about_stats) setCmsAboutStats(data.about_stats);
        if (data.about_milestones) setCmsAboutMilestones(data.about_milestones);
        if (data.shop_the_look) setCmsShopTheLook(data.shop_the_look);
      }
    } catch (err) {
      console.error("Failed to load CMS settings:", err);
    } finally {
      setCmsLoading(false);
    }
  };

  const handleSaveCmsKey = async (key, value) => {
    setCmsError("");
    setCmsSuccess("");
    try {
      await API.put(`/cms/${key}`, { value });
      setCmsSuccess(`CMS section "${key}" saved successfully!`);
      // Reload settings
      fetchCmsSettings();
    } catch (err) {
      console.error("Failed to save CMS key:", err);
      setCmsError(err.response?.data?.message || "Failed to save CMS configuration.");
    }
  };

  const uploadCmsHeroImage = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setCmsError("Only image files are supported.");
      return;
    }
    try {
      setIsUploadingCmsHeroImage(true);
      setCmsError("");
      const payload = new FormData();
      payload.append("image", file);
      const res = await API.post("/products/upload", payload, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.data?.url) {
        setCmsHero((prev) => ({ ...prev, image: res.data.url }));
        setCmsSuccess("Hero background image uploaded successfully!");
        setTimeout(() => setCmsSuccess(""), 4000);
      }
    } catch (err) {
      console.error("Hero CMS image upload failed:", err);
      setCmsError(err.response?.data?.message || "Failed to upload image.");
    } finally {
      setIsUploadingCmsHeroImage(false);
    }
  };

  const uploadCmsShowcaseImage = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setCmsError("Only image files are supported.");
      return;
    }
    try {
      setIsUploadingCmsShowcaseImage(true);
      setCmsError("");
      const payload = new FormData();
      payload.append("image", file);
      const res = await API.post("/products/upload", payload, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.data?.url) {
        setCmsShopTheLook((prev) => ({ ...prev, image: res.data.url }));
        setCmsSuccess("Interactive showcase backdrop image uploaded successfully!");
        setTimeout(() => setCmsSuccess(""), 4000);
      }
    } catch (err) {
      console.error("Showcase backdrop upload failed:", err);
      setCmsError(err.response?.data?.message || "Failed to upload image.");
    } finally {
      setIsUploadingCmsShowcaseImage(false);
    }
  };

  const uploadCmsPromoImage = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setCmsError("Only image files are supported.");
      return;
    }
    try {
      setIsUploadingCmsPromoImage(true);
      setCmsError("");
      const payload = new FormData();
      payload.append("image", file);
      const res = await API.post("/products/upload", payload, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.data?.url) {
        setCmsPromo((prev) => ({ ...prev, image: res.data.url }));
        setCmsSuccess("Promo banner image uploaded successfully!");
        setTimeout(() => setCmsSuccess(""), 4000);
      }
    } catch (err) {
      console.error("Promo CMS image upload failed:", err);
      setCmsError(err.response?.data?.message || "Failed to upload image.");
    } finally {
      setIsUploadingCmsPromoImage(false);
    }
  };

  const uploadCmsTeamImage = async (file, idx) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setCmsError("Only image files are supported.");
      return;
    }
    try {
      setCmsTeamUploadingIdx(idx);
      setCmsError("");
      const payload = new FormData();
      payload.append("image", file);
      const res = await API.post("/products/upload", payload, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.data?.url) {
        const updated = [...cmsTeam];
        updated[idx].image = res.data.url;
        setCmsTeam(updated);
        setCmsSuccess(`Team member #${idx + 1} portrait uploaded successfully!`);
        setTimeout(() => setCmsSuccess(""), 4000);
      }
    } catch (err) {
      console.error("Team CMS portrait upload failed:", err);
      setCmsError(err.response?.data?.message || "Failed to upload image.");
    } finally {
      setCmsTeamUploadingIdx(null);
    }
  };

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const res = await API.get("/categories?all=true");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to load categories:", err);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const fetchCollections = async () => {
    try {
      setCollectionsLoading(true);
      const res = await API.get("/collections?all=true");
      setCollections(res.data);
    } catch (err) {
      console.error("Failed to load collections:", err);
    } finally {
      setCollectionsLoading(false);
    }
  };

  const fetchSubcategories = async () => {
    try {
      setSubcategoriesLoading(true);
      const res = await API.get("/subcategories?all=true");
      setSubcategories(res.data);
    } catch (err) {
      console.error("Failed to load subcategories:", err);
    } finally {
      setSubcategoriesLoading(false);
    }
  };

  const fetchShowcases = async () => {
    try {
      setShowcasesLoading(true);
      const res = await API.get("/showcases");
      setShowcases(res.data);
    } catch (err) {
      console.error("Failed to load showcases:", err);
    } finally {
      setShowcasesLoading(false);
    }
  };

  const handleDeleteShowcase = async (showcaseId) => {
    if (window.confirm("Are you sure you want to delete this showcase post?")) {
      try {
        await API.delete(`/showcases/${showcaseId}`);
        setShowcases((prev) => prev.filter((s) => s._id !== showcaseId));
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete showcase.");
      }
    }
  };

  const handleShowcaseSubmit = async (e) => {
    e.preventDefault();
    setShowcaseFormError("");
    setShowcaseFormSuccess("");

    const { handle, space, productName, productId, image } = showcaseFormData;
    if (!handle || !space || !productName || !productId || !image) {
      setShowcaseFormError("All fields and image are required.");
      return;
    }

    try {
      const res = await API.post("/showcases", showcaseFormData);
      setShowcases((prev) => [res.data, ...prev]);
      setShowcaseFormSuccess("Showcase post added successfully!");
      setShowcaseFormData({
        handle: "",
        space: "",
        productName: "",
        productId: "",
        image: ""
      });
    } catch (err) {
      setShowcaseFormError(err.response?.data?.message || "Failed to add showcase.");
    }
  };

  const handleShowcaseImageUpload = async (file) => {
    if (!file) return;
    setIsUploadingShowcaseImage(true);
    setShowcaseFormError("");
    const uploadPayload = new FormData();
    uploadPayload.append("image", file);
    try {
      const res = await API.post("/products/upload", uploadPayload, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setShowcaseFormData((prev) => ({ ...prev, image: res.data.url }));
    } catch (err) {
      console.error("Showcase image upload failed:", err);
      setShowcaseFormError(err.response?.data?.message || "Failed to upload showcase image.");
    } finally {
      setIsUploadingShowcaseImage(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login");
      } else if (!user.isAdmin) {
        navigate("/profile");
      } else {
        fetchOrders();
        fetchReviews();
        fetchPromos();
        fetchMessages();
        fetchAnalytics();
        fetchCmsSettings();
        fetchCategories();
        fetchCollections();
        fetchSubcategories();
        fetchShowcases();
      }
    }
  }, [user, loading, navigate]);

  // Handle promo code deletion
  const handleDeletePromo = async (promoId) => {
    if (window.confirm("Are you sure you want to delete this promotion code?")) {
      try {
        await API.delete(`/promos/${promoId}`);
        setPromos((prev) => prev.filter((p) => p._id !== promoId));
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete promo code.");
      }
    }
  };

  // Create promo code
  const handlePromoSubmit = async (e) => {
    e.preventDefault();
    setPromoFormError("");
    setPromoFormSuccess("");

    if (!promoFormData.code || !promoFormData.value || !promoFormData.expiryDate) {
      setPromoFormError("Code, discount value, and expiration date are required.");
      return;
    }

    try {
      const res = await API.post("/promos", {
        code: promoFormData.code.toUpperCase(),
        discountType: promoFormData.discountType,
        value: Number(promoFormData.value),
        minPurchase: promoFormData.minPurchase ? Number(promoFormData.minPurchase) : 0,
        expiryDate: promoFormData.expiryDate
      });

      setPromos((prev) => [res.data, ...prev]);
      setPromoFormSuccess(`Promo code "${res.data.code}" created successfully.`);
      setPromoFormData({
        code: "",
        discountType: "percentage",
        value: "",
        minPurchase: "",
        expiryDate: ""
      });
    } catch (err) {
      setPromoFormError(err.response?.data?.message || "Failed to create promo code.");
    }
  };

  const uploadCatImage = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setCategoryFormError("Only image files are supported.");
      return;
    }
    try {
      setIsUploadingCatImage(true);
      setCategoryFormError("");
      const payload = new FormData();
      payload.append("image", file);
      const res = await API.post("/products/upload", payload, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.data?.url) {
        setCategoryFormData((prev) => ({ ...prev, heroImage: res.data.url }));
        setCategoryFormSuccess("Category image uploaded successfully!");
        setTimeout(() => setCategoryFormSuccess(""), 4000);
      }
    } catch (err) {
      console.error("Category image upload failed:", err);
      setCategoryFormError(err.response?.data?.message || "Failed to upload category image.");
    } finally {
      setIsUploadingCatImage(false);
    }
  };

  const uploadCollImage = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setCollectionFormError("Only image files are supported.");
      return;
    }
    try {
      setIsUploadingCollImage(true);
      setCollectionFormError("");
      const payload = new FormData();
      payload.append("image", file);
      const res = await API.post("/products/upload", payload, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.data?.url) {
        setCollectionFormData((prev) => ({ ...prev, image: res.data.url }));
        setCollectionFormSuccess("Collection image uploaded successfully!");
        setTimeout(() => setCollectionFormSuccess(""), 4000);
      }
    } catch (err) {
      console.error("Collection image upload failed:", err);
      setCollectionFormError(err.response?.data?.message || "Failed to upload collection image.");
    } finally {
      setIsUploadingCollImage(false);
    }
  };

  // --- Category CRUD Handlers ---
  const handleCategoryInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    
    setCategoryFormData((prev) => {
      const updated = { ...prev, [name]: val };
      if (name === "name" && !editingCategorySlug) {
        updated.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-");
      }
      return updated;
    });
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setCategoryFormError("");
    setCategoryFormSuccess("");

    if (!categoryFormData.slug || !categoryFormData.name) {
      setCategoryFormError("Slug and Name are required.");
      return;
    }

    try {
      if (editingCategorySlug) {
        const res = await API.put(`/categories/${editingCategorySlug}`, categoryFormData);
        setCategories((prev) =>
          prev.map((c) => (c.slug === editingCategorySlug ? res.data : c))
        );
        setCategoryFormSuccess(`Category "${res.data.name}" updated successfully.`);
      } else {
        const res = await API.post("/categories", categoryFormData);
        setCategories((prev) => [...prev, res.data]);
        setCategoryFormSuccess(`Category "${res.data.name}" created successfully.`);
      }
      setCategoryFormData({
        slug: "",
        name: "",
        description: "",
        navbarDescription: "",
        heroImage: "",
        order: 0,
        isActive: true,
      });
      setEditingCategorySlug(null);
    } catch (err) {
      setCategoryFormError(err.response?.data?.message || "Failed to save category.");
    }
  };

  const handleEditCategoryClick = (cat) => {
    setCategoryFormError("");
    setCategoryFormSuccess("");
    setCategoryFormData({
      slug: cat.slug,
      name: cat.name,
      description: cat.description || "",
      navbarDescription: cat.navbarDescription || "",
      heroImage: cat.heroImage || "",
      order: cat.order || 0,
      isActive: cat.isActive !== false,
    });
    setEditingCategorySlug(cat.slug);
  };

  const handleDeleteCategory = async (slug) => {
    if (window.confirm(`Are you sure you want to delete the category "${slug}"?`)) {
      try {
        await API.delete(`/categories/${slug}`);
        setCategories((prev) => prev.filter((c) => c.slug !== slug));
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete category.");
      }
    }
  };

  // --- Collection CRUD Handlers ---
  const handleCollectionInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    
    setCollectionFormData((prev) => {
      const updated = { ...prev, [name]: val };
      if (name === "name" && !editingCollectionSlug) {
        updated.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-");
      }
      return updated;
    });
  };

  const handleCollectionSubmit = async (e) => {
    e.preventDefault();
    setCollectionFormError("");
    setCollectionFormSuccess("");

    if (!collectionFormData.slug || !collectionFormData.name) {
      setCollectionFormError("Slug and Name are required.");
      return;
    }

    try {
      if (editingCollectionSlug) {
        const res = await API.put(`/collections/${editingCollectionSlug}`, collectionFormData);
        setCollections((prev) =>
          prev.map((c) => (c.slug === editingCollectionSlug ? res.data : c))
        );
        setCollectionFormSuccess(`Collection "${res.data.name}" updated successfully.`);
      } else {
        const res = await API.post("/collections", collectionFormData);
        setCollections((prev) => [...prev, res.data]);
        setCollectionFormSuccess(`Collection "${res.data.name}" created successfully.`);
      }
      setCollectionFormData({
        slug: "",
        name: "",
        tagline: "",
        navbarDescription: "",
        image: "",
        order: 0,
        isActive: true,
      });
      setEditingCollectionSlug(null);
    } catch (err) {
      setCollectionFormError(err.response?.data?.message || "Failed to save collection.");
    }
  };

  const handleEditCollectionClick = (coll) => {
    setCollectionFormError("");
    setCollectionFormSuccess("");
    setCollectionFormData({
      slug: coll.slug,
      name: coll.name,
      tagline: coll.tagline || "",
      navbarDescription: coll.navbarDescription || "",
      image: coll.image || "",
      order: coll.order || 0,
      isActive: coll.isActive !== false,
    });
    setEditingCollectionSlug(coll.slug);
  };

  const handleDeleteCollection = async (slug) => {
    if (window.confirm(`Are you sure you want to delete the collection "${slug}"?`)) {
      try {
        await API.delete(`/collections/${slug}`);
        setCollections((prev) => prev.filter((c) => c.slug !== slug));
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete collection.");
      }
    }
  };
  const uploadSubImage = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setSubcategoryFormError("Only image files are supported.");
      return;
    }
    try {
      setIsUploadingSubImage(true);
      setSubcategoryFormError("");
      const payload = new FormData();
      payload.append("image", file);
      const res = await API.post("/products/upload", payload, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.data?.url) {
        setSubcategoryFormData((prev) => ({ ...prev, image: res.data.url }));
        setSubcategoryFormSuccess("Atelier Type image uploaded successfully!");
        setTimeout(() => setSubcategoryFormSuccess(""), 4000);
      }
    } catch (err) {
      console.error("Subcategory image upload failed:", err);
      setSubcategoryFormError(err.response?.data?.message || "Failed to upload image.");
    } finally {
      setIsUploadingSubImage(false);
    }
  };

  // --- Subcategory (Atelier Type) CRUD Handlers ---
  const handleSubcategoryInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    
    setSubcategoryFormData((prev) => {
      const updated = { ...prev, [name]: val };
      if (name === "name" && !editingSubcategorySlug) {
        updated.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-");
      }
      return updated;
    });
  };

  const handleSubcategorySubmit = async (e) => {
    e.preventDefault();
    setSubcategoryFormError("");
    setSubcategoryFormSuccess("");

    if (!subcategoryFormData.slug || !subcategoryFormData.name || !subcategoryFormData.category) {
      setSubcategoryFormError("Slug, Name, and Parent Category are required.");
      return;
    }

    try {
      if (editingSubcategorySlug) {
        const res = await API.put(`/subcategories/${editingSubcategorySlug}`, subcategoryFormData);
        setSubcategories((prev) =>
          prev.map((c) => (c.slug === editingSubcategorySlug ? res.data : c))
        );
        setSubcategoryFormSuccess(`Atelier Type "${res.data.name}" updated successfully.`);
      } else {
        const res = await API.post("/subcategories", subcategoryFormData);
        setSubcategories((prev) => [...prev, res.data]);
        setSubcategoryFormSuccess(`Atelier Type "${res.data.name}" created successfully.`);
      }
      setSubcategoryFormData({
        slug: "",
        name: "",
        category: categories[0]?.slug || "",
        image: "",
        order: 0,
        isActive: true,
      });
      setEditingSubcategorySlug(null);
    } catch (err) {
      setSubcategoryFormError(err.response?.data?.message || "Failed to save subcategory.");
    }
  };

  const handleEditSubcategoryClick = (sub) => {
    setSubcategoryFormError("");
    setSubcategoryFormSuccess("");
    setSubcategoryFormData({
      slug: sub.slug,
      name: sub.name,
      category: sub.category,
      image: sub.image || "",
      order: sub.order || 0,
      isActive: sub.isActive !== false,
    });
    setEditingSubcategorySlug(sub.slug);
  };

  const handleDeleteSubcategory = async (slug) => {
    if (window.confirm(`Are you sure you want to delete the Atelier Type "${slug}"?`)) {
      try {
        await API.delete(`/subcategories/${slug}`);
        setSubcategories((prev) => prev.filter((c) => c.slug !== slug));
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete subcategory.");
      }
    }
  };

  // Handle Review approval
  const handleApproveReview = async (reviewId) => {
    try {
      await API.put(`/products/reviews/${reviewId}/approve`);
      setAdminReviews(prev =>
        prev.map(rev => rev._id === reviewId ? { ...rev, isApproved: true } : rev)
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to approve review.");
    }
  };

  // Handle Review deletion/rejection
  const handleRejectReview = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete/reject this review?")) {
      try {
        await API.delete(`/products/reviews/${reviewId}`);
        setAdminReviews(prev => prev.filter(rev => rev._id !== reviewId));
      } catch (err) {
        alert(err.response?.data?.message || "Failed to reject review.");
      }
    }
  };

  // Handle Contact message status updates
  const handleUpdateMessageStatus = async (messageId, newStatus) => {
    try {
      const res = await API.put(`/contact/${messageId}/status`, { status: newStatus });
      setMessages((prev) =>
        prev.map((msg) => (msg._id === messageId ? res.data : msg))
      );
      if (selectedMessage && selectedMessage._id === messageId) {
        setSelectedMessage(res.data);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update message status.");
    }
  };

  // Handle Contact message deletion
  const handleDeleteMessage = async (messageId) => {
    if (window.confirm("Are you sure you want to permanently delete this message?")) {
      try {
        await API.delete(`/contact/${messageId}`);
        setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
        if (selectedMessage && selectedMessage._id === messageId) {
          setSelectedMessage(null);
        }
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete contact message.");
      }
    }
  };

  // Handle order status updates
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update order status.");
    }
  };

  // Handle admin processing refund for cancelled or returned orders
  const handleRefundOrder = async (orderId) => {
    if (window.confirm(`Are you sure you want to issue a refund for order ${orderId}? This will mark the order payment details as Refunded.`)) {
      try {
        const res = await API.put(`/orders/${orderId}/refund`);
        alert(`Refund processed successfully. Transaction reference: ${res.data.paymentDetails?.transactionToken || "Success"}`);
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  paymentDetails: {
                    ...order.paymentDetails,
                    paymentStatus: "Refunded",
                    transactionToken: res.data.paymentDetails?.transactionToken
                  }
                }
              : order
          )
        );
      } catch (err) {
        alert(err.response?.data?.message || "Failed to process order refund.");
      }
    }
  };

  // Open form in edit mode
  const openEditMode = (p) => {
    setEditingProductId(p.id);
    setFormData({
      name: p.name || "",
      category: p.category || "furniture",
      price: p.price || "",
      originalPrice: p.originalPrice || "",
      stock: p.stock !== undefined ? p.stock : 10,
      images: p.images && p.images.length > 0 ? [...p.images] : (p.image ? [p.image] : [""]),
      description: p.description || "",
      dimSpec: p.specifications?.Dimensions || "",
      matSpec: p.specifications?.Material || "",
      careInstructions: p.careInstructions || "",
      spaces: p.spaces || [],
      collections: p.collections || [],
      subcategory: p.subcategory || "",
    });
    setDescTab("write");
    setCareTab("write");
    setFormError("");
    setFormSuccess("");
    setIsFormOpen(true);
  };

  // Open form in create mode
  const openCreateMode = () => {
    setEditingProductId(null);
    setFormData({
      name: "",
      category: "furniture",
      price: "",
      originalPrice: "",
      stock: 10,
      images: [""],
      description: "",
      dimSpec: "",
      matSpec: "",
      careInstructions: "",
      spaces: [],
      collections: [],
      subcategory: "",
    });
    setDescTab("write");
    setCareTab("write");
    setFormError("");
    setFormSuccess("");
    setIsFormOpen(true);
  };

  // Handle product form input updates
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (field, itemValue) => {
    setFormData((prev) => {
      const list = prev[field] || [];
      const updated = list.includes(itemValue)
        ? list.filter((v) => v !== itemValue)
        : [...list, itemValue];
      return { ...prev, [field]: updated };
    });
  };

  // Custom text editor helper functions (inserts HTML markdown)
  const insertHTMLTag = (field, tag) => {
    const textarea = document.getElementById(field);
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);

    let replacement = "";
    if (tag === "b") replacement = `<strong>${selected || "Bold Text"}</strong>`;
    else if (tag === "i") replacement = `<em>${selected || "Italic Text"}</em>`;
    else if (tag === "p") replacement = `<p>${selected || "New Paragraph text..."}</p>`;
    else if (tag === "ul") replacement = `<ul>\n  <li>${selected || "List item"}</li>\n</ul>`;

    const updatedText = text.substring(0, start) + replacement + text.substring(end);
    setFormData((prev) => ({ ...prev, [field]: updatedText }));

    // Refocus textarea
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 50);
  };

  // Image Drag-and-Drop file processing & backend uploads
  const processImageFiles = async (files) => {
    if (!files || files.length === 0) return;
    setIsUploadingImage(true);
    setFormError("");

    const uploadedUrls = [];
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith("image/")) {
          setFormError("Only image files (JPEG, PNG, WEBP) are supported.");
          continue;
        }

        const uploadPayload = new FormData();
        uploadPayload.append("image", file);

        const res = await API.post("/products/upload", uploadPayload, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.data?.url) {
          uploadedUrls.push(res.data.url);
        }
      }

      if (uploadedUrls.length > 0) {
        setFormData((prev) => {
          const baseImages = prev.images.filter(Boolean);
          return { ...prev, images: [...baseImages, ...uploadedUrls] };
        });
        setFormSuccess(`Successfully uploaded and registered ${uploadedUrls.length} file(s)!`);
        setTimeout(() => setFormSuccess(""), 3000);
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      setFormError(err.response?.data?.message || "Failed to upload image file to store directory.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleFileChange = (e) => {
    processImageFiles(e.target.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processImageFiles(e.dataTransfer.files);
  };

  const removeUploadedImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // Submit product creation or update
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setIsSubmitting(true);

    if (!formData.name || !formData.price || !formData.description) {
      setFormError("Product Name, Price, and Description are required fields.");
      setIsSubmitting(false);
      return;
    }

    const imageList = formData.images
      .map((url) => url.trim())
      .filter(Boolean);

    if (imageList.length === 0) {
      imageList.push("https://images.unsplash.com/photo-1592078615290-033ee584e267?w=1000&q=80");
    }

    const specsMap = {};
    if (formData.dimSpec) specsMap["Dimensions"] = formData.dimSpec;
    if (formData.matSpec) specsMap["Material"] = formData.matSpec;

    const payload = {
      name: formData.name,
      category: formData.category,
      subcategory: formData.subcategory,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
      stock: formData.stock !== "" ? Number(formData.stock) : 10,
      images: imageList,
      description: formData.description,
      specifications: specsMap,
      careInstructions: formData.careInstructions,
      spaces: formData.spaces,
      collections: formData.collections,
    };

    try {
      if (editingProductId) {
        await editProduct(editingProductId, payload);
        setFormSuccess("Product catalog entry modified successfully!");
      } else {
        await addProduct(payload);
        setFormSuccess("New product catalog entry published successfully!");
      }

      setTimeout(() => {
        setIsFormOpen(false);
        setFormSuccess("");
        setEditingProductId(null);
      }, 1500);
    } catch (err) {
      setFormError(err.message || "Failed to commit product changes.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProductClick = async (productId) => {
    if (window.confirm("Are you sure you want to permanently delete this product from the inventory?")) {
      try {
        await deleteProduct(productId);
      } catch (err) {
        alert(err.message || "Failed to delete product.");
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-background min-h-screen text-ink flex flex-col items-center justify-center font-body text-xs tracking-[0.2em] uppercase animate-pulse">
        <div className="w-8 h-8 border border-bronze border-t-transparent rounded-full animate-spin mb-4" />
        Authenticating backoffice credentials...
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    return null;
  }

  // Calculate dynamic stats
  const totalSalesVal = orders.reduce((acc, o) => {
    if (o.status === "Cancelled" || o.status === "Returned") return acc;
    const stringVal = String(o.total || "0");
    const numericVal = parseInt(stringVal.replace(/[^0-9]/g, ""), 10) || 0;
    return acc + numericVal;
  }, 0);

  const pendingShipments = orders.filter((o) => o.status === "Processing" || o.status === "Shipped").length;
  const totalOrders = orders.length;
  const catalogCount = products.length;

  return (
    <div className="bg-background text-ink min-h-screen flex font-body">
      
      {/* 1. SIDEBAR CONTROLLER */}
      <aside className="w-64 border-r border-border bg-surface p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          <div className="pb-4 border-b border-border">
            <span className="font-display font-light text-2xl tracking-[0.1em] text-ink uppercase block">
              Novella
            </span>
            <span className="font-body text-[0.55rem] tracking-[0.25em] text-bronze uppercase block mt-1">
              Atelier Backoffice
            </span>
          </div>

          <nav className="flex flex-col gap-1.5">
            <button
              onClick={() => setActivePanel("overview")}
              className={`w-full text-left font-body text-xs tracking-wider uppercase border-0 px-4 py-3 cursor-pointer transition-all duration-200 flex items-center gap-3 ${
                activePanel === "overview"
                  ? "bg-border/60 text-ink font-semibold"
                  : "bg-transparent text-muted hover:text-ink hover:bg-border/30"
              }`}
            >
              <svg className="w-4 h-4 text-bronze" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Overview Dashboard
            </button>

            <button
              onClick={() => setActivePanel("orders")}
              className={`w-full text-left font-body text-xs tracking-wider uppercase border-0 px-4 py-3 cursor-pointer transition-all duration-200 flex items-center gap-3 ${
                activePanel === "orders"
                  ? "bg-border/60 text-ink font-semibold"
                  : "bg-transparent text-muted hover:text-ink hover:bg-border/30"
              }`}
            >
              <svg className="w-4 h-4 text-bronze" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Orders ({orders.length})
            </button>

            <button
              onClick={() => setActivePanel("catalog")}
              className={`w-full text-left font-body text-xs tracking-wider uppercase border-0 px-4 py-3 cursor-pointer transition-all duration-200 flex items-center gap-3 ${
                activePanel === "catalog"
                  ? "bg-border/60 text-ink font-semibold"
                  : "bg-transparent text-muted hover:text-ink hover:bg-border/30"
              }`}
            >
              <svg className="w-4 h-4 text-bronze" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.58 4 8 4s8-1.79 8-4M4 7c0-2.21 3.58-4 8-4s8 1.79 8 4m0 5c0 2.21-3.58 4-8 4s-8-1.79-8-4" />
              </svg>
              Catalog ({products.length})
            </button>

            <button
              onClick={() => setActivePanel("categories_collections")}
              className={`w-full text-left font-body text-xs tracking-wider uppercase border-0 px-4 py-3 cursor-pointer transition-all duration-200 flex items-center gap-3 ${
                activePanel === "categories_collections"
                  ? "bg-border/60 text-ink font-semibold"
                  : "bg-transparent text-muted hover:text-ink hover:bg-border/30"
              }`}
            >
              <svg className="w-4 h-4 text-bronze" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Categories & Collections
            </button>

            <button
              onClick={() => setActivePanel("reviews")}
              className={`w-full text-left font-body text-xs tracking-wider uppercase border-0 px-4 py-3 cursor-pointer transition-all duration-200 flex items-center gap-3 ${
                activePanel === "reviews"
                  ? "bg-border/60 text-ink font-semibold"
                  : "bg-transparent text-muted hover:text-ink hover:bg-border/30"
              }`}
            >
              <svg className="w-4 h-4 text-bronze" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              Reviews ({adminReviews.length})
            </button>

            <button
              onClick={() => setActivePanel("promotions")}
              className={`w-full text-left font-body text-xs tracking-wider uppercase border-0 px-4 py-3 cursor-pointer transition-all duration-200 flex items-center gap-3 ${
                activePanel === "promotions"
                  ? "bg-border/60 text-ink font-semibold"
                  : "bg-transparent text-muted hover:text-ink hover:bg-border/30"
              }`}
            >
              <svg className="w-4 h-4 text-bronze" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 10-2 2h2zm0 8h.01M19 10a2 2 0 11-4 0V8h4v2zM5 10a2 2 0 104 0V8H5v2z" />
              </svg>
              Promotions ({promos.length})
            </button>

            <button
              onClick={() => setActivePanel("messages")}
              className={`w-full text-left font-body text-xs tracking-wider uppercase border-0 px-4 py-3 cursor-pointer transition-all duration-200 flex items-center gap-3 ${
                activePanel === "messages"
                  ? "bg-border/60 text-ink font-semibold"
                  : "bg-transparent text-muted hover:text-ink hover:bg-border/30"
              }`}
            >
              <svg className="w-4 h-4 text-bronze" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Messages ({messages.filter(m => m.status === "New").length > 0 ? `${messages.length} · ${messages.filter(m => m.status === "New").length} new` : messages.length})
            </button>

            <button
              onClick={() => setActivePanel("cms")}
              className={`w-full text-left font-body text-xs tracking-wider uppercase border-0 px-4 py-3 cursor-pointer transition-all duration-200 flex items-center gap-3 ${
                activePanel === "cms"
                  ? "bg-border/60 text-ink font-semibold"
                  : "bg-transparent text-muted hover:text-ink hover:bg-border/30"
              }`}
            >
              <svg className="w-4 h-4 text-bronze" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Atelier CMS Config
            </button>

            <button
              onClick={() => setActivePanel("showcases")}
              className={`w-full text-left font-body text-xs tracking-wider uppercase border-0 px-4 py-3 cursor-pointer transition-all duration-200 flex items-center gap-3 ${
                activePanel === "showcases"
                  ? "bg-border/60 text-ink font-semibold"
                  : "bg-transparent text-muted hover:text-ink hover:bg-border/30"
              }`}
            >
              <svg className="w-4 h-4 text-bronze" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Showcases
            </button>
          </nav>
        </div>

        {/* Footer controls */}
        <div className="space-y-4">
          <div className="h-px bg-border" />
          <Link
            to="/"
            className="w-full text-center block font-body text-[0.62rem] tracking-[0.2em] uppercase text-bronze hover:text-ink no-underline py-2 border border-bronze/40 hover:border-ink transition-colors duration-200"
          >
            Visit Live Storefront
          </Link>
          <button
            type="button"
            onClick={logout}
            className="w-full bg-surface hover:bg-border/40 border border-border text-ink py-2 text-[0.62rem] tracking-[0.2em] uppercase cursor-pointer transition-colors duration-200"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT WRAPPER */}
      <main className="flex-1 overflow-y-auto flex flex-col relative text-ink bg-background">
        <header className="px-8 py-5 border-b border-border bg-white flex justify-between items-center z-10 sticky top-0 shadow-xs">
          <h2 className="font-display font-light text-xl text-ink m-0 uppercase tracking-widest">
            {activePanel === "overview" && "Dashboard Overview"}
            {activePanel === "orders" && "Customer Purchases"}
            {activePanel === "catalog" && "Inventory Catalog"}
            {activePanel === "categories_collections" && "Categories & Collections"}
            {activePanel === "reviews" && "Reviews Moderation"}
            {activePanel === "promotions" && "Promotional Campaigns"}
            {activePanel === "messages" && "Contact Messages"}
            {activePanel === "cms" && "Atelier Content Configurator (CMS)"}
            {activePanel === "showcases" && "Community Showcases"}
          </h2>
          <span className="font-body text-[0.65rem] tracking-wider text-muted uppercase">
            Logged in as Admin
          </span>
        </header>

        <div className="p-8 max-w-6xl w-full mx-auto space-y-8 flex-grow">
          
          {/* STATS OVERVIEW PANEL */}
          {activePanel === "overview" && (
            <div className="space-y-8 animate-fadeIn text-ink">
              {analyticsLoading || !analytics ? (
                <div className="text-center font-body text-xs text-muted py-12 animate-pulse flex flex-col items-center justify-center">
                  <div className="w-6 h-6 border border-bronze border-t-transparent rounded-full animate-spin mb-4" />
                  Drawing analytics dashboards...
                </div>
              ) : (
                <>
                  {/* Stat cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white border border-border p-5 rounded-[4px]">
                      <span className="font-body text-[0.62rem] tracking-wider uppercase text-muted block">Gross Valuation</span>
                      <span className="font-display text-2xl text-ink block mt-1">₹{analytics.summary.totalRevenue.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="bg-white border border-border p-5 rounded-[4px]">
                      <span className="font-body text-[0.62rem] tracking-wider uppercase text-muted block">Transactions Completed</span>
                      <span className="font-display text-2xl text-ink block mt-1">{analytics.summary.totalOrders}</span>
                    </div>
                    <div className="bg-white border border-border p-5 rounded-[4px]">
                      <span className="font-body text-[0.62rem] tracking-wider uppercase text-muted block">Out of Stock Pieces</span>
                      <span className="font-display text-2xl text-ink block mt-1">{analytics.summary.outOfStock}</span>
                    </div>
                    <div className="bg-white border border-border p-5 rounded-[4px]">
                      <span className="font-body text-[0.62rem] tracking-wider uppercase text-muted block">Open Support Tickets</span>
                      <span className="font-display text-2xl text-ink block mt-1">{analytics.summary.openEnquiries}</span>
                    </div>
                  </div>

                  {/* Charts row */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* SVG Area Chart */}
                    <div className="lg:col-span-2 bg-white border border-border p-6 rounded-[4px] space-y-4">
                      <h4 className="font-display font-light text-sm uppercase tracking-wider text-ink m-0">Monthly Revenue Trend</h4>
                      <div className="w-full overflow-hidden">
                        <svg viewBox="0 0 600 240" className="w-full h-auto">
                          {/* Gradients */}
                          <defs>
                            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#d97706" stopOpacity="0.2" />
                              <stop offset="100%" stopColor="#d97706" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>

                          {/* Y-Axis Grid Lines */}
                          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                            const y = 20 + 180 - ratio * 180;
                            const value = Math.round(ratio * Math.max(...analytics.salesTrend.map(d => d.revenue), 1000));
                            return (
                              <g key={index}>
                                <line x1="60" y1={y} x2="570" y2={y} stroke="#ebe5db" strokeDasharray="3,3" />
                                <text x="50" y={y + 4} fill="#9ca3af" fontSize="8" textAnchor="end">₹{value >= 1000 ? (value / 1000) + 'k' : value}</text>
                              </g>
                            );
                          })}

                          {/* Chart Path and Area */}
                          {(() => {
                            const salesData = analytics.salesTrend || [];
                            const maxRev = Math.max(...salesData.map(d => d.revenue), 1000);
                            const w = 600;
                            const h = 240;
                            const pad = { top: 20, right: 30, bottom: 40, left: 60 };
                            const cW = w - pad.left - pad.right;
                            const cH = h - pad.top - pad.bottom;

                            const pts = salesData.map((d, i) => {
                              const x = pad.left + (i / Math.max(salesData.length - 1, 1)) * cW;
                              const y = pad.top + cH - (d.revenue / maxRev) * cH;
                              return { x, y, label: d.month, val: d.revenue };
                            });

                            if (pts.length === 0) return null;

                            const pathString = pts.reduce((acc, p, i) => acc + (i === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`), "");
                            const areaString = `${pathString} L ${pts[pts.length - 1].x} ${pad.top + cH} L ${pts[0].x} ${pad.top + cH} Z`;

                            return (
                              <g>
                                <path d={areaString} fill="url(#areaGradient)" />
                                <path d={pathString} fill="none" stroke="#d97706" strokeWidth="2" />
                                {pts.map((p, i) => (
                                  <g key={i}>
                                    <circle cx={p.x} cy={p.y} r="4" fill="#fbf9f5" stroke="#d97706" strokeWidth="2" className="cursor-pointer hover:r-6" />
                                    <text x={p.x} y={h - 15} fill="#9ca3af" fontSize="8" textAnchor="middle">{p.label}</text>
                                  </g>
                                ))}
                              </g>
                            );
                          })()}
                        </svg>
                      </div>
                    </div>

                    {/* Status Distribution Progress Bars */}
                    <div className="bg-white border border-border p-6 rounded-[4px] space-y-6">
                      <h4 className="font-display font-light text-sm uppercase tracking-wider text-ink m-0">Fulfillment Mix</h4>
                      <div className="space-y-4">
                        {Object.entries(analytics.statusCounts).map(([status, count]) => {
                          const percentage = analytics.summary.totalOrders > 0 ? (count / analytics.summary.totalOrders) * 100 : 0;
                          return (
                            <div key={status} className="space-y-1.5">
                              <div className="flex justify-between text-[0.68rem] text-muted tracking-wider uppercase">
                                <span>{status}</span>
                                <span>{count} ({percentage.toFixed(0)}%)</span>
                              </div>
                              <div className="w-full bg-[#ebe5db] h-1.5 rounded-full overflow-hidden">
                                <div className="bg-bronze h-full transition-all duration-500" style={{ width: `${percentage}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Bottom row: Top Products */}
                  <div className="bg-white border border-border p-6 rounded-[4px] space-y-4">
                    <h4 className="font-display font-light text-sm uppercase tracking-wider text-ink m-0">Top-Selling Pieces</h4>
                    {analytics.bestSellers.length === 0 ? (
                      <div className="text-center py-6 text-xs text-muted">No sales items logged yet.</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse font-body text-xs">
                          <thead>
                            <tr className="border-b border-border text-muted text-[0.62rem] uppercase tracking-wider">
                              <th className="py-3">Piece Name</th>
                              <th className="py-3 text-center">Quantity Sold</th>
                              <th className="py-3 text-right">Gross Income</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border text-ink">
                            {analytics.bestSellers.map((item, index) => (
                              <tr key={index}>
                                <td className="py-3.5 font-medium">{item.name}</td>
                                <td className="py-3.5 text-center font-mono">{item.quantity}</td>
                                <td className="py-3.5 text-right font-mono text-bronze">₹{item.revenue.toLocaleString("en-IN")}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Quick Actions / Activity Info */}
              <div className="bg-white border border-border p-6 rounded-[4px]">
                <h4 className="font-display font-light text-sm uppercase tracking-wider text-ink mb-4 m-0">Quick Operations</h4>
                <div className="flex gap-4">
                  <button
                    onClick={() => { setActivePanel("catalog"); openCreateMode(); }}
                    className="px-5 py-3 bg-ink hover:bg-bronze text-background font-body font-medium text-[0.65rem] tracking-wider uppercase border-0 cursor-pointer transition-colors duration-250 rounded-[2px]"
                  >
                    + Publish New Product
                  </button>
                  <button
                    onClick={() => setActivePanel("orders")}
                    className="px-5 py-3 bg-surface hover:bg-border text-ink font-body font-medium text-[0.65rem] tracking-wider uppercase border border-border/80 cursor-pointer transition-colors duration-250 rounded-[2px]"
                  >
                    Manage Orders Registry
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ORDERS REGISTRY PANEL */}
          {activePanel === "orders" && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Order Specific Statistics Panel */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border border-border p-4 rounded-[2px] shadow-xs">
                  <span className="font-body text-[0.55rem] tracking-wider uppercase text-muted block">Filtered Order Count</span>
                  <span className="font-display text-xl text-ink block mt-0.5 font-medium">
                    {ordersLoading ? "..." : (() => {
                      const filtered = orders.filter((o) => {
                        const matchesStatus = filterStatus === "All" || o.status === filterStatus;
                        const matchesSearch =
                          o.id.toString().toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                          o.customer.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                          o.email.toLowerCase().includes(orderSearchQuery.toLowerCase());
                        return matchesStatus && matchesSearch;
                      });
                      return filtered.length;
                    })()} Orders
                  </span>
                </div>
                <div className="bg-white border border-border p-4 rounded-[2px] shadow-xs">
                  <span className="font-body text-[0.55rem] tracking-wider uppercase text-muted block">Filtered Gross Sales</span>
                  <span className="font-display text-xl text-ink block mt-0.5 font-medium">
                    ₹{ordersLoading ? "..." : (() => {
                      const filtered = orders.filter((o) => {
                        const matchesStatus = filterStatus === "All" || o.status === filterStatus;
                        const matchesSearch =
                          o.id.toString().toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                          o.customer.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                          o.email.toLowerCase().includes(orderSearchQuery.toLowerCase());
                        return matchesStatus && matchesSearch;
                      });
                      const val = filtered.reduce((acc, o) => {
                        if (o.status === "Cancelled" || o.status === "Returned") return acc;
                        const strVal = String(o.total || "0");
                        const numVal = parseInt(strVal.replace(/[^0-9]/g, ""), 10) || 0;
                        return acc + numVal;
                      }, 0);
                      return val.toLocaleString("en-IN");
                    })()}
                  </span>
                </div>
                <div className="bg-white border border-border p-4 rounded-[2px] shadow-xs">
                  <span className="font-body text-[0.55rem] tracking-wider uppercase text-muted block">Awaiting Dispatch</span>
                  <span className="font-display text-xl text-ink block mt-0.5 font-medium">
                    {orders.filter(o => o.status === "Processing" || o.status === "Shipped").length} Pending
                  </span>
                </div>
                <div className="bg-white border border-border p-4 rounded-[2px] shadow-xs">
                  <span className="font-body text-[0.55rem] tracking-wider uppercase text-muted block">Average Order Value</span>
                  <span className="font-display text-xl text-ink block mt-0.5 font-medium font-semibold text-bronze">
                    ₹{ordersLoading ? "..." : (() => {
                      const active = orders.filter(o => o.status !== "Cancelled");
                      if (active.length === 0) return 0;
                      const sum = active.reduce((acc, o) => {
                        const strVal = String(o.total || "0");
                        const numVal = parseInt(strVal.replace(/[^0-9]/g, ""), 10) || 0;
                        return acc + numVal;
                      }, 0);
                      return Math.round(sum / active.length).toLocaleString("en-IN");
                    })()}
                  </span>
                </div>
              </div>

              {/* Main table and filters */}
              <div className="bg-white border border-border p-6 sm:p-8 rounded-[3px] shadow-xs space-y-6">
                
                {/* Search query input and filter controls */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-border/50">
                  <div>
                    <h3 className="font-display font-light text-lg text-ink m-0 font-medium">Purchase Registry</h3>
                    <p className="font-body text-[0.7rem] text-muted m-0">Audit, search, and update customer order fulfillment statuses.</p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <input
                      type="text"
                      placeholder="Search customer, ID, or email..."
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      className="bg-[#FDFBF7] border border-border px-3 py-2 font-body text-xs text-ink outline-none focus:border-bronze rounded-[2px] w-full sm:w-64 placeholder:text-muted/40"
                    />

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-body text-xs text-muted font-light">Status:</span>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-[#FDFBF7] border border-border px-3 py-2 font-body text-xs text-ink outline-none focus:border-bronze rounded-[2px]"
                      >
                        <option value="All">All Statuses</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Return Requested">Return Requested</option>
                        <option value="Returned">Returned</option>
                      </select>
                    </div>
                  </div>
                </div>

                {ordersLoading ? (
                  <div className="text-center py-20">
                    <div className="w-6 h-6 border-2 border-bronze border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="font-body text-xs text-muted tracking-wider uppercase animate-pulse">Fetching orders ledger...</p>
                  </div>
                ) : (() => {
                  const filtered = orders.filter((o) => {
                    const matchesStatus = filterStatus === "All" || o.status === filterStatus;
                    const matchesSearch =
                      o.id.toString().toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                      o.customer.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                      o.email.toLowerCase().includes(orderSearchQuery.toLowerCase());
                    return matchesStatus && matchesSearch;
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="text-center py-16 border border-dashed border-border/60 rounded-[3px] bg-[#FDFBF7]">
                        <svg className="w-8 h-8 text-muted/30 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p className="font-body text-xs text-muted italic">No customer orders matching this search query found.</p>
                      </div>
                    );
                  }

                  return (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-left font-body text-xs text-ink">
                        <thead>
                          <tr className="border-b border-border/80 text-[0.62rem] uppercase tracking-wider text-muted font-light pb-2">
                            <th className="pb-3.5 font-medium">Order ID</th>
                            <th className="pb-3.5 font-medium">Customer Details</th>
                            <th className="pb-3.5 font-medium">Order Date</th>
                            <th className="pb-3.5 font-medium">Grand Total</th>
                            <th className="pb-3.5 font-medium">Fulfillment Status</th>
                            <th className="pb-3.5 font-medium text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                          {filtered.map((order) => {
                            const isTerminal = order.status === "Cancelled" || order.status === "Returned";
                            return (
                              <tr key={order.id} className="hover:bg-[#FDFBF7]/30 transition-colors duration-150">
                                <td className="py-4 font-mono font-bold text-ink">{order.id}</td>
                                <td className="py-4">
                                  <div className="flex flex-col">
                                    <span className="font-medium text-ink">{order.customer}</span>
                                    <span className="text-[0.65rem] text-muted font-light">{order.email}</span>
                                  </div>
                                </td>
                                <td className="py-4 text-muted font-light">
                                  {new Date(order.date).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric"
                                  })}
                                </td>
                                <td className="py-4 font-medium">₹{order.total.toLocaleString("en-IN")}</td>
                                <td className="py-4">
                                  <select
                                    value={order.status}
                                    disabled={isTerminal}
                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                    className={`border bg-[#FDFBF7] px-2.5 py-1.5 font-body text-[0.68rem] tracking-wider uppercase font-semibold rounded-[2px] outline-none cursor-pointer ${
                                      order.status === "Delivered"
                                        ? "text-emerald-800 border-emerald-250 bg-emerald-50/20"
                                        : order.status === "Cancelled"
                                        ? "text-red-800 border-red-150 bg-red-50/20"
                                        : order.status === "Returned"
                                        ? "text-purple-800 border-purple-200 bg-purple-50/10"
                                        : "text-bronze border-bronze/35 hover:border-bronze"
                                    } disabled:opacity-75 disabled:cursor-not-allowed`}
                                  >
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                    <option value="Return Requested">Return Requested</option>
                                    <option value="Returned">Returned</option>
                                  </select>
                                </td>
                                <td className="py-4 text-right space-x-3">
                                  <button
                                    onClick={() => setSelectedOrder(order)}
                                    className="font-body text-[0.62rem] tracking-widest uppercase text-ink hover:text-bronze bg-transparent border-0 cursor-pointer transition-colors duration-250 py-1"
                                  >
                                    Invoice
                                  </button>
                                  {(order.status === "Cancelled" || order.status === "Returned") && (
                                    <>
                                      <span className="text-border/50 text-[10px] select-none">|</span>
                                      {order.paymentDetails?.paymentStatus === "Refunded" ? (
                                        <span className="font-body text-[0.58rem] tracking-wider uppercase text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 border border-emerald-250 rounded-[2px] select-none">
                                          ✓ Refunded
                                        </span>
                                      ) : (
                                        <button
                                          onClick={() => handleRefundOrder(order.id)}
                                          className="font-body text-[0.62rem] tracking-widest uppercase text-red-600 hover:text-red-700 bg-transparent border-0 cursor-pointer transition-colors duration-250 py-1 font-semibold"
                                        >
                                          Refund
                                        </button>
                                      )}
                                    </>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* CATALOG REGISTRY PANEL */}
          {activePanel === "catalog" && (
            <div className="bg-white border border-border p-6 sm:p-8 rounded-[3px] shadow-xs animate-fadeIn space-y-6">
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-border/50">
                <div>
                  <h3 className="font-display font-light text-lg text-ink m-0">Live Inventory Catalog</h3>
                  <p className="font-body text-[0.7rem] text-muted m-0">Manage collections and physical items in stock.</p>
                </div>
                
                <button
                  onClick={openCreateMode}
                  className="bg-ink hover:bg-bronze text-background font-body font-medium text-[0.62rem] tracking-[0.2em] uppercase px-5 py-3 border-0 transition-colors duration-300 cursor-pointer rounded-[2px]"
                >
                  + Add Product
                </button>
              </div>

              {/* ── Catalog Filters Bar ── */}
              <div className="flex flex-wrap items-end gap-3 pt-2 pb-3">
                {/* Search */}
                <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
                  <label className="font-body text-[0.58rem] tracking-[0.18em] uppercase text-muted">Search</label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted/60 text-[0.75rem]">⌕</span>
                    <input
                      type="text"
                      value={catalogSearch}
                      onChange={e => setCatalogSearch(e.target.value)}
                      placeholder="Search by name or ID…"
                      className="w-full pl-7 pr-3 py-2 border border-border rounded-[2px] font-body text-[0.72rem] text-ink bg-white outline-none focus:border-bronze/60 transition-colors placeholder:text-muted/50"
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="flex flex-col gap-1 min-w-[140px]">
                  <label className="font-body text-[0.58rem] tracking-[0.18em] uppercase text-muted">Category</label>
                  <select
                    value={catalogCategory}
                    onChange={e => setCatalogCategory(e.target.value)}
                    className="px-3 py-2 border border-border rounded-[2px] font-body text-[0.72rem] text-ink bg-white outline-none focus:border-bronze/60 transition-colors cursor-pointer appearance-none"
                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23999' stroke-width='1.2'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", paddingRight: "28px" }}
                  >
                    <option value="All">All Categories</option>
                    {categories.length === 0 ? (
                      [...new Set(products.map(p => p.category))].filter(Boolean).sort().map(cat => (
                        <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, " ")}</option>
                      ))
                    ) : (
                      categories.map(cat => (
                        <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                      ))
                    )}
                  </select>
                </div>

                {/* Stock Status */}
                <div className="flex flex-col gap-1 min-w-[130px]">
                  <label className="font-body text-[0.58rem] tracking-[0.18em] uppercase text-muted">Stock Status</label>
                  <select
                    value={catalogStock}
                    onChange={e => setCatalogStock(e.target.value)}
                    className="px-3 py-2 border border-border rounded-[2px] font-body text-[0.72rem] text-ink bg-white outline-none focus:border-bronze/60 transition-colors cursor-pointer appearance-none"
                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23999' stroke-width='1.2'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", paddingRight: "28px" }}
                  >
                    <option value="All">All Stock</option>
                    <option value="in-stock">In Stock (4+)</option>
                    <option value="low-stock">Low Stock (1–3)</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                </div>

                {/* Sort */}
                <div className="flex flex-col gap-1 min-w-[150px]">
                  <label className="font-body text-[0.58rem] tracking-[0.18em] uppercase text-muted">Sort By</label>
                  <select
                    value={catalogSort}
                    onChange={e => setCatalogSort(e.target.value)}
                    className="px-3 py-2 border border-border rounded-[2px] font-body text-[0.72rem] text-ink bg-white outline-none focus:border-bronze/60 transition-colors cursor-pointer appearance-none"
                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23999' stroke-width='1.2'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", paddingRight: "28px" }}
                  >
                    <option value="name-asc">Name A → Z</option>
                    <option value="name-desc">Name Z → A</option>
                    <option value="price-asc">Price: Low → High</option>
                    <option value="price-desc">Price: High → Low</option>
                    <option value="stock-asc">Stock: Low → High</option>
                    <option value="stock-desc">Stock: High → Low</option>
                  </select>
                </div>

                {/* Clear All */}
                {(catalogSearch || catalogCategory !== "All" || catalogStock !== "All" || catalogSort !== "name-asc") && (
                  <button
                    onClick={() => { setCatalogSearch(""); setCatalogCategory("All"); setCatalogStock("All"); setCatalogSort("name-asc"); }}
                    className="bg-transparent border border-border hover:border-red-300 text-muted hover:text-red-600 font-body text-[0.6rem] tracking-[0.15em] uppercase px-3 py-2 cursor-pointer transition-all duration-200 rounded-[2px] self-end"
                  >
                    ✕ Clear Filters
                  </button>
                )}
              </div>

              {/* ── Results count ── */}
              {(() => {
                // Compute filtered products
                let filtered = [...products];

                // 1. Search
                if (catalogSearch.trim()) {
                  const q = catalogSearch.trim().toLowerCase();
                  filtered = filtered.filter(p =>
                    p.name.toLowerCase().includes(q) ||
                    (p.id && p.id.toLowerCase().includes(q))
                  );
                }

                // 2. Category
                if (catalogCategory !== "All") {
                  filtered = filtered.filter(p => p.category === catalogCategory);
                }

                // 3. Stock status
                if (catalogStock === "in-stock") {
                  filtered = filtered.filter(p => (p.stock ?? 10) >= 4);
                } else if (catalogStock === "low-stock") {
                  filtered = filtered.filter(p => { const s = p.stock ?? 10; return s >= 1 && s <= 3; });
                } else if (catalogStock === "out-of-stock") {
                  filtered = filtered.filter(p => p.stock === 0);
                }

                // 4. Sort
                filtered.sort((a, b) => {
                  switch (catalogSort) {
                    case "name-asc": return a.name.localeCompare(b.name);
                    case "name-desc": return b.name.localeCompare(a.name);
                    case "price-asc": return a.price - b.price;
                    case "price-desc": return b.price - a.price;
                    case "stock-asc": return (a.stock ?? 10) - (b.stock ?? 10);
                    case "stock-desc": return (b.stock ?? 10) - (a.stock ?? 10);
                    default: return 0;
                  }
                });

                const hasFilters = catalogSearch || catalogCategory !== "All" || catalogStock !== "All";

                return (
                  <>
                    {hasFilters && (
                      <p className="font-body text-[0.68rem] text-muted m-0 -mt-1 pb-1">
                        Showing <span className="font-medium text-ink">{filtered.length}</span> of {products.length} products
                        {catalogCategory !== "All" && <> in <span className="text-ink font-medium">{catalogCategory.replace(/-/g, " ")}</span></>}
                        {catalogStock !== "All" && <> · <span className="text-ink font-medium">{catalogStock.replace(/-/g, " ")}</span></>}
                        {catalogSearch && <> · matching "<span className="text-ink font-medium">{catalogSearch}</span>"</>}
                      </p>
                    )}

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left font-body text-xs text-ink">
                  <thead>
                    <tr className="border-b border-border text-[0.65rem] tracking-[0.15em] uppercase text-muted font-normal pb-2">
                      <th className="pb-4 font-normal">Product Detail</th>
                      <th className="pb-4 font-normal">Classification</th>
                      <th className="pb-4 font-normal">Price</th>
                      <th className="pb-4 font-normal">Stock</th>
                      <th className="pb-4 font-normal">Curated Collections</th>
                      <th className="pb-4 font-normal text-right">Control Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-12 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <span className="text-3xl opacity-30">🔍</span>
                            <p className="font-body text-[0.75rem] text-muted m-0">No products match your filters</p>
                            <button
                              onClick={() => { setCatalogSearch(""); setCatalogCategory("All"); setCatalogStock("All"); setCatalogSort("name-asc"); }}
                              className="bg-transparent border-0 font-body text-[0.65rem] tracking-wider uppercase text-bronze hover:text-ink cursor-pointer transition-colors"
                            >
                              Reset All Filters
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : filtered.map((p) => (
                      <tr key={p.id} className="hover:bg-[#FDFBF7] transition-colors duration-150">
                        <td className="py-4 flex items-center gap-3.5">
                          <img
                            src={p.images?.[0] || p.image}
                            alt={p.name}
                            className="w-10 h-12 object-cover border border-border/60 bg-surface shrink-0"
                          />
                          <div>
                            <span className="font-medium text-ink block">{p.name}</span>
                            <span className="text-[0.68rem] text-muted block mt-0.5 font-light">ID: {p.id}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="text-[0.68rem] tracking-[0.08em] uppercase text-muted font-light">
                            {p.category}
                          </span>
                        </td>
                        <td className="py-4 font-medium">₹{p.price.toLocaleString("en-IN")}</td>
                        <td className="py-4">
                          <span className={`font-medium ${p.stock === 0 ? "text-red-700 bg-red-50/50 border border-red-200 px-1.5 py-0.5 text-[0.62rem] uppercase tracking-wider rounded-xs" : p.stock <= 3 ? "text-bronze font-semibold" : "text-ink"}`}>
                            {p.stock === 0 ? "Out of Stock" : (p.stock !== undefined ? p.stock : 10)}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                            {p.collections && p.collections.length > 0 ? (
                              p.collections.map((coll) => (
                                <span key={coll} className="bg-ink/5 border border-ink/10 text-ink text-[0.55rem] px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
                                  {coll.replace("-", " ")}
                                </span>
                              ))
                            ) : (
                              <span className="text-muted/65 italic font-light">None</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex justify-end gap-3.5">
                            <button
                              onClick={() => openEditMode(p)}
                              className="bg-transparent border-0 font-body text-[0.62rem] tracking-wider uppercase text-ink hover:text-bronze cursor-pointer transition-colors duration-150"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProductClick(p.id)}
                              className="bg-transparent border-0 font-body text-[0.62rem] tracking-wider uppercase text-red-700 hover:text-red-950 cursor-pointer transition-colors duration-150"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
                  </>
                );
              })()}
            </div>
          )}

          {/* CATEGORIES & COLLECTIONS TAXONOMY PANEL */}
          {activePanel === "categories_collections" && (
            <div className="bg-white border border-border p-6 sm:p-8 rounded-[3px] shadow-xs animate-fadeIn space-y-8">
              {/* Tab Selector */}
              <div className="flex items-center gap-6 border-b border-border/50 pb-3">
                <button
                  onClick={() => setTaxSubTab("categories")}
                  className={`font-display text-sm tracking-wider uppercase border-0 bg-transparent pb-2 cursor-pointer transition-all ${
                    taxSubTab === "categories"
                      ? "border-b-2 border-bronze text-ink font-medium"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  Categories ({categories.length})
                </button>
                <button
                  onClick={() => setTaxSubTab("subcategories")}
                  className={`font-display text-sm tracking-wider uppercase border-0 bg-transparent pb-2 cursor-pointer transition-all ${
                    taxSubTab === "subcategories"
                      ? "border-b-2 border-bronze text-ink font-medium"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  Atelier Types ({subcategories.length})
                </button>
                <button
                  onClick={() => setTaxSubTab("collections")}
                  className={`font-display text-sm tracking-wider uppercase border-0 bg-transparent pb-2 cursor-pointer transition-all ${
                    taxSubTab === "collections"
                      ? "border-b-2 border-bronze text-ink font-medium"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  Collections ({collections.length})
                </button>
              </div>

              {/* 1. CATEGORIES SUBTAB */}
              {taxSubTab === "categories" && (
                <div className="space-y-8">
                  {/* Category editor form */}
                  <div className="bg-surface p-5 sm:p-6 border border-border/60 rounded-[2px]">
                    <h4 className="font-display font-light text-sm text-ink uppercase tracking-wider mb-4">
                      {editingCategorySlug ? `Edit Category: ${editingCategorySlug}` : "Add New Category"}
                    </h4>
                    <form onSubmit={handleCategorySubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block mb-1 font-medium">Category Name</label>
                          <input
                            type="text"
                            name="name"
                            value={categoryFormData.name}
                            onChange={handleCategoryInputChange}
                            placeholder="e.g., Lighting"
                            required
                            className="w-full bg-white border border-border px-3 py-2.5 font-body text-xs text-ink outline-none focus:border-bronze rounded-[2px]"
                          />
                        </div>
                        <div>
                          <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block mb-1 font-medium">
                            Category Slug {editingCategorySlug && <span className="text-red-600">(readonly)</span>}
                          </label>
                          <input
                            type="text"
                            name="slug"
                            value={categoryFormData.slug}
                            onChange={handleCategoryInputChange}
                            placeholder="e.g., lighting"
                            required
                            disabled={!!editingCategorySlug}
                            className="w-full bg-white disabled:bg-border/20 border border-border px-3 py-2.5 font-body text-xs text-ink outline-none focus:border-bronze rounded-[2px]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block mb-1 font-medium">Description</label>
                          <textarea
                            name="description"
                            value={categoryFormData.description}
                            onChange={handleCategoryInputChange}
                            placeholder="Briefly describe what pieces are in this category..."
                            rows="2"
                            className="w-full bg-white border border-border px-3 py-2.5 font-body text-xs text-ink outline-none focus:border-bronze rounded-[2px]"
                          />
                        </div>
                        <div>
                          <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block mb-1 font-medium">Navbar Short Description</label>
                          <textarea
                            name="navbarDescription"
                            value={categoryFormData.navbarDescription}
                            onChange={handleCategoryInputChange}
                            placeholder="Clean short tagline shown in main header dropdown..."
                            rows="2"
                            className="w-full bg-white border border-border px-3 py-2.5 font-body text-xs text-ink outline-none focus:border-bronze rounded-[2px]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                        <div className="sm:col-span-2">
                          <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block mb-1 font-medium">Hero Backdrop Image</label>
                          <div
                            onDragOver={(e) => { e.preventDefault(); setIsDraggingCat(true); }}
                            onDragLeave={() => setIsDraggingCat(false)}
                            onDrop={(e) => { e.preventDefault(); setIsDraggingCat(false); if (e.dataTransfer.files?.[0]) uploadCatImage(e.dataTransfer.files[0]); }}
                            className={`border border-dashed p-4 text-center rounded-[2px] transition-all flex flex-col items-center justify-center min-h-[90px] cursor-pointer ${
                              isDraggingCat ? "border-bronze bg-bronze/5" : "border-border hover:border-bronze/60 bg-white"
                            }`}
                            onClick={() => document.getElementById("cat-file-input").click()}
                          >
                            <input
                              type="file"
                              id="cat-file-input"
                              accept="image/*"
                              onChange={(e) => { if (e.target.files?.[0]) uploadCatImage(e.target.files[0]); }}
                              className="hidden"
                            />
                            {isUploadingCatImage ? (
                              <div className="flex flex-col items-center gap-1.5">
                                <div className="w-4 h-4 border border-bronze border-t-transparent rounded-full animate-spin" />
                                <span className="font-body text-[0.65rem] text-muted uppercase">Uploading image...</span>
                              </div>
                            ) : categoryFormData.heroImage ? (
                              <div className="flex items-center gap-3 w-full text-left">
                                <img
                                  src={categoryFormData.heroImage}
                                  alt="Preview"
                                  className="w-14 h-10 object-cover border border-border bg-surface shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                  <span className="font-body text-[0.68rem] text-ink font-medium block truncate">File Uploaded</span>
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setCategoryFormData(prev => ({ ...prev, heroImage: "" })); }}
                                    className="bg-transparent border-0 font-body text-[0.55rem] tracking-wider uppercase text-red-650 hover:text-red-800 cursor-pointer p-0 mt-0.5"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-1">
                                <span className="font-body text-[0.7rem] text-ink font-medium">Drag & Drop or Click to Upload</span>
                                <span className="font-body text-[0.55rem] text-muted uppercase">JPG, PNG, WEBP files</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block mb-1 font-medium">Order Rank</label>
                          <input
                            type="number"
                            name="order"
                            value={categoryFormData.order}
                            onChange={handleCategoryInputChange}
                            placeholder="0"
                            className="w-full bg-white border border-border px-3 py-2.5 font-body text-xs text-ink outline-none focus:border-bronze rounded-[2px]"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="checkbox"
                          id="category-active"
                          name="isActive"
                          checked={categoryFormData.isActive}
                          onChange={handleCategoryInputChange}
                          className="accent-bronze cursor-pointer"
                        />
                        <label htmlFor="category-active" className="font-body text-xs text-ink select-none cursor-pointer">
                          Active & Visible on Storefront
                        </label>
                      </div>

                      {categoryFormError && (
                        <div className="text-red-700 text-xs font-body pt-1">{categoryFormError}</div>
                      )}
                      {categoryFormSuccess && (
                        <div className="text-emerald-800 text-xs font-medium font-body pt-1">{categoryFormSuccess}</div>
                      )}

                      <div className="flex justify-end gap-3 pt-2">
                        {editingCategorySlug && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCategorySlug(null);
                              setCategoryFormData({
                                slug: "",
                                name: "",
                                description: "",
                                heroImage: "",
                                order: 0,
                                isActive: true,
                              });
                              setCategoryFormError("");
                              setCategoryFormSuccess("");
                            }}
                            className="bg-transparent border border-border hover:border-ink text-ink font-body text-[0.62rem] tracking-wider uppercase px-4 py-2 cursor-pointer transition-colors duration-200"
                          >
                            Cancel Edit
                          </button>
                        )}
                        <button
                          type="submit"
                          className="bg-ink hover:bg-bronze text-background border-0 font-body text-[0.62rem] tracking-wider uppercase px-5 py-2 cursor-pointer transition-colors duration-200"
                        >
                          {editingCategorySlug ? "Save Changes" : "Create Category"}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Categories List */}
                  {categoriesLoading ? (
                    <div className="text-center text-muted font-body text-xs py-8 animate-pulse">Loading categories...</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-left font-body text-xs text-ink">
                        <thead>
                          <tr className="border-b border-border text-[0.65rem] tracking-[0.15em] uppercase text-muted font-normal pb-2">
                            <th className="pb-3 font-normal">Backdrop</th>
                            <th className="pb-3 font-normal">Name</th>
                            <th className="pb-3 font-normal">Slug</th>
                            <th className="pb-3 font-normal">Description</th>
                            <th className="pb-3 font-normal text-center">Rank</th>
                            <th className="pb-3 font-normal text-center">Status</th>
                            <th className="pb-3 font-normal text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                          {categories.map((cat) => (
                            <tr key={cat.slug} className="hover:bg-surface/50 transition-colors">
                              <td className="py-3">
                                {cat.heroImage ? (
                                  <img
                                    src={cat.heroImage}
                                    alt={cat.name}
                                    className="w-10 h-8 object-cover border border-border/50"
                                  />
                                ) : (
                                  <div className="w-10 h-8 bg-border/20 border border-dashed border-border flex items-center justify-center text-[0.55rem] text-muted italic">
                                    No Image
                                  </div>
                                )}
                              </td>
                              <td className="py-3 font-medium">{cat.name}</td>
                              <td className="py-3 text-[0.7rem] font-mono text-muted">{cat.slug}</td>
                              <td className="py-3 max-w-xs truncate text-[0.7rem] text-muted">{cat.description || <span className="italic text-muted/50">No description</span>}</td>
                              <td className="py-3 text-center">{cat.order || 0}</td>
                              <td className="py-3 text-center">
                                <span className={`inline-block px-1.5 py-0.5 text-[0.58rem] uppercase tracking-wider rounded-xs font-medium ${
                                  cat.isActive !== false ? "text-emerald-800 bg-emerald-50 border border-emerald-200" : "text-muted bg-border/20 border border-border"
                                }`}>
                                  {cat.isActive !== false ? "Active" : "Hidden"}
                                </span>
                              </td>
                              <td className="py-3 text-right">
                                <div className="flex justify-end gap-3.5">
                                  <button
                                    onClick={() => handleEditCategoryClick(cat)}
                                    className="bg-transparent border-0 font-body text-[0.62rem] tracking-wider uppercase text-ink hover:text-bronze cursor-pointer transition-colors duration-150"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCategory(cat.slug)}
                                    className="bg-transparent border-0 font-body text-[0.62rem] tracking-wider uppercase text-red-700 hover:text-red-950 cursor-pointer transition-colors duration-150"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* 2. COLLECTIONS SUBTAB */}
              {taxSubTab === "collections" && (
                <div className="space-y-8">
                  {/* Collection editor form */}
                  <div className="bg-surface p-5 sm:p-6 border border-border/60 rounded-[2px]">
                    <h4 className="font-display font-light text-sm text-ink uppercase tracking-wider mb-4">
                      {editingCollectionSlug ? `Edit Collection: ${editingCollectionSlug}` : "Add New Collection"}
                    </h4>
                    <form onSubmit={handleCollectionSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block mb-1 font-medium">Collection Name</label>
                          <input
                            type="text"
                            name="name"
                            value={collectionFormData.name}
                            onChange={handleCollectionInputChange}
                            placeholder="e.g., Scandinavian Hearth"
                            required
                            className="w-full bg-white border border-border px-3 py-2.5 font-body text-xs text-ink outline-none focus:border-bronze rounded-[2px]"
                          />
                        </div>
                        <div>
                          <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block mb-1 font-medium">
                            Collection Slug {editingCollectionSlug && <span className="text-red-600">(readonly)</span>}
                          </label>
                          <input
                            type="text"
                            name="slug"
                            value={collectionFormData.slug}
                            onChange={handleCollectionInputChange}
                            placeholder="e.g., scandinavian-hearth"
                            required
                            disabled={!!editingCollectionSlug}
                            className="w-full bg-white disabled:bg-border/20 border border-border px-3 py-2.5 font-body text-xs text-ink outline-none focus:border-bronze rounded-[2px]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block mb-1 font-medium">Tagline / Subtext</label>
                          <input
                            type="text"
                            name="tagline"
                            value={collectionFormData.tagline}
                            onChange={handleCollectionInputChange}
                            placeholder="e.g., Nordic simplicity meets raw functional textures..."
                            className="w-full bg-white border border-border px-3 py-2.5 font-body text-xs text-ink outline-none focus:border-bronze rounded-[2px]"
                          />
                        </div>
                        <div>
                          <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block mb-1 font-medium">Navbar Short Description</label>
                          <input
                            type="text"
                            name="navbarDescription"
                            value={collectionFormData.navbarDescription}
                            onChange={handleCollectionInputChange}
                            placeholder="Clean short tagline shown in main header dropdown..."
                            className="w-full bg-white border border-border px-3 py-2.5 font-body text-xs text-ink outline-none focus:border-bronze rounded-[2px]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                        <div className="sm:col-span-2">
                          <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block mb-1 font-medium">Image Backdrop</label>
                          <div
                            onDragOver={(e) => { e.preventDefault(); setIsDraggingColl(true); }}
                            onDragLeave={() => setIsDraggingColl(false)}
                            onDrop={(e) => { e.preventDefault(); setIsDraggingColl(false); if (e.dataTransfer.files?.[0]) uploadCollImage(e.dataTransfer.files[0]); }}
                            className={`border border-dashed p-4 text-center rounded-[2px] transition-all flex flex-col items-center justify-center min-h-[90px] cursor-pointer ${
                              isDraggingColl ? "border-bronze bg-bronze/5" : "border-border hover:border-bronze/60 bg-white"
                            }`}
                            onClick={() => document.getElementById("coll-file-input").click()}
                          >
                            <input
                              type="file"
                              id="coll-file-input"
                              accept="image/*"
                              onChange={(e) => { if (e.target.files?.[0]) uploadCollImage(e.target.files[0]); }}
                              className="hidden"
                            />
                            {isUploadingCollImage ? (
                              <div className="flex flex-col items-center gap-1.5">
                                <div className="w-4 h-4 border border-bronze border-t-transparent rounded-full animate-spin" />
                                <span className="font-body text-[0.65rem] text-muted uppercase">Uploading image...</span>
                              </div>
                            ) : collectionFormData.image ? (
                              <div className="flex items-center gap-3 w-full text-left">
                                <img
                                  src={collectionFormData.image}
                                  alt="Preview"
                                  className="w-14 h-10 object-cover border border-border bg-surface shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                  <span className="font-body text-[0.68rem] text-ink font-medium block truncate">File Uploaded</span>
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setCollectionFormData(prev => ({ ...prev, image: "" })); }}
                                    className="bg-transparent border-0 font-body text-[0.55rem] tracking-wider uppercase text-red-650 hover:text-red-800 cursor-pointer p-0 mt-0.5"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-1">
                                <span className="font-body text-[0.7rem] text-ink font-medium">Drag & Drop or Click to Upload</span>
                                <span className="font-body text-[0.55rem] text-muted uppercase">JPG, PNG, WEBP files</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block mb-1 font-medium">Order Rank</label>
                          <input
                            type="number"
                            name="order"
                            value={collectionFormData.order}
                            onChange={handleCollectionInputChange}
                            placeholder="0"
                            className="w-full bg-white border border-border px-3 py-2.5 font-body text-xs text-ink outline-none focus:border-bronze rounded-[2px]"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="checkbox"
                          id="collection-active"
                          name="isActive"
                          checked={collectionFormData.isActive}
                          onChange={handleCollectionInputChange}
                          className="accent-bronze cursor-pointer"
                        />
                        <label htmlFor="collection-active" className="font-body text-xs text-ink select-none cursor-pointer">
                          Active & Visible on Storefront
                        </label>
                      </div>

                      {collectionFormError && (
                        <div className="text-red-700 text-xs font-body pt-1">{collectionFormError}</div>
                      )}
                      {collectionFormSuccess && (
                        <div className="text-emerald-800 text-xs font-medium font-body pt-1">{collectionFormSuccess}</div>
                      )}

                      <div className="flex justify-end gap-3 pt-2">
                        {editingCollectionSlug && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCollectionSlug(null);
                              setCollectionFormData({
                                slug: "",
                                name: "",
                                tagline: "",
                                image: "",
                                order: 0,
                                isActive: true,
                              });
                              setCollectionFormError("");
                              setCollectionFormSuccess("");
                            }}
                            className="bg-transparent border border-border hover:border-ink text-ink font-body text-[0.62rem] tracking-wider uppercase px-4 py-2 cursor-pointer transition-colors duration-200"
                          >
                            Cancel Edit
                          </button>
                        )}
                        <button
                          type="submit"
                          className="bg-ink hover:bg-bronze text-background border-0 font-body text-[0.62rem] tracking-wider uppercase px-5 py-2 cursor-pointer transition-colors duration-200"
                        >
                          {editingCollectionSlug ? "Save Changes" : "Create Collection"}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Collections List */}
                  {collectionsLoading ? (
                    <div className="text-center text-muted font-body text-xs py-8 animate-pulse">Loading collections...</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-left font-body text-xs text-ink">
                        <thead>
                          <tr className="border-b border-border text-[0.65rem] tracking-[0.15em] uppercase text-muted font-normal pb-2">
                            <th className="pb-3 font-normal">Backdrop</th>
                            <th className="pb-3 font-normal">Name</th>
                            <th className="pb-3 font-normal">Slug</th>
                            <th className="pb-3 font-normal">Tagline</th>
                            <th className="pb-3 font-normal text-center">Rank</th>
                            <th className="pb-3 font-normal text-center">Status</th>
                            <th className="pb-3 font-normal text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                          {collections.map((coll) => (
                            <tr key={coll.slug} className="hover:bg-surface/50 transition-colors">
                              <td className="py-3">
                                {coll.image ? (
                                  <img
                                    src={coll.image}
                                    alt={coll.name}
                                    className="w-10 h-8 object-cover border border-border/50"
                                  />
                                ) : (
                                  <div className="w-10 h-8 bg-border/20 border border-dashed border-border flex items-center justify-center text-[0.55rem] text-muted italic">
                                    No Image
                                  </div>
                                )}
                              </td>
                              <td className="py-3 font-medium">{coll.name}</td>
                              <td className="py-3 text-[0.7rem] font-mono text-muted">{coll.slug}</td>
                              <td className="py-3 max-w-xs truncate text-[0.7rem] text-muted">{coll.tagline || <span className="italic text-muted/50">No tagline</span>}</td>
                              <td className="py-3 text-center">{coll.order || 0}</td>
                              <td className="py-3 text-center">
                                <span className={`inline-block px-1.5 py-0.5 text-[0.58rem] uppercase tracking-wider rounded-xs font-medium ${
                                  coll.isActive !== false ? "text-emerald-800 bg-emerald-50 border border-emerald-200" : "text-muted bg-border/20 border border-border"
                                }`}>
                                  {coll.isActive !== false ? "Active" : "Hidden"}
                                </span>
                              </td>
                              <td className="py-3 text-right">
                                <div className="flex justify-end gap-3.5">
                                  <button
                                    onClick={() => handleEditCollectionClick(coll)}
                                    className="bg-transparent border-0 font-body text-[0.62rem] tracking-wider uppercase text-ink hover:text-bronze cursor-pointer transition-colors duration-150"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCollection(coll.slug)}
                                    className="bg-transparent border-0 font-body text-[0.62rem] tracking-wider uppercase text-red-700 hover:text-red-950 cursor-pointer transition-colors duration-150"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* 3. SUBCATEGORIES (ATELIER TYPES) SUBTAB */}
              {taxSubTab === "subcategories" && (
                <div className="space-y-8">
                  {/* Subcategory editor form */}
                  <div className="bg-surface p-5 sm:p-6 border border-border/60 rounded-[2px]">
                    <h4 className="font-display font-light text-sm text-ink uppercase tracking-wider mb-4">
                      {editingSubcategorySlug ? `Edit Atelier Type: ${editingSubcategorySlug}` : "Add New Atelier Type"}
                    </h4>
                    <form onSubmit={handleSubcategorySubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block mb-1 font-medium">Type Name</label>
                          <input
                            type="text"
                            name="name"
                            value={subcategoryFormData.name}
                            onChange={handleSubcategoryInputChange}
                            placeholder="e.g., Table Lamp"
                            required
                            className="w-full bg-white border border-border px-3 py-2.5 font-body text-xs text-ink outline-none focus:border-bronze rounded-[2px]"
                          />
                        </div>
                        <div>
                          <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block mb-1 font-medium">Slug ID</label>
                          <input
                            type="text"
                            name="slug"
                            value={subcategoryFormData.slug}
                            onChange={handleSubcategoryInputChange}
                            placeholder="e.g., table-lamp"
                            required
                            disabled={!!editingSubcategorySlug}
                            className="w-full bg-white border border-border px-3 py-2.5 font-body text-xs text-ink outline-none focus:border-bronze rounded-[2px] disabled:bg-border/20 disabled:text-muted"
                          />
                        </div>
                        <div>
                          <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block mb-1 font-medium">Parent Category</label>
                          <select
                            name="category"
                            value={subcategoryFormData.category}
                            onChange={handleSubcategoryInputChange}
                            required
                            className="w-full bg-white border border-border px-3 py-2.5 font-body text-xs text-ink outline-none focus:border-bronze rounded-[2px]"
                          >
                            <option value="">-- Select Category --</option>
                            {categories.map((cat) => (
                              <option key={cat.slug} value={cat.slug}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                        <div className="sm:col-span-2">
                          <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block mb-1 font-medium">Icon / Backdrop Image</label>
                          <div
                            onDragOver={(e) => { e.preventDefault(); setIsDraggingSub(true); }}
                            onDragLeave={() => setIsDraggingSub(false)}
                            onDrop={(e) => { e.preventDefault(); setIsDraggingSub(false); if (e.dataTransfer.files?.[0]) uploadSubImage(e.dataTransfer.files[0]); }}
                            className={`border border-dashed p-4 text-center rounded-[2px] transition-all flex flex-col items-center justify-center min-h-[90px] cursor-pointer ${
                              isDraggingSub ? "border-bronze bg-bronze/5" : "border-border hover:border-bronze/60 bg-white"
                            }`}
                            onClick={() => document.getElementById("sub-file-input").click()}
                          >
                            <input
                              type="file"
                              id="sub-file-input"
                              accept="image/*"
                              onChange={(e) => { if (e.target.files?.[0]) uploadSubImage(e.target.files[0]); }}
                              className="hidden"
                            />
                            {isUploadingSubImage ? (
                              <div className="flex flex-col items-center gap-1.5">
                                <div className="w-4 h-4 border border-bronze border-t-transparent rounded-full animate-spin" />
                                <span className="font-body text-[0.65rem] text-muted uppercase">Uploading image...</span>
                              </div>
                            ) : subcategoryFormData.image ? (
                              <div className="flex items-center gap-3 w-full text-left">
                                <img
                                  src={subcategoryFormData.image}
                                  alt="Preview"
                                  className="w-14 h-10 object-cover border border-border bg-surface shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                  <span className="font-body text-[0.68rem] text-ink font-medium block truncate">File Uploaded</span>
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setSubcategoryFormData(prev => ({ ...prev, image: "" })); }}
                                    className="bg-transparent border-0 font-body text-[0.55rem] tracking-wider uppercase text-red-650 hover:text-red-800 cursor-pointer p-0 mt-0.5"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-1">
                                <span className="font-body text-[0.7rem] text-ink font-medium">Drag & Drop or Click to Upload</span>
                                <span className="font-body text-[0.55rem] text-muted uppercase">JPG, PNG, WEBP files</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block mb-1 font-medium">Order Rank</label>
                          <input
                            type="number"
                            name="order"
                            value={subcategoryFormData.order}
                            onChange={handleSubcategoryInputChange}
                            placeholder="0"
                            className="w-full bg-white border border-border px-3 py-2.5 font-body text-xs text-ink outline-none focus:border-bronze rounded-[2px]"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="checkbox"
                          name="isActive"
                          id="subIsActive"
                          checked={subcategoryFormData.isActive}
                          onChange={handleSubcategoryInputChange}
                          className="accent-bronze"
                        />
                        <label htmlFor="subIsActive" className="font-body text-xs text-ink select-none cursor-pointer">Visible on Storefront</label>
                      </div>

                      {subcategoryFormError && (
                        <div className="text-red-650 font-body text-xs font-medium bg-red-50 border border-red-200 px-3 py-2.5 rounded-sm">
                          {subcategoryFormError}
                        </div>
                      )}

                      {subcategoryFormSuccess && (
                        <div className="text-emerald-800 font-body text-xs font-medium bg-emerald-50 border border-emerald-250/20 px-3 py-2.5 rounded-sm">
                          {subcategoryFormSuccess}
                        </div>
                      )}

                      <div className="flex items-center justify-end gap-3 pt-2">
                        {editingSubcategorySlug && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingSubcategorySlug(null);
                              setSubcategoryFormData({
                                slug: "",
                                name: "",
                                category: categories[0]?.slug || "",
                                image: "",
                                order: 0,
                                isActive: true,
                              });
                            }}
                            className="bg-transparent hover:bg-border/30 text-muted border border-border/80 font-body text-[0.62rem] tracking-wider uppercase px-5 py-2 cursor-pointer transition-colors duration-200"
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          type="submit"
                          className="bg-ink hover:bg-bronze text-background border-0 font-body text-[0.62rem] tracking-wider uppercase px-5 py-2 cursor-pointer transition-colors duration-200"
                        >
                          {editingSubcategorySlug ? "Save Changes" : "Create Atelier Type"}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Subcategories List */}
                  {subcategoriesLoading ? (
                    <div className="text-center text-muted font-body text-xs py-8 animate-pulse">Loading Atelier Types...</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-left font-body text-xs text-ink">
                        <thead>
                          <tr className="border-b border-border text-[0.65rem] tracking-[0.15em] uppercase text-muted font-normal pb-2">
                            <th className="pb-3 font-normal">Backdrop</th>
                            <th className="pb-3 font-normal">Name</th>
                            <th className="pb-3 font-normal">Slug</th>
                            <th className="pb-3 font-normal">Parent Category</th>
                            <th className="pb-3 font-normal text-center">Rank</th>
                            <th className="pb-3 font-normal text-center">Status</th>
                            <th className="pb-3 font-normal text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                          {subcategories.map((sub) => (
                            <tr key={sub.slug} className="hover:bg-surface/50 transition-colors">
                              <td className="py-3">
                                {sub.image ? (
                                  <img
                                    src={sub.image}
                                    alt={sub.name}
                                    className="w-10 h-8 object-cover border border-border/50"
                                  />
                                ) : (
                                  <div className="w-10 h-8 bg-border/20 border border-dashed border-border flex items-center justify-center text-[0.55rem] text-muted italic">
                                    No Image
                                  </div>
                                )}
                              </td>
                              <td className="py-3 font-medium">{sub.name}</td>
                              <td className="py-3 text-[0.7rem] font-mono text-muted">{sub.slug}</td>
                              <td className="py-3 text-[0.7rem] text-muted">{sub.category}</td>
                              <td className="py-3 text-center">{sub.order || 0}</td>
                              <td className="py-3 text-center">
                                <span className={`inline-block px-1.5 py-0.5 text-[0.58rem] uppercase tracking-wider rounded-xs font-medium ${
                                  sub.isActive !== false ? "text-emerald-800 bg-emerald-50 border border-emerald-200" : "text-muted bg-border/20 border border-border"
                                }`}>
                                  {sub.isActive !== false ? "Active" : "Hidden"}
                                </span>
                              </td>
                              <td className="py-3 text-right">
                                <div className="flex justify-end gap-3.5">
                                  <button
                                    onClick={() => handleEditSubcategoryClick(sub)}
                                    className="bg-transparent border-0 font-body text-[0.62rem] tracking-wider uppercase text-ink hover:text-bronze cursor-pointer transition-colors duration-150"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteSubcategory(sub.slug)}
                                    className="bg-transparent border-0 font-body text-[0.62rem] tracking-wider uppercase text-red-700 hover:text-red-950 cursor-pointer transition-colors duration-150"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* REVIEWS MODERATION PANEL */}
          {activePanel === "reviews" && (
            <div className="bg-white border border-border p-6 sm:p-8 rounded-[3px] shadow-xs animate-fadeIn space-y-6">
              
              {/* Header and Filter */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
                <div>
                  <h3 className="font-display font-light text-lg text-ink m-0 font-medium">Review Moderation Board</h3>
                  <p className="font-body text-[0.7rem] text-muted m-0">Approve or remove customer experiences from the catalog.</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-body text-xs text-muted font-light">Status:</span>
                  <select
                    value={reviewFilterStatus}
                    onChange={(e) => setReviewFilterStatus(e.target.value)}
                    className="bg-[#FDFBF7] border border-border px-3 py-1.5 font-body text-xs text-ink outline-none focus:border-bronze rounded-[2px]"
                  >
                    <option value="All">All Reviews</option>
                    <option value="Pending">Pending Moderation</option>
                    <option value="Approved">Approved Live</option>
                  </select>
                </div>
              </div>

              {reviewsLoading ? (
                <div className="text-center py-20">
                  <div className="w-6 h-6 border-2 border-bronze border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="font-body text-xs text-muted tracking-wider uppercase">Loading review directory...</p>
                </div>
              ) : (() => {
                const filtered = adminReviews.filter((rev) => {
                  if (reviewFilterStatus === "Pending") return !rev.isApproved;
                  if (reviewFilterStatus === "Approved") return rev.isApproved;
                  return true;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="text-center py-16 border border-dashed border-border/60 rounded-[3px] bg-[#FDFBF7]">
                      <svg className="w-8 h-8 text-muted/40 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                      <p className="font-body text-xs text-muted italic">No customer reviews match this filter criteria.</p>
                    </div>
                  );
                }

                return (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left font-body text-xs text-ink">
                      <thead>
                        <tr className="border-b border-border/80 text-[0.62rem] uppercase tracking-wider text-muted font-light">
                          <th className="pb-3.5 font-medium">Piece Details</th>
                          <th className="pb-3.5 font-medium">Customer Details</th>
                          <th className="pb-3.5 font-medium">Rating</th>
                          <th className="pb-3.5 font-medium">Experience Comments</th>
                          <th className="pb-3.5 font-medium">Date</th>
                          <th className="pb-3.5 font-medium text-right">Moderation Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {filtered.map((rev) => (
                          <tr key={rev._id} className="hover:bg-[#FDFBF7]/30 transition-colors duration-150">
                            <td className="py-4 font-medium text-ink max-w-[150px] truncate">
                              {rev.product?.name || `Product ID: ${rev.product}`}
                            </td>
                            <td className="py-4">
                              <div className="flex flex-col">
                                <span className="font-medium text-ink">{rev.name}</span>
                                {rev.isVerifiedBuyer && (
                                  <span className="inline-flex items-center text-[0.55rem] font-bold text-emerald-800 uppercase tracking-widest mt-0.5">
                                    ✓ Verified Buyer
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-4 text-gold">
                              <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, idx) => (
                                  <svg
                                    key={idx}
                                    width="11"
                                    height="11"
                                    viewBox="0 0 24 24"
                                    fill={idx < rev.rating ? "currentColor" : "none"}
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                  >
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                  </svg>
                                ))}
                              </div>
                            </td>
                            <td className="py-4 text-muted font-light max-w-[280px] break-words">
                              {rev.comment}
                            </td>
                            <td className="py-4 text-muted/80 font-light">
                              {new Date(rev.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </td>
                            <td className="py-4 text-right">
                              <div className="flex justify-end gap-3 items-center">
                                {!rev.isApproved ? (
                                  <button
                                    onClick={() => handleApproveReview(rev._id)}
                                    className="font-body text-[0.62rem] tracking-widest uppercase text-emerald-700 hover:text-emerald-900 bg-transparent border-0 cursor-pointer transition-colors duration-200"
                                  >
                                    Approve & Publish
                                  </button>
                                ) : (
                                  <span className="text-[0.6rem] font-medium text-muted uppercase tracking-widest border border-border/80 px-2 py-0.5 rounded-sm bg-[#FDFBF7]">
                                    Live
                                  </span>
                                )}
                                <button
                                  onClick={() => handleRejectReview(rev._id)}
                                  className="font-body text-[0.62rem] tracking-widest uppercase text-red-700 hover:text-red-950 bg-transparent border-0 cursor-pointer transition-colors duration-200"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </div>
          )}

          {/* PROMOTIONS PANEL */}
          {activePanel === "promotions" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-fadeIn">
              
              {/* Create Promo Code form */}
              <div className="bg-white border border-border p-6 sm:p-8 rounded-[3px] shadow-xs space-y-6">
                <div>
                  <h3 className="font-display font-light text-lg text-ink m-0 font-medium">Generate Promotion</h3>
                  <p className="font-body text-[0.7rem] text-muted m-0">Configure database coupon entries for customer discounts.</p>
                </div>

                {promoFormError && (
                  <div className="bg-red-50 border border-red-200 text-red-800 p-4 text-xs font-body rounded-sm">
                    {promoFormError}
                  </div>
                )}
                {promoFormSuccess && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 text-xs font-body rounded-sm font-medium">
                    {promoFormSuccess}
                  </div>
                )}

                <form onSubmit={handlePromoSubmit} className="space-y-4">
                  <div>
                    <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block mb-1.5 font-medium">Coupon Code</label>
                    <input
                      type="text"
                      placeholder="e.g. SAVE15"
                      value={promoFormData.code}
                      onChange={(e) => setPromoFormData({ ...promoFormData, code: e.target.value.toUpperCase() })}
                      className="w-full bg-[#FDFBF7] border border-border px-4 py-3 font-body text-xs text-ink outline-none focus:border-bronze rounded-[2px] uppercase"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block mb-1.5 font-medium">Discount Type</label>
                      <select
                        value={promoFormData.discountType}
                        onChange={(e) => setPromoFormData({ ...promoFormData, discountType: e.target.value })}
                        className="w-full bg-[#FDFBF7] border border-border px-3 py-3 font-body text-xs text-ink outline-none focus:border-bronze rounded-[2px]"
                      >
                        <option value="percentage">Percent Off (%)</option>
                        <option value="fixed">Flat Cash Cut (₹)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block mb-1.5 font-medium">Value</label>
                      <input
                        type="number"
                        placeholder="e.g. 15 or 1000"
                        value={promoFormData.value}
                        onChange={(e) => setPromoFormData({ ...promoFormData, value: e.target.value })}
                        className="w-full bg-[#FDFBF7] border border-border px-4 py-3 font-body text-xs text-ink outline-none focus:border-bronze rounded-[2px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block mb-1.5 font-medium">Minimum Order Total (₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 5000 (0 for no limit)"
                      value={promoFormData.minPurchase}
                      onChange={(e) => setPromoFormData({ ...promoFormData, minPurchase: e.target.value })}
                      className="w-full bg-[#FDFBF7] border border-border px-4 py-3 font-body text-xs text-ink outline-none focus:border-bronze rounded-[2px]"
                    />
                  </div>

                  <div>
                    <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block mb-1.5 font-medium">Expiration Timeline</label>
                    <input
                      type="date"
                      value={promoFormData.expiryDate}
                      onChange={(e) => setPromoFormData({ ...promoFormData, expiryDate: e.target.value })}
                      className="w-full bg-[#FDFBF7] border border-border px-4 py-3 font-body text-xs text-ink outline-none focus:border-bronze rounded-[2px]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full h-11 bg-ink hover:bg-bronze text-background font-body font-medium text-[0.62rem] tracking-[0.2em] uppercase border-0 cursor-pointer transition-colors duration-300 rounded-[2px] shadow-sm"
                  >
                    Register Promo Code
                  </button>
                </form>
              </div>

              {/* Promotions list */}
              <div className="lg:col-span-2 bg-white border border-border p-6 sm:p-8 rounded-[3px] shadow-xs space-y-6">
                <div>
                  <h3 className="font-display font-light text-lg text-ink m-0 font-medium">Active Campaigns</h3>
                  <p className="font-body text-[0.7rem] text-muted m-0">Directory of running discounts across the Atelier network.</p>
                </div>

                {promosLoading ? (
                  <div className="text-center py-20">
                    <div className="w-6 h-6 border-2 border-bronze border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="font-body text-xs text-muted tracking-wider uppercase animate-pulse">Loading active codes...</p>
                  </div>
                ) : promos.length === 0 ? (
                  <div className="text-center py-16 border border-dashed border-border/60 rounded-[3px] bg-[#FDFBF7]">
                    <svg className="w-8 h-8 text-muted/40 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 10-2 2h2zm0 8h.01M19 10a2 2 0 11-4 0V8h4v2zM5 10a2 2 0 104 0V8H5v2z" />
                    </svg>
                    <p className="font-body text-xs text-muted italic">No active promotional campaigns registered yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left font-body text-xs text-ink">
                      <thead>
                        <tr className="border-b border-border/80 text-[0.62rem] uppercase tracking-wider text-muted font-light pb-2">
                          <th className="pb-3 font-medium">Promo Code</th>
                          <th className="pb-3 font-medium">Benefit</th>
                          <th className="pb-3 font-medium">Min Purchase</th>
                          <th className="pb-3 font-medium">Expires</th>
                          <th className="pb-3 font-medium">Status</th>
                          <th className="pb-3 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {promos.map((p) => {
                          const isExpired = new Date(p.expiryDate) < new Date();
                          return (
                            <tr key={p._id} className="hover:bg-[#FDFBF7]/30 transition-colors duration-150">
                              <td className="py-3.5 font-bold tracking-wider text-ink">{p.code}</td>
                              <td className="py-3.5 font-medium text-emerald-800">
                                {p.discountType === "percentage" ? `${p.value}% Off` : `₹${p.value.toLocaleString("en-IN")} Off`}
                              </td>
                              <td className="py-3.5 text-muted font-light">
                                {p.minPurchase > 0 ? `₹${p.minPurchase.toLocaleString("en-IN")}` : "None"}
                              </td>
                              <td className="py-3.5 text-muted font-light">
                                {new Date(p.expiryDate).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </td>
                              <td className="py-3.5">
                                <span className={`inline-block text-[0.55rem] uppercase tracking-widest px-1.5 py-0.5 rounded-sm font-semibold ${
                                  isExpired
                                    ? "bg-red-50 text-red-700 border border-red-100"
                                    : "bg-emerald-50 text-emerald-800 border border-emerald-100"
                                }`}>
                                  {isExpired ? "Expired" : "Active"}
                                </span>
                              </td>
                              <td className="py-3.5 text-right">
                                <button
                                  onClick={() => handleDeletePromo(p._id)}
                                  className="font-body text-[0.62rem] tracking-widest uppercase text-red-700 hover:text-red-950 bg-transparent border-0 cursor-pointer transition-colors duration-200"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CONTACT MESSAGES PANEL */}
          {activePanel === "messages" && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Message Counts */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-border p-4 rounded-[2px] shadow-xs">
                  <span className="font-body text-[0.55rem] tracking-wider uppercase text-muted block">Total Submissions</span>
                  <span className="font-display text-xl text-ink block mt-0.5 font-medium">{messages.length} Messages</span>
                </div>
                <div className="bg-white border border-border p-4 rounded-[2px] shadow-xs">
                  <span className="font-body text-[0.55rem] tracking-wider uppercase text-muted block">New Messages</span>
                  <span className="font-display text-xl text-ink block mt-0.5 font-semibold text-bronze">
                    {messages.filter(m => m.status === "New").length} Unread
                  </span>
                </div>
                <div className="bg-white border border-border p-4 rounded-[2px] shadow-xs">
                  <span className="font-body text-[0.55rem] tracking-wider uppercase text-muted block">Replied</span>
                  <span className="font-display text-xl text-ink block mt-0.5 font-medium text-emerald-700">
                    {messages.filter(m => m.status === "Replied").length} Solved
                  </span>
                </div>
                <div className="bg-white border border-border p-4 rounded-[2px] shadow-xs">
                  <span className="font-body text-[0.55rem] tracking-wider uppercase text-muted block">Archived</span>
                  <span className="font-display text-xl text-ink block mt-0.5 font-medium text-muted">
                    {messages.filter(m => m.status === "Archived").length} Stored
                  </span>
                </div>
              </div>

              {/* List and detail view */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Side List */}
                <div className="lg:col-span-1 bg-white border border-border p-4 rounded-[2px] shadow-xs flex flex-col h-[600px]">
                  <div className="pb-3 border-b border-border mb-3">
                    <h3 className="font-display text-sm font-semibold text-ink m-0">Inbound Messages</h3>
                    <p className="font-body text-[0.65rem] text-muted m-0">Click a message header to read full inquiry details.</p>
                  </div>
                  
                  {messagesLoading ? (
                    <div className="flex-grow flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-6 h-6 border-2 border-bronze border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                        <p className="font-body text-[0.62rem] text-muted tracking-wider uppercase">Loading mailbox...</p>
                      </div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex-grow flex items-center justify-center py-10 text-center bg-[#FDFBF7]">
                      <div>
                        <svg className="w-6 h-6 text-muted/30 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <p className="font-body text-xs text-muted italic">No contact submissions found in database.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-grow overflow-y-auto space-y-2 pr-1 [scrollbar-width:thin]">
                      {messages.map((msg) => {
                        const isSelected = selectedMessage && selectedMessage._id === msg._id;
                        return (
                          <div
                            key={msg._id}
                            onClick={() => {
                              setSelectedMessage(msg);
                              // Mark as Read automatically on click if it was New
                              if (msg.status === "New") {
                                handleUpdateMessageStatus(msg._id, "Read");
                              }
                            }}
                            className={`p-3 border text-left cursor-pointer transition-all duration-200 rounded-[2px] ${
                              isSelected
                                ? "bg-surface border-bronze"
                                : "bg-background border-border hover:border-bronze/40"
                            }`}
                          >
                            <div className="flex justify-between items-start mb-1.5">
                              <span className={`text-[0.55rem] uppercase tracking-widest font-semibold px-1 py-0.5 rounded-sm ${
                                msg.status === "New"
                                  ? "bg-bronze text-white font-bold animate-pulse"
                                  : msg.status === "Read"
                                  ? "bg-blue-50 text-blue-700 border border-blue-100"
                                  : msg.status === "Replied"
                                  ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                                  : "bg-surface text-muted border border-border"
                              }`}>
                                {msg.status}
                              </span>
                              <span className="font-body text-[0.58rem] text-muted">
                                {new Date(msg.createdAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                            <h4 className="font-display font-medium text-xs text-ink m-0 truncate leading-snug">{msg.name}</h4>
                            <p className="font-body text-[0.65rem] text-muted m-0 truncate mt-0.5">{msg.subject}</p>
                            <p className="font-body text-[0.62rem] text-muted/80 m-0 line-clamp-2 mt-1 italic font-light">
                              "{msg.message}"
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Right Side Detail View */}
                <div className="lg:col-span-2 bg-white border border-border p-6 rounded-[2px] shadow-xs flex flex-col h-[600px] justify-between">
                  {selectedMessage ? (
                    <div className="flex flex-col h-full justify-between">
                      {/* Top Header Card */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-start border-b border-border pb-4">
                          <div>
                            <span className="font-body text-[0.55rem] tracking-[0.25em] uppercase text-bronze block">
                              Inquiry Subject
                            </span>
                            <h3 className="font-display font-semibold text-lg text-ink m-0 mt-1">
                              {selectedMessage.subject}
                            </h3>
                          </div>
                          <span className="font-body text-[0.65rem] text-muted font-light mt-1">
                            Received: {new Date(selectedMessage.createdAt).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </span>
                        </div>

                        {/* Customer card */}
                        <div className="p-4 bg-background border border-border/80 flex items-center justify-between flex-wrap gap-4 rounded-sm">
                          <div>
                            <span className="font-body text-[0.55rem] tracking-wider uppercase text-muted block">Sender Name</span>
                            <span className="font-display font-medium text-sm text-ink">{selectedMessage.name}</span>
                          </div>
                          <div>
                            <span className="font-body text-[0.55rem] tracking-wider uppercase text-muted block">Email Address</span>
                            <a
                              href={`mailto:${selectedMessage.email}`}
                              className="font-body text-xs text-bronze hover:underline"
                            >
                              {selectedMessage.email}
                            </a>
                          </div>
                          <div>
                            <span className="font-body text-[0.55rem] tracking-wider uppercase text-muted block">Current Status</span>
                            <span className={`inline-block text-[0.55rem] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-sm mt-0.5 ${
                              selectedMessage.status === "New"
                                ? "bg-bronze text-white"
                                : selectedMessage.status === "Read"
                                ? "bg-blue-50 text-blue-700 border border-blue-100"
                                : selectedMessage.status === "Replied"
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                                : "bg-surface text-muted border border-border"
                            }`}>
                              {selectedMessage.status}
                            </span>
                          </div>
                        </div>

                        {/* Message body */}
                        <div className="space-y-2">
                          <span className="font-body text-[0.55rem] tracking-[0.25em] uppercase text-muted block">
                            Message Body
                          </span>
                          <div className="p-5 border border-border/60 bg-[#FDFBF7] font-body text-xs leading-relaxed text-ink whitespace-pre-wrap min-h-[160px] max-h-[220px] overflow-y-auto rounded-sm">
                            {selectedMessage.message}
                          </div>
                        </div>
                      </div>

                      {/* Bottom Footer Actions */}
                      <div className="border-t border-border pt-4 flex justify-between items-center flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                          <span className="font-body text-[0.65rem] text-muted">Mark Status:</span>
                          <select
                            value={selectedMessage.status}
                            onChange={(e) => handleUpdateMessageStatus(selectedMessage._id, e.target.value)}
                            className="bg-[#FDFBF7] border border-border px-2 py-1.5 font-body text-[0.68rem] text-ink outline-none focus:border-bronze rounded-[2px]"
                          >
                            <option value="New">Unread (New)</option>
                            <option value="Read">Read</option>
                            <option value="Replied">Replied (Solved)</option>
                            <option value="Archived">Archived</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-3">
                          <a
                            href={`mailto:${selectedMessage.email}?subject=Re: Novella - ${selectedMessage.subject}`}
                            className="no-underline inline-flex items-center justify-center px-4 py-2 bg-ink hover:bg-bronze text-background font-body text-[0.62rem] tracking-widest uppercase transition-colors duration-250 rounded-[2px] font-medium"
                          >
                            Compose Email Reply
                          </a>
                          <button
                            onClick={() => handleDeleteMessage(selectedMessage._id)}
                            className="px-4 py-2 border border-red-200 hover:border-red-600 bg-transparent text-red-600 hover:text-red-700 hover:bg-red-50 font-body text-[0.62rem] tracking-widest uppercase transition-all duration-200 cursor-pointer rounded-[2px]"
                          >
                            Delete Message
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-center bg-[#FDFBF7]">
                      <div>
                        <svg className="w-10 h-10 text-muted/30 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        <h4 className="font-display font-light text-base text-ink m-0">No Message Selected</h4>
                        <p className="font-body text-xs text-muted max-w-[280px] mx-auto mt-1 leading-normal">
                          Select a customer message from the left inbox list to view details and update its resolution status.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* ATELIER CMS PANEL */}
          {activePanel === "cms" && (
            <div className="space-y-6 animate-fadeIn">
              {cmsSuccess && (
                <div className="bg-emerald-50 text-emerald-800 border border-emerald-200/60 p-4 rounded-[2px] font-body text-xs flex justify-between items-center">
                  <span>{cmsSuccess}</span>
                  <button type="button" onClick={() => setCmsSuccess("")} className="bg-transparent border-0 cursor-pointer text-emerald-800/60 hover:text-emerald-800 font-bold">×</button>
                </div>
              )}
              {cmsError && (
                <div className="bg-red-50 text-red-800 border border-red-200/60 p-4 rounded-[2px] font-body text-xs flex justify-between items-center">
                  <span>{cmsError}</span>
                  <button type="button" onClick={() => setCmsError("")} className="bg-transparent border-0 cursor-pointer text-red-800/60 hover:text-red-800 font-bold">×</button>
                </div>
              )}

              {/* Subtabs selector */}
              <div className="flex border-b border-border bg-white rounded-[3px] p-1.5 flex-wrap gap-1">
                {[
                  { id: "hero", label: "Hero Welcome Banner" },
                  { id: "promo", label: "Editorial Promotion" },
                  { id: "faqs", label: "Help FAQs List" },
                  { id: "team", label: "Meet The Team List" },
                  { id: "about_stats", label: "About Page Stats" },
                  { id: "about_milestones", label: "About Milestones" },
                  { id: "checkout", label: "Checkout & Taxes" },
                  { id: "shop_the_look", label: "Interactive Showcase (Shop the Look)" }
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setCmsSubTab(tab.id)}
                    className={`px-5 py-2.5 font-body text-[0.62rem] tracking-wider uppercase border-0 cursor-pointer transition-colors duration-250 rounded-[2px] ${
                      cmsSubTab === tab.id
                        ? "bg-bronze text-white font-semibold shadow-sm"
                        : "bg-transparent text-muted hover:text-ink hover:bg-dark/5"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Loader */}
              {cmsLoading ? (
                <div className="bg-white border border-border p-12 text-center flex flex-col items-center justify-center rounded-[2px]">
                  <div className="w-8 h-8 border-2 border-bronze border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="font-body text-xs text-muted tracking-wider uppercase">Fetching CMS sections...</p>
                </div>
              ) : (
                <div className="bg-white border border-border p-6 md:p-8 rounded-[2px]">
                  {/* SUBTAB 1: HERO */}
                  {cmsSubTab === "hero" && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSaveCmsKey("home_hero", cmsHero);
                      }}
                      className="space-y-6"
                    >
                      <h3 className="font-display font-light text-lg text-ink m-0 pb-2 border-b border-border/50">Hero Welcome Settings</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="font-body text-[0.58rem] tracking-wider uppercase text-muted block">Eyebrow Tagline</label>
                          <input
                            type="text"
                            value={cmsHero.eyebrow}
                            onChange={(e) => setCmsHero({ ...cmsHero, eyebrow: e.target.value })}
                            className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none focus:border-bronze focus:ring-1 focus:ring-bronze/10 rounded-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="font-body text-[0.58rem] tracking-wider uppercase text-muted block">CTA Link URL</label>
                          <input
                            type="text"
                            value={cmsHero.ctaLink}
                            onChange={(e) => setCmsHero({ ...cmsHero, ctaLink: e.target.value })}
                            className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none focus:border-bronze focus:ring-1 focus:ring-bronze/10 rounded-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="font-body text-[0.58rem] tracking-wider uppercase text-muted block">Headline Title (use "|" to split styling italic vs bold)</label>
                        <input
                          type="text"
                          value={cmsHero.headline}
                          onChange={(e) => setCmsHero({ ...cmsHero, headline: e.target.value })}
                          placeholder="Where every room | tells your story."
                          className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none focus:border-bronze focus:ring-1 focus:ring-bronze/10 rounded-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="font-body text-[0.58rem] tracking-wider uppercase text-muted block">Subtext Paragraph</label>
                        <textarea
                          rows={3}
                          value={cmsHero.subtext}
                          onChange={(e) => setCmsHero({ ...cmsHero, subtext: e.target.value })}
                          className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none focus:border-bronze focus:ring-1 focus:ring-bronze/10 rounded-sm"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="font-body text-[0.58rem] tracking-wider uppercase text-muted block">CTA Button Label</label>
                          <input
                            type="text"
                            value={cmsHero.ctaText}
                            onChange={(e) => setCmsHero({ ...cmsHero, ctaText: e.target.value })}
                            className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none focus:border-bronze focus:ring-1 focus:ring-bronze/10 rounded-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="font-body text-[0.58rem] tracking-wider uppercase text-muted block">Background Image</label>
                          <div
                            onDragOver={(e) => { e.preventDefault(); setIsDraggingCmsHero(true); }}
                            onDragLeave={() => setIsDraggingCmsHero(false)}
                            onDrop={(e) => { e.preventDefault(); setIsDraggingCmsHero(false); if (e.dataTransfer.files?.[0]) uploadCmsHeroImage(e.dataTransfer.files[0]); }}
                            className={`border border-dashed p-4 text-center rounded-[2px] transition-all flex flex-col items-center justify-center min-h-[90px] cursor-pointer ${
                              isDraggingCmsHero ? "border-bronze bg-bronze/5" : "border-border hover:border-bronze/60 bg-white"
                            }`}
                            onClick={() => document.getElementById("hero-cms-file-input").click()}
                          >
                            <input
                              type="file"
                              id="hero-cms-file-input"
                              accept="image/*"
                              onChange={(e) => { if (e.target.files?.[0]) uploadCmsHeroImage(e.target.files[0]); }}
                              className="hidden"
                            />
                            {isUploadingCmsHeroImage ? (
                              <div className="flex flex-col items-center gap-1.5">
                                <div className="w-4 h-4 border border-bronze border-t-transparent rounded-full animate-spin" />
                                <span className="font-body text-[0.55rem] text-muted uppercase">Uploading background...</span>
                              </div>
                            ) : cmsHero.image ? (
                              <div className="flex items-center gap-3 w-full text-left">
                                <img
                                  src={cmsHero.image}
                                  alt="Hero backdrop"
                                  className="w-14 h-10 object-cover border border-border bg-surface shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                  <span className="font-body text-[0.68rem] text-ink font-medium block truncate">Uploaded</span>
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setCmsHero(prev => ({ ...prev, image: "" })); }}
                                    className="bg-transparent border-0 font-body text-[0.55rem] tracking-wider uppercase text-red-650 hover:text-red-800 cursor-pointer p-0 mt-0.5"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-1">
                                <span className="font-body text-[0.7rem] text-ink font-medium">Drag & Drop or Click to Upload</span>
                                <span className="font-body text-[0.55rem] text-muted uppercase">JPG, PNG, WEBP files</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="bg-ink hover:bg-bronze text-background font-body font-medium text-[0.62rem] tracking-[0.22em] uppercase px-8 py-3.5 border-0 cursor-pointer transition-colors duration-250 rounded-[2px]"
                      >
                        Save Hero Changes
                      </button>
                    </form>
                  )}

                  {/* SUBTAB 2: PROMO */}
                  {cmsSubTab === "promo" && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSaveCmsKey("home_editorial_promo", cmsPromo);
                      }}
                      className="space-y-6"
                    >
                      <h3 className="font-display font-light text-lg text-ink m-0 pb-2 border-b border-border/50">Editorial Promo Settings</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="font-body text-[0.58rem] tracking-wider uppercase text-muted block">Eyebrow Label</label>
                          <input
                            type="text"
                            value={cmsPromo.eyebrow}
                            onChange={(e) => setCmsPromo({ ...cmsPromo, eyebrow: e.target.value })}
                            className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none focus:border-bronze rounded-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="font-body text-[0.58rem] tracking-wider uppercase text-muted block">Promo Code</label>
                          <input
                            type="text"
                            value={cmsPromo.code}
                            onChange={(e) => setCmsPromo({ ...cmsPromo, code: e.target.value })}
                            className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none focus:border-bronze rounded-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="font-body text-[0.58rem] tracking-wider uppercase text-muted block">Promo Headline</label>
                        <input
                          type="text"
                          value={cmsPromo.title}
                          onChange={(e) => setCmsPromo({ ...cmsPromo, title: e.target.value })}
                          className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none focus:border-bronze rounded-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="font-body text-[0.58rem] tracking-wider uppercase text-muted block">Description Subtext</label>
                        <textarea
                          rows={3}
                          value={cmsPromo.subtext}
                          onChange={(e) => setCmsPromo({ ...cmsPromo, subtext: e.target.value })}
                          className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none focus:border-bronze rounded-sm"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="font-body text-[0.58rem] tracking-wider uppercase text-muted block">CTA Link Text</label>
                          <input
                            type="text"
                            value={cmsPromo.linkText}
                            onChange={(e) => setCmsPromo({ ...cmsPromo, linkText: e.target.value })}
                            className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none focus:border-bronze rounded-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="font-body text-[0.58rem] tracking-wider uppercase text-muted block">CTA Destination Path</label>
                          <input
                            type="text"
                            value={cmsPromo.linkPath}
                            onChange={(e) => setCmsPromo({ ...cmsPromo, linkPath: e.target.value })}
                            className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none focus:border-bronze rounded-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="font-body text-[0.58rem] tracking-wider uppercase text-muted block">Promo Banner Image</label>
                          <div
                            onDragOver={(e) => { e.preventDefault(); setIsDraggingCmsPromo(true); }}
                            onDragLeave={() => setIsDraggingCmsPromo(false)}
                            onDrop={(e) => { e.preventDefault(); setIsDraggingCmsPromo(false); if (e.dataTransfer.files?.[0]) uploadCmsPromoImage(e.dataTransfer.files[0]); }}
                            className={`border border-dashed p-4 text-center rounded-[2px] transition-all flex flex-col items-center justify-center min-h-[90px] cursor-pointer ${
                              isDraggingCmsPromo ? "border-bronze bg-bronze/5" : "border-border hover:border-bronze/60 bg-white"
                            }`}
                            onClick={() => document.getElementById("promo-cms-file-input").click()}
                          >
                            <input
                              type="file"
                              id="promo-cms-file-input"
                              accept="image/*"
                              onChange={(e) => { if (e.target.files?.[0]) uploadCmsPromoImage(e.target.files[0]); }}
                              className="hidden"
                            />
                            {isUploadingCmsPromoImage ? (
                              <div className="flex flex-col items-center gap-1.5">
                                <div className="w-4 h-4 border border-bronze border-t-transparent rounded-full animate-spin" />
                                <span className="font-body text-[0.55rem] text-muted uppercase">Uploading image...</span>
                              </div>
                            ) : cmsPromo.image ? (
                              <div className="flex items-center gap-3 w-full text-left">
                                <img
                                  src={cmsPromo.image}
                                  alt="Promo banner backdrop"
                                  className="w-14 h-10 object-cover border border-border bg-surface shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                  <span className="font-body text-[0.68rem] text-ink font-medium block truncate">Uploaded</span>
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setCmsPromo(prev => ({ ...prev, image: "" })); }}
                                    className="bg-transparent border-0 font-body text-[0.55rem] tracking-wider uppercase text-red-650 hover:text-red-800 cursor-pointer p-0 mt-0.5"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-1">
                                <span className="font-body text-[0.7rem] text-ink font-medium">Drag & Drop or Click to Upload</span>
                                <span className="font-body text-[0.55rem] text-muted uppercase">JPG, PNG, WEBP files</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="bg-ink hover:bg-bronze text-background font-body font-medium text-[0.62rem] tracking-[0.22em] uppercase px-8 py-3.5 border-0 cursor-pointer transition-colors duration-250 rounded-[2px]"
                      >
                        Save Promo Changes
                      </button>
                    </form>
                  )}

                  {/* SUBTAB 3: FAQS */}
                  {cmsSubTab === "faqs" && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center pb-2 border-b border-border/50">
                        <h3 className="font-display font-light text-lg text-ink m-0">Manage Frequently Asked Questions</h3>
                        <button
                          type="button"
                          onClick={() => {
                            const newFaq = { question: "New Question?", answer: "Sample Answer detail text here." };
                            setCmsFaqs([...cmsFaqs, newFaq]);
                          }}
                          className="px-4 py-2 border border-bronze text-bronze hover:bg-bronze hover:text-white bg-transparent font-body text-[0.58rem] tracking-wider uppercase cursor-pointer transition-colors duration-200 rounded-[2px]"
                        >
                          + Add FAQ Row
                        </button>
                      </div>

                      <div className="space-y-4">
                        {cmsFaqs.map((faq, idx) => (
                          <div key={idx} className="border border-border p-4 bg-[#FDFBF7] space-y-3 relative">
                            <button
                              type="button"
                              onClick={() => {
                                setCmsFaqs(cmsFaqs.filter((_, i) => i !== idx));
                              }}
                              className="absolute top-3 right-3 text-red-600 hover:text-red-800 font-body text-[0.65rem] tracking-widest uppercase border-0 bg-transparent cursor-pointer"
                            >
                              Remove
                            </button>
                            <span className="font-display font-light text-xs text-bronze leading-none">FAQ #{idx + 1}</span>
                            
                            <div className="space-y-1">
                              <label className="font-body text-[0.55rem] uppercase tracking-wider text-muted block">Question</label>
                              <input
                                type="text"
                                value={faq.question}
                                onChange={(e) => {
                                  const updated = [...cmsFaqs];
                                  updated[idx].question = e.target.value;
                                  setCmsFaqs(updated);
                                }}
                                className="w-full bg-white border border-border px-3 py-2 font-body text-xs text-ink outline-none focus:border-bronze rounded-sm"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="font-body text-[0.55rem] uppercase tracking-wider text-muted block">Answer</label>
                              <textarea
                                rows={2}
                                value={faq.answer}
                                onChange={(e) => {
                                  const updated = [...cmsFaqs];
                                  updated[idx].answer = e.target.value;
                                  setCmsFaqs(updated);
                                }}
                                className="w-full bg-white border border-border px-3 py-2 font-body text-xs text-ink outline-none focus:border-bronze rounded-sm"
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSaveCmsKey("faqs_list", cmsFaqs)}
                        className="bg-ink hover:bg-bronze text-background font-body font-medium text-[0.62rem] tracking-[0.22em] uppercase px-8 py-3.5 border-0 cursor-pointer transition-colors duration-250 rounded-[2px]"
                      >
                        Save All FAQ Changes
                      </button>
                    </div>
                  )}

                  {/* SUBTAB 4: MEET THE TEAM */}
                  {cmsSubTab === "team" && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center pb-2 border-b border-border/50">
                        <h3 className="font-display font-light text-lg text-ink m-0">Manage Team Profiles</h3>
                        <button
                          type="button"
                          onClick={() => {
                            const newMember = { name: "Full Name", role: "Job Title / Role", bio: "Bio quote / details.", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80" };
                            setCmsTeam([...cmsTeam, newMember]);
                          }}
                          className="px-4 py-2 border border-bronze text-bronze hover:bg-bronze hover:text-white bg-transparent font-body text-[0.58rem] tracking-wider uppercase cursor-pointer transition-colors duration-200 rounded-[2px]"
                        >
                          + Add Team Member
                        </button>
                      </div>

                      <div className="space-y-4">
                        {cmsTeam.map((member, idx) => (
                          <div key={idx} className="border border-border p-4 bg-[#FDFBF7] space-y-4 relative grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button
                              type="button"
                              onClick={() => {
                                setCmsTeam(cmsTeam.filter((_, i) => i !== idx));
                              }}
                              className="absolute top-3 right-3 text-red-600 hover:text-red-800 font-body text-[0.65rem] tracking-widest uppercase border-0 bg-transparent cursor-pointer"
                            >
                              Remove
                            </button>

                            <div className="md:col-span-3 pb-1 border-b border-border/40">
                              <span className="font-display font-light text-xs text-bronze leading-none">Member Profile #{idx + 1}</span>
                            </div>

                            <div className="col-span-1 space-y-2">
                              <label className="font-body text-[0.55rem] uppercase tracking-wider text-muted block">Portrait Image</label>
                              <div
                                onDragOver={(e) => { e.preventDefault(); }}
                                onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files?.[0]) uploadCmsTeamImage(e.dataTransfer.files[0], idx); }}
                                className="border border-dashed border-border hover:border-bronze/60 bg-white p-3 text-center rounded-sm transition-all flex flex-col items-center justify-center min-h-[100px] cursor-pointer"
                                onClick={() => document.getElementById(`team-file-input-${idx}`).click()}
                              >
                                <input
                                  type="file"
                                  id={`team-file-input-${idx}`}
                                  accept="image/*"
                                  onChange={(e) => { if (e.target.files?.[0]) uploadCmsTeamImage(e.target.files[0], idx); }}
                                  className="hidden"
                                />
                                {cmsTeamUploadingIdx === idx ? (
                                  <div className="flex flex-col items-center gap-1">
                                    <div className="w-4 h-4 border border-bronze border-t-transparent rounded-full animate-spin" />
                                    <span className="font-body text-[0.55rem] text-muted uppercase">Uploading...</span>
                                  </div>
                                ) : member.image ? (
                                  <div className="flex flex-col items-center gap-2">
                                    <img
                                      src={member.image}
                                      alt="Portrait preview"
                                      className="w-16 h-16 object-cover rounded-full border border-border"
                                    />
                                    <span className="font-body text-[0.55rem] text-muted uppercase hover:text-red-750" onClick={(e) => { e.stopPropagation(); const updated = [...cmsTeam]; updated[idx].image = ""; setCmsTeam(updated); }}>Remove</span>
                                  </div>
                                ) : (
                                  <div className="flex flex-col items-center gap-0.5">
                                    <span className="font-body text-[0.62rem] text-ink font-medium">Upload Image</span>
                                    <span className="font-body text-[0.5rem] text-muted uppercase">Drag or Click</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="md:col-span-2 space-y-3">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <label className="font-body text-[0.55rem] uppercase tracking-wider text-muted block">Full Name</label>
                                  <input
                                    type="text"
                                    value={member.name || ""}
                                    onChange={(e) => {
                                      const updated = [...cmsTeam];
                                      updated[idx].name = e.target.value;
                                      setCmsTeam(updated);
                                    }}
                                    className="w-full bg-white border border-border px-2 py-1.5 font-body text-xs text-ink outline-none focus:border-bronze rounded-sm"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="font-body text-[0.55rem] uppercase tracking-wider text-muted block">Job Role</label>
                                  <input
                                    type="text"
                                    value={member.role || ""}
                                    onChange={(e) => {
                                      const updated = [...cmsTeam];
                                      updated[idx].role = e.target.value;
                                      setCmsTeam(updated);
                                    }}
                                    className="w-full bg-white border border-border px-2 py-1.5 font-body text-xs text-ink outline-none focus:border-bronze rounded-sm"
                                  />
                                </div>
                              </div>

                              <div className="space-y-1">
                                <label className="font-body text-[0.55rem] uppercase tracking-wider text-muted block">Bio Biography Quote</label>
                                <textarea
                                  rows={2}
                                  value={member.bio || member.quote || ""}
                                  onChange={(e) => {
                                    const updated = [...cmsTeam];
                                    if (updated[idx].bio !== undefined) updated[idx].bio = e.target.value;
                                    else updated[idx].quote = e.target.value;
                                    setCmsTeam(updated);
                                  }}
                                  className="w-full bg-white border border-border px-2 py-1.5 font-body text-xs text-ink outline-none focus:border-bronze rounded-sm"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSaveCmsKey("team_members", cmsTeam)}
                        className="bg-ink hover:bg-bronze text-background font-body font-medium text-[0.62rem] tracking-[0.22em] uppercase px-8 py-3.5 border-0 cursor-pointer transition-colors duration-250 rounded-[2px]"
                      >
                        Save All Team Profiles
                      </button>
                    </div>
                  )}

                  {/* SUBTAB 5: CHECKOUT & TAXES */}
                  {cmsSubTab === "checkout" && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSaveCmsKey("checkout_settings", cmsCheckout);
                      }}
                      className="space-y-6"
                    >
                      <h3 className="font-display font-light text-lg text-ink m-0 pb-2 border-b border-border/50">Checkout Pricing & Shipping Configurations</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="font-body text-[0.58rem] tracking-wider uppercase text-muted block">Standard Shipping Fee (₹)</label>
                          <input
                            type="number"
                            value={cmsCheckout.standardShippingFee}
                            onChange={(e) => setCmsCheckout({ ...cmsCheckout, standardShippingFee: Number(e.target.value) })}
                            className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none focus:border-bronze focus:ring-1 focus:ring-bronze/10 rounded-sm"
                            min="0"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="font-body text-[0.58rem] tracking-wider uppercase text-muted block">Express Shipping Fee (₹)</label>
                          <input
                            type="number"
                            value={cmsCheckout.expressShippingFee}
                            onChange={(e) => setCmsCheckout({ ...cmsCheckout, expressShippingFee: Number(e.target.value) })}
                            className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none focus:border-bronze focus:ring-1 focus:ring-bronze/10 rounded-sm"
                            min="0"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="font-body text-[0.58rem] tracking-wider uppercase text-muted block">Free Shipping Subtotal Threshold (₹)</label>
                          <input
                            type="number"
                            value={cmsCheckout.freeShippingThreshold}
                            onChange={(e) => setCmsCheckout({ ...cmsCheckout, freeShippingThreshold: Number(e.target.value) })}
                            className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none focus:border-bronze focus:ring-1 focus:ring-bronze/10 rounded-sm"
                            min="0"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="font-body text-[0.58rem] tracking-wider uppercase text-muted block">Cash On Delivery (COD) Handling Fee (₹)</label>
                          <input
                            type="number"
                            value={cmsCheckout.codFee}
                            onChange={(e) => setCmsCheckout({ ...cmsCheckout, codFee: Number(e.target.value) })}
                            className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none focus:border-bronze focus:ring-1 focus:ring-bronze/10 rounded-sm"
                            min="0"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="font-body text-[0.58rem] tracking-wider uppercase text-muted block">Tax Rate (GST %)</label>
                          <input
                            type="number"
                            value={cmsCheckout.taxRate}
                            onChange={(e) => setCmsCheckout({ ...cmsCheckout, taxRate: Number(e.target.value) })}
                            className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none focus:border-bronze focus:ring-1 focus:ring-bronze/10 rounded-sm"
                            min="0"
                            max="100"
                            required
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="bg-ink hover:bg-bronze text-background font-body font-medium text-[0.62rem] tracking-[0.22em] uppercase px-8 py-3.5 border-0 cursor-pointer transition-colors duration-250 rounded-[2px]"
                      >
                        Save Checkout Settings
                      </button>
                    </form>
                  )}

                  {/* SUBTAB 6: ABOUT STATS */}
                  {cmsSubTab === "about_stats" && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center pb-2 border-b border-border/50">
                        <h3 className="font-display font-light text-lg text-ink m-0">About Page Statistics</h3>
                        <button
                          type="button"
                          onClick={() => {
                            const newStat = { key: `custom_${Date.now()}`, number: "0", label: "Stat Title", desc: "Short description", source: "manual" };
                            setCmsAboutStats([...cmsAboutStats, newStat]);
                          }}
                          className="px-4 py-2 border border-bronze text-bronze hover:bg-bronze hover:text-white bg-transparent font-body text-[0.58rem] tracking-wider uppercase cursor-pointer transition-colors duration-200 rounded-[2px]"
                        >
                          + Add Custom Stat
                        </button>
                      </div>

                      {/* Dynamic stats info */}
                      <div className="border border-bronze/30 bg-bronze/5 p-4 rounded-[2px] space-y-2">
                        <div className="flex items-center gap-2">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-bronze flex-shrink-0">
                            <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
                          </svg>
                          <span className="font-body font-medium text-[0.7rem] tracking-wider uppercase text-bronze">Auto-Computed Stats</span>
                        </div>
                        <p className="font-body text-[0.75rem] text-muted leading-relaxed m-0">
                          The following stats are <strong>automatically calculated</strong> from your database and require no manual input:
                        </p>
                        <ul className="font-body text-[0.72rem] text-ink/70 leading-relaxed m-0 pl-4 space-y-0.5" style={{ listStyle: "disc" }}>
                          <li><strong>Original Designs</strong> — Total product count</li>
                          <li><strong>Happy Homes</strong> — Delivered orders / unique customers</li>
                          <li><strong>Average Rating</strong> — Aggregated from all approved reviews</li>
                          <li><strong>Categories</strong> — Active category count</li>
                        </ul>
                        <p className="font-body text-[0.68rem] text-muted leading-relaxed m-0 mt-1">
                          Use the <strong>"+ Add Custom Stat"</strong> button above to add extra stats that are manually managed (e.g., "100% In-House Design").
                        </p>
                      </div>

                      {/* Manual stats cards */}
                      {cmsAboutStats.filter(s => s.source === "manual").length > 0 && (
                        <div className="space-y-4">
                          <h4 className="font-display font-light text-sm text-ink m-0">Custom Manual Stats</h4>
                          {cmsAboutStats.filter(s => s.source === "manual").map((stat, idx) => {
                            const realIdx = cmsAboutStats.findIndex(s => s === stat);
                            return (
                              <div key={realIdx} className="border border-border p-4 bg-[#FDFBF7] space-y-4 relative grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCmsAboutStats(cmsAboutStats.filter((_, i) => i !== realIdx));
                                  }}
                                  className="absolute top-3 right-3 text-red-600 hover:text-red-800 font-body text-[0.62rem] tracking-widest uppercase border-0 bg-transparent cursor-pointer"
                                >
                                  Remove
                                </button>

                                <div className="md:col-span-3 pb-1 border-b border-border/40 flex items-center gap-2">
                                  <span className="inline-block px-2 py-0.5 bg-bronze/10 text-bronze text-[0.5rem] tracking-widest uppercase font-body rounded-sm">Manual</span>
                                  <span className="font-display font-light text-xs text-bronze leading-none">Custom Stat #{idx + 1}</span>
                                </div>

                                <div className="space-y-1">
                                  <label className="font-body text-[0.55rem] uppercase tracking-wider text-muted block">Big Stat Value (e.g. 100%)</label>
                                  <input
                                    type="text"
                                    value={stat.number || ""}
                                    onChange={(e) => {
                                      const updated = [...cmsAboutStats];
                                      updated[realIdx].number = e.target.value;
                                      setCmsAboutStats(updated);
                                    }}
                                    className="w-full bg-white border border-border px-3 py-2 font-body text-xs text-ink outline-none focus:border-bronze rounded-sm"
                                    required
                                  />
                                </div>

                                <div className="space-y-1">
                                  <label className="font-body text-[0.55rem] uppercase tracking-wider text-muted block">Label / Title</label>
                                  <input
                                    type="text"
                                    value={stat.label || ""}
                                    onChange={(e) => {
                                      const updated = [...cmsAboutStats];
                                      updated[realIdx].label = e.target.value;
                                      setCmsAboutStats(updated);
                                    }}
                                    className="w-full bg-white border border-border px-3 py-2 font-body text-xs text-ink outline-none focus:border-bronze rounded-sm"
                                    required
                                  />
                                </div>

                                <div className="space-y-1">
                                  <label className="font-body text-[0.55rem] uppercase tracking-wider text-muted block">Brief Description</label>
                                  <input
                                    type="text"
                                    value={stat.desc || ""}
                                    onChange={(e) => {
                                      const updated = [...cmsAboutStats];
                                      updated[realIdx].desc = e.target.value;
                                      setCmsAboutStats(updated);
                                    }}
                                    className="w-full bg-white border border-border px-3 py-2 font-body text-xs text-ink outline-none focus:border-bronze rounded-sm"
                                    required
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => handleSaveCmsKey("about_stats", cmsAboutStats)}
                        className="bg-ink hover:bg-bronze text-background font-body font-medium text-[0.62rem] tracking-[0.22em] uppercase px-8 py-3.5 border-0 cursor-pointer transition-colors duration-250 rounded-[2px]"
                      >
                        Save Custom Stats
                      </button>
                    </div>
                  )}

                  {/* SUBTAB 7: ABOUT MILESTONES */}
                  {cmsSubTab === "about_milestones" && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center pb-2 border-b border-border/50">
                        <h3 className="font-display font-light text-lg text-ink m-0">About Page Milestones (Our Journey)</h3>
                        <button
                          type="button"
                          onClick={() => {
                            const newMilestone = { year: "2026", event: "Milestone Event", desc: "Short description of event." };
                            setCmsAboutMilestones([...cmsAboutMilestones, newMilestone]);
                          }}
                          className="px-4 py-2 border border-bronze text-bronze hover:bg-bronze hover:text-white bg-transparent font-body text-[0.58rem] tracking-wider uppercase cursor-pointer transition-colors duration-200 rounded-[2px]"
                        >
                          + Add Milestone
                        </button>
                      </div>

                      <div className="space-y-4">
                        {cmsAboutMilestones.map((m, idx) => (
                          <div key={idx} className="border border-border p-4 bg-[#FDFBF7] space-y-4 relative grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button
                              type="button"
                              onClick={() => {
                                setCmsAboutMilestones(cmsAboutMilestones.filter((_, i) => i !== idx));
                              }}
                              className="absolute top-3 right-3 text-red-600 hover:text-red-800 font-body text-[0.62rem] tracking-widest uppercase border-0 bg-transparent cursor-pointer"
                            >
                              Remove
                            </button>

                            <div className="md:col-span-3 pb-1 border-b border-border/40">
                              <span className="font-display font-light text-xs text-bronze leading-none">Milestone #{idx + 1}</span>
                            </div>

                            <div className="space-y-1">
                              <label className="font-body text-[0.55rem] uppercase tracking-wider text-muted block">Year (e.g. 2024)</label>
                              <input
                                type="text"
                                value={m.year || ""}
                                onChange={(e) => {
                                  const updated = [...cmsAboutMilestones];
                                  updated[idx].year = e.target.value;
                                  setCmsAboutMilestones(updated);
                                }}
                                className="w-full bg-white border border-border px-3 py-2 font-body text-xs text-ink outline-none focus:border-bronze rounded-sm"
                                required
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="font-body text-[0.55rem] uppercase tracking-wider text-muted block">Event / Achievement</label>
                              <input
                                type="text"
                                value={m.event || ""}
                                onChange={(e) => {
                                  const updated = [...cmsAboutMilestones];
                                  updated[idx].event = e.target.value;
                                  setCmsAboutMilestones(updated);
                                }}
                                className="w-full bg-white border border-border px-3 py-2 font-body text-xs text-ink outline-none focus:border-bronze rounded-sm"
                                required
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="font-body text-[0.55rem] uppercase tracking-wider text-muted block">Milestone Description</label>
                              <input
                                type="text"
                                value={m.desc || ""}
                                onChange={(e) => {
                                  const updated = [...cmsAboutMilestones];
                                  updated[idx].desc = e.target.value;
                                  setCmsAboutMilestones(updated);
                                }}
                                className="w-full bg-white border border-border px-3 py-2 font-body text-xs text-ink outline-none focus:border-bronze rounded-sm"
                                required
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSaveCmsKey("about_milestones", cmsAboutMilestones)}
                        className="bg-ink hover:bg-bronze text-background font-body font-medium text-[0.62rem] tracking-[0.22em] uppercase px-8 py-3.5 border-0 cursor-pointer transition-colors duration-250 rounded-[2px]"
                      >
                        Save All Milestones
                      </button>
                    </div>
                  )}

                  {/* SUBTAB 8: INTERACTIVE SHOWCASE */}
                  {cmsSubTab === "shop_the_look" && (
                    <div className="space-y-8 animate-fadeIn">
                      <div className="pb-3 border-b border-border/60 flex justify-between items-center">
                        <div>
                          <h3 className="font-display font-light text-base text-ink m-0 uppercase tracking-widest">
                            Interactive Showcase Config
                          </h3>
                          <p className="font-body text-[0.68rem] text-muted m-0 mt-1">
                            Set up hotspots on the main design scene image.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Left Column: Visual Placement Map */}
                        <div className="lg:col-span-6 space-y-4">
                          <span className="font-body text-[0.62rem] uppercase tracking-wider text-muted block font-semibold">
                            Visual Builder (Click image to reposition selected hotspot)
                          </span>
                          
                          <div 
                            className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-border/80 shadow-sm cursor-crosshair bg-surface"
                            onClick={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              const x = ((e.clientX - rect.left) / rect.width) * 100;
                              const y = ((e.clientY - rect.top) / rect.height) * 100;
                              
                              const updated = [...(cmsShopTheLook.hotspots || [])];
                              if (updated[selectedHotspotIdx]) {
                                updated[selectedHotspotIdx].left = `${Math.round(x)}%`;
                                updated[selectedHotspotIdx].top = `${Math.round(y)}%`;
                                setCmsShopTheLook({ ...cmsShopTheLook, hotspots: updated });
                              }
                            }}
                          >
                            <img
                              src={cmsShopTheLook.image || "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1400&q=85"}
                              alt="Showcase backdrop preview"
                              className="absolute inset-0 w-full h-full object-cover select-none"
                              draggable="false"
                            />
                            
                            {/* Overlay Hotspots */}
                            {(cmsShopTheLook.hotspots || []).map((spot, idx) => (
                              <div
                                key={spot.id || idx}
                                className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                                style={{ top: spot.top, left: spot.left }}
                              >
                                <span className={`absolute inline-flex h-8 w-8 rounded-full bg-bronze/45 opacity-75 animate-ping -left-1.5 -top-1.5 transition-all duration-300 ${
                                  selectedHotspotIdx === idx ? "scale-125" : "hidden"
                                }`} />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedHotspotIdx(idx);
                                  }}
                                  className={`relative inline-flex h-7 w-7 rounded-full border items-center justify-center font-body text-[0.68rem] font-bold cursor-pointer shadow-md transition-all duration-200 ${
                                    selectedHotspotIdx === idx
                                      ? "bg-bronze border-white text-white scale-110"
                                      : "bg-white border-border text-bronze hover:scale-105"
                                  }`}
                                >
                                  {idx + 1}
                                </button>
                              </div>
                            ))}
                          </div>
                          
                          <div className="p-4 bg-background border border-border/80 rounded-md font-body text-[0.68rem] text-muted leading-relaxed">
                            <span className="font-semibold text-ink block mb-1">How to position hotspots:</span>
                            1. Select a hotspot card from the right column or click on its number above.<br />
                            2. Click anywhere on the image preview to automatically reposition it there.
                          </div>
                        </div>

                        {/* Right Column: Editor Form Fields */}
                        <div className="lg:col-span-6 space-y-6">
                          {/* Image Upload Box */}
                          <div className="space-y-2">
                            <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block font-medium">Showcase Backdrop Image</label>
                            
                            <div
                              onDragOver={(e) => { e.preventDefault(); setIsDraggingCmsShowcase(true); }}
                              onDragLeave={() => setIsDraggingCmsShowcase(false)}
                              onDrop={async (e) => {
                                e.preventDefault();
                                setIsDraggingCmsShowcase(false);
                                if (e.dataTransfer.files?.length) {
                                  await uploadCmsShowcaseImage(e.dataTransfer.files[0]);
                                }
                              }}
                              className={`border border-dashed p-6 text-center transition-all cursor-pointer rounded-sm flex flex-col items-center justify-center min-h-[120px] bg-background/50 ${
                                isDraggingCmsShowcase ? "border-bronze bg-bronze/5" : "border-border hover:border-bronze/50"
                              }`}
                            >
                              {isUploadingCmsShowcaseImage ? (
                                <div className="flex flex-col items-center gap-2">
                                  <div className="w-5 h-5 border border-bronze border-t-transparent rounded-full animate-spin" />
                                  <span className="font-body text-[0.62rem] text-muted tracking-wider uppercase">Uploading...</span>
                                </div>
                              ) : cmsShopTheLook.image ? (
                                <div className="relative w-full max-h-[100px] overflow-hidden flex items-center justify-center">
                                  <img
                                    src={cmsShopTheLook.image}
                                    alt="Showcase backdrop preview"
                                    className="max-h-[100px] rounded-sm object-contain"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setCmsShopTheLook(prev => ({ ...prev, image: "" }))}
                                    className="absolute top-1 right-1 bg-red-600 text-white border-0 cursor-pointer rounded-full p-1 hover:bg-red-700 transition-colors"
                                  >
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <svg className="w-6 h-6 text-muted mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <span className="font-body text-[0.62rem] text-muted block tracking-wider uppercase mb-1">Drag image file here or</span>
                                  <input
                                    type="file"
                                    id="cms-showcase-file"
                                    onChange={async (e) => {
                                      if (e.target.files?.length) {
                                        await uploadCmsShowcaseImage(e.target.files[0]);
                                      }
                                    }}
                                    className="hidden"
                                    accept="image/*"
                                  />
                                  <label
                                    htmlFor="cms-showcase-file"
                                    className="font-body text-[0.62rem] text-bronze cursor-pointer font-semibold underline hover:text-ink tracking-wider uppercase"
                                  >
                                    Browse Files
                                  </label>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Text Fields */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block font-medium">Showcase Title</label>
                              <input
                                type="text"
                                value={cmsShopTheLook.title || ""}
                                onChange={(e) => setCmsShopTheLook({ ...cmsShopTheLook, title: e.target.value })}
                                className="w-full bg-background border border-border px-3 py-2 font-body text-xs text-ink outline-none focus:border-bronze rounded-sm"
                                required
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block font-medium">CTA Button Text</label>
                              <input
                                type="text"
                                value={cmsShopTheLook.buttonText || ""}
                                onChange={(e) => setCmsShopTheLook({ ...cmsShopTheLook, buttonText: e.target.value })}
                                className="w-full bg-background border border-border px-3 py-2 font-body text-xs text-ink outline-none focus:border-bronze rounded-sm"
                                required
                              />
                            </div>
                            <div className="col-span-2 space-y-1.5">
                              <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block font-medium">Showcase Subtitle</label>
                              <textarea
                                value={cmsShopTheLook.subtitle || ""}
                                onChange={(e) => setCmsShopTheLook({ ...cmsShopTheLook, subtitle: e.target.value })}
                                className="w-full bg-background border border-border px-3 py-2 font-body text-xs text-ink outline-none focus:border-bronze rounded-sm min-h-[60px]"
                                required
                              />
                            </div>
                            <div className="col-span-2 space-y-1.5">
                              <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block font-medium">CTA Button Redirect Link</label>
                              <input
                                type="text"
                                value={cmsShopTheLook.buttonLink || ""}
                                onChange={(e) => setCmsShopTheLook({ ...cmsShopTheLook, buttonLink: e.target.value })}
                                className="w-full bg-background border border-border px-3 py-2 font-body text-xs text-ink outline-none focus:border-bronze rounded-sm"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Hotspots Settings List */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-border/40 pb-2">
                          <span className="font-body text-[0.62rem] uppercase tracking-wider text-muted block font-semibold">
                            Hotspot Points list
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const newSpot = {
                                id: "hotspot_" + Date.now(),
                                top: "50%",
                                left: "50%",
                                matchName: "",
                                displayName: "New Hotspot",
                                productId: "",
                                fallback: { name: "", price: 0, image: "" }
                              };
                              const updated = [...(cmsShopTheLook.hotspots || [])];
                              updated.push(newSpot);
                              setCmsShopTheLook({ ...cmsShopTheLook, hotspots: updated });
                              setSelectedHotspotIdx(updated.length - 1);
                            }}
                            className="bg-ink hover:bg-bronze text-background font-body font-medium text-[0.55rem] tracking-wider uppercase px-4 py-2 border-0 cursor-pointer transition-colors duration-200 rounded-[2px]"
                          >
                            + Add Hotspot Point
                          </button>
                        </div>

                        <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                          {(cmsShopTheLook.hotspots || []).map((spot, idx) => (
                            <div
                              key={spot.id || idx}
                              onClick={() => setSelectedHotspotIdx(idx)}
                              className={`border p-4 bg-[#FDFBF7] space-y-4 relative grid grid-cols-1 md:grid-cols-4 gap-4 transition-all duration-300 rounded-[3px] cursor-pointer ${
                                selectedHotspotIdx === idx ? "border-bronze shadow-xs" : "border-border/60"
                              }`}
                            >
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const updated = (cmsShopTheLook.hotspots || []).filter((_, i) => i !== idx);
                                  setCmsShopTheLook({ ...cmsShopTheLook, hotspots: updated });
                                  setSelectedHotspotIdx(Math.max(0, idx - 1));
                                }}
                                className="absolute top-3.5 right-3.5 text-red-600 hover:text-red-800 font-body text-[0.62rem] tracking-widest uppercase border-0 bg-transparent cursor-pointer"
                              >
                                Remove
                              </button>

                              <div className="md:col-span-4 pb-1 border-b border-border/40 flex items-center gap-2">
                                <span className={`flex items-center justify-center w-5 h-5 rounded-full font-body text-[0.68rem] font-bold text-white ${
                                  selectedHotspotIdx === idx ? "bg-bronze" : "bg-muted"
                                }`}>
                                  {idx + 1}
                                </span>
                                <span className="font-display font-light text-xs text-bronze leading-none">
                                  Config: {spot.displayName || "New Hotspot"}
                                </span>
                              </div>

                              <div className="space-y-1">
                                <label className="font-body text-[0.55rem] uppercase tracking-wider text-muted block">Display Label</label>
                                <input
                                  type="text"
                                  value={spot.displayName || ""}
                                  onChange={(e) => {
                                    const updated = [...cmsShopTheLook.hotspots];
                                    updated[idx].displayName = e.target.value;
                                    setCmsShopTheLook({ ...cmsShopTheLook, hotspots: updated });
                                  }}
                                  className="w-full bg-white border border-border px-3 py-2 font-body text-xs text-ink outline-none focus:border-bronze rounded-sm"
                                  required
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="font-body text-[0.55rem] uppercase tracking-wider text-muted block">Position: Top (%)</label>
                                <input
                                  type="text"
                                  value={spot.top || ""}
                                  onChange={(e) => {
                                    const updated = [...cmsShopTheLook.hotspots];
                                    updated[idx].top = e.target.value;
                                    setCmsShopTheLook({ ...cmsShopTheLook, hotspots: updated });
                                  }}
                                  className="w-full bg-white border border-border px-3 py-2 font-body text-xs text-ink outline-none focus:border-bronze rounded-sm"
                                  required
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="font-body text-[0.55rem] uppercase tracking-wider text-muted block">Position: Left (%)</label>
                                <input
                                  type="text"
                                  value={spot.left || ""}
                                  onChange={(e) => {
                                    const updated = [...cmsShopTheLook.hotspots];
                                    updated[idx].left = e.target.value;
                                    setCmsShopTheLook({ ...cmsShopTheLook, hotspots: updated });
                                  }}
                                  className="w-full bg-white border border-border px-3 py-2 font-body text-xs text-ink outline-none focus:border-bronze rounded-sm"
                                  required
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="font-body text-[0.55rem] uppercase tracking-wider text-muted block">Featured Product</label>
                                <select
                                  value={spot.productId || ""}
                                  onChange={(e) => {
                                    const p = products.find(prod => String(prod.id) === e.target.value);
                                    const updated = [...cmsShopTheLook.hotspots];
                                    if (p) {
                                      updated[idx].productId = String(p.id);
                                      updated[idx].matchName = p.name;
                                      updated[idx].fallback = {
                                        name: p.name,
                                        price: p.price,
                                        image: p.images?.[0] || p.image
                                      };
                                    } else {
                                      updated[idx].productId = "";
                                      updated[idx].matchName = "";
                                      updated[idx].fallback = { name: "", price: 0, image: "" };
                                    }
                                    setCmsShopTheLook({ ...cmsShopTheLook, hotspots: updated });
                                  }}
                                  className="w-full bg-white border border-border px-2 py-2 font-body text-xs text-ink outline-none focus:border-bronze rounded-sm"
                                  required
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <option value="">-- Choose Product --</option>
                                  {products.map(p => (
                                    <option key={p.id} value={p.id}>{p.name} (ID: {p.id})</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSaveCmsKey("shop_the_look", cmsShopTheLook)}
                        className="bg-ink hover:bg-bronze text-background font-body font-medium text-[0.62rem] tracking-[0.22em] uppercase px-8 py-3.5 border-0 cursor-pointer transition-colors duration-250 rounded-[2px]"
                      >
                        Save Interactive Showcase Settings
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* SHOWCASES PANEL */}
          {activePanel === "showcases" && (
                <div className="space-y-8 animate-fadeIn text-ink">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Form to Add Showcase */}
                    <div className="lg:col-span-5 bg-white border border-border p-6 rounded-md space-y-6">
                      <div className="pb-3 border-b border-border/60">
                        <h3 className="font-display font-light text-base text-ink m-0 uppercase tracking-widest">
                          Add New Showcase
                        </h3>
                        <p className="font-body text-[0.68rem] text-muted m-0 mt-1">
                          Share a styled customer home photo.
                        </p>
                      </div>

                      {showcaseFormError && (
                        <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 font-body text-xs rounded-sm">
                          {showcaseFormError}
                        </div>
                      )}

                      {showcaseFormSuccess && (
                        <div className="p-3.5 bg-green-50 border border-green-200 text-green-700 font-body text-xs rounded-sm">
                          {showcaseFormSuccess}
                        </div>
                      )}

                      <form onSubmit={handleShowcaseSubmit} className="space-y-5">
                        {/* Creator Handle */}
                        <div className="space-y-1.5">
                          <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block font-medium">
                            Creator Social Handle
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. @jules_minimalist"
                            value={showcaseFormData.handle}
                            onChange={(e) => setShowcaseFormData(prev => ({ ...prev, handle: e.target.value }))}
                            className="w-full bg-white border border-border px-3.5 py-2.5 font-body text-xs text-ink outline-none focus:border-bronze rounded-sm"
                            required
                          />
                        </div>

                        {/* Space Title */}
                        <div className="space-y-1.5">
                          <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block font-medium">
                            Room / Space Title
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Bedroom Suite"
                            value={showcaseFormData.space}
                            onChange={(e) => setShowcaseFormData(prev => ({ ...prev, space: e.target.value }))}
                            className="w-full bg-white border border-border px-3.5 py-2.5 font-body text-xs text-ink outline-none focus:border-bronze rounded-sm"
                            required
                          />
                        </div>

                        {/* Select Product */}
                        <div className="space-y-1.5">
                          <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block font-medium">
                            Featured Product
                          </label>
                          <select
                            value={showcaseFormData.productId}
                            onChange={(e) => {
                              const p = products.find(prod => String(prod.id) === e.target.value);
                              if (p) {
                                setShowcaseFormData(prev => ({
                                  ...prev,
                                  productId: String(p.id),
                                  productName: p.name
                                }));
                              } else {
                                setShowcaseFormData(prev => ({
                                  ...prev,
                                  productId: "",
                                  productName: ""
                                }));
                              }
                            }}
                            className="w-full bg-white border border-border px-3.5 py-2.5 font-body text-xs text-ink outline-none focus:border-bronze rounded-sm"
                            required
                          >
                            <option value="">-- Select Catalog Product --</option>
                            {products.map(p => (
                              <option key={p.id} value={p.id}>
                                {p.name} (ID: {p.id})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-1.5">
                          <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block font-medium">
                            Showcase Image
                          </label>
                          
                          <div
                            onDragOver={(e) => { e.preventDefault(); setIsDraggingShowcase(true); }}
                            onDragLeave={() => setIsDraggingShowcase(false)}
                            onDrop={async (e) => {
                              e.preventDefault();
                              setIsDraggingShowcase(false);
                              if (e.dataTransfer.files?.length) {
                                await handleShowcaseImageUpload(e.dataTransfer.files[0]);
                              }
                            }}
                            className={`border border-dashed p-6 text-center transition-all cursor-pointer rounded-sm flex flex-col items-center justify-center min-h-[140px] bg-background/50 ${
                              isDraggingShowcase ? "border-bronze bg-bronze/5" : "border-border hover:border-bronze/50"
                            }`}
                          >
                            {isUploadingShowcaseImage ? (
                              <div className="flex flex-col items-center gap-2">
                                <div className="w-5 h-5 border border-bronze border-t-transparent rounded-full animate-spin" />
                                <span className="font-body text-[0.62rem] text-muted tracking-wider uppercase">Uploading...</span>
                              </div>
                            ) : showcaseFormData.image ? (
                              <div className="relative group/img w-full max-h-[120px] overflow-hidden">
                                <img
                                  src={showcaseFormData.image}
                                  alt="Upload preview"
                                  className="w-full h-full object-cover rounded-sm"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowcaseFormData(prev => ({ ...prev, image: "" }))}
                                  className="absolute top-1.5 right-1.5 bg-red-600/90 text-white border-0 cursor-pointer rounded-full p-1.5 hover:bg-red-700 transition-colors"
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                  </svg>
                                </button>
                              </div>
                            ) : (
                              <>
                                <svg className="w-6 h-6 text-muted mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="font-body text-[0.62rem] text-muted block tracking-wider uppercase mb-1">
                                  Drag image file here or
                                </span>
                                <input
                                  type="file"
                                  id="showcase-file-input"
                                  onChange={async (e) => {
                                    if (e.target.files?.length) {
                                      await handleShowcaseImageUpload(e.target.files[0]);
                                    }
                                  }}
                                  className="hidden"
                                  accept="image/*"
                                />
                                <label
                                  htmlFor="showcase-file-input"
                                  className="font-body text-[0.62rem] text-bronze cursor-pointer font-semibold underline hover:text-ink tracking-wider uppercase"
                                >
                                  Browse Files
                                </label>
                              </>
                            )}
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isUploadingShowcaseImage}
                          className="w-full bg-ink hover:bg-bronze disabled:bg-muted text-background font-body font-medium text-[0.62rem] tracking-[0.22em] uppercase py-3 border-0 cursor-pointer transition-colors duration-200 rounded-[2px]"
                        >
                          Submit Showcase Card
                        </button>
                      </form>
                    </div>

                    {/* Right Column: Existing Showcases Gallery */}
                    <div className="lg:col-span-7 bg-white border border-border p-6 rounded-md space-y-6">
                      <div className="pb-3 border-b border-border/60">
                        <h3 className="font-display font-light text-base text-ink m-0 uppercase tracking-widest">
                          Active Showcases ({showcases.length})
                        </h3>
                        <p className="font-body text-[0.68rem] text-muted m-0 mt-1">
                          Current community layouts displayed live.
                        </p>
                      </div>

                      {showcasesLoading ? (
                        <div className="text-center font-body text-xs text-muted py-12 animate-pulse flex flex-col items-center justify-center">
                          <div className="w-5 h-5 border border-bronze border-t-transparent rounded-full animate-spin mb-4" />
                          Loading active showcases...
                        </div>
                      ) : showcases.length === 0 ? (
                        <div className="text-center py-12 border border-dashed border-border/70 rounded-md">
                          <span className="font-body text-xs text-muted">No community showcase cards found. Add one on the left!</span>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-1">
                          {showcases.map((item) => (
                            <div
                              key={item._id}
                              className="border border-border/80 rounded-md overflow-hidden bg-background flex flex-col relative group"
                            >
                              {/* Delete button (Top Right overlay) */}
                              <button
                                type="button"
                                onClick={() => handleDeleteShowcase(item._id)}
                                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white border-0 cursor-pointer p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                                title="Remove showcase post"
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
                                </svg>
                              </button>

                              {/* Showcase Image */}
                              <div className="w-full aspect-[4/3] bg-surface overflow-hidden border-b border-border">
                                <img
                                  src={item.image}
                                  alt={`Styled room by ${item.handle}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              {/* Showcase Metadata */}
                              <div className="p-4 space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <span className="font-body font-semibold text-[0.7rem] text-bronze">
                                    {item.handle}
                                  </span>
                                  <span className="font-body text-[0.62rem] text-muted bg-surface border border-border px-2 py-0.5 rounded-sm">
                                    {item.space}
                                  </span>
                                </div>
                                <div className="font-body text-[0.68rem] text-ink flex items-center gap-1.5">
                                  <span className="text-muted">Featured:</span>
                                  <span className="font-medium">{item.productName} (ID: {item.productId})</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}
        </div>
      </main>

      {/* 3. PRODUCT CREATION / MODIFICATION MODAL OVERLAY */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <form
            onSubmit={handleProductSubmit}
            className="bg-white border border-border w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 md:p-10 shadow-2xl relative grid grid-cols-1 md:grid-cols-2 gap-8 text-ink rounded-[3px]"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => { setIsFormOpen(false); setEditingProductId(null); }}
              className="absolute top-5 right-5 text-ink/65 hover:text-bronze bg-transparent border-0 cursor-pointer p-1"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Left Column: Form Fields */}
            <div className="space-y-6">
              
              {/* Product Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block mb-1.5 font-medium">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Travertine Column Table"
                    className="w-full bg-[#FDFBF7] border border-border px-4 py-3 font-body text-xs text-ink outline-none focus:border-bronze rounded-[2px] transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block mb-1.5 font-medium">Inventory Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="e.g., 10"
                    className="w-full bg-[#FDFBF7] border border-border px-4 py-3 font-body text-xs text-ink outline-none focus:border-bronze rounded-[2px] transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block mb-1.5 font-medium">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-[#FDFBF7] border border-border px-3 py-3 font-body text-xs text-ink outline-none focus:border-bronze rounded-[2px] transition-all duration-300"
                  >
                    {categories.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block mb-1.5 font-medium">Atelier Type (Subcategory)</label>
                  <select
                    name="subcategory"
                    value={formData.subcategory || ""}
                    onChange={handleInputChange}
                    className="w-full bg-[#FDFBF7] border border-border px-3 py-3 font-body text-xs text-ink outline-none focus:border-bronze rounded-[2px] transition-all duration-300"
                  >
                    <option value="">-- Select Type --</option>
                    {subcategories
                      .filter((sub) => !formData.category || sub.category === formData.category)
                      .map((sub) => (
                        <option key={sub.slug} value={sub.slug}>
                          {sub.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Pricing & Discounts Section */}
              <div className="bg-[#FDFBF7] p-5 border border-border/80 rounded-[2px] space-y-4">
                <h3 className="font-body text-[0.62rem] uppercase tracking-wider text-bronze m-0 font-medium">Pricing & Valuation</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block mb-1.5">Retail Price (₹)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="e.g., 12500"
                      className="w-full bg-white border border-border px-4 py-2.5 font-body text-xs text-ink outline-none focus:border-bronze rounded-[2px]"
                    />
                  </div>
                  <div>
                    <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block mb-1.5">Original (Compare-At) Price (₹)</label>
                    <input
                      type="number"
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={handleInputChange}
                      placeholder="e.g., 15000"
                      className="w-full bg-white border border-border px-4 py-2.5 font-body text-xs text-ink outline-none focus:border-bronze rounded-[2px]"
                    />
                  </div>
                </div>

                {/* Calculate savings percentage */}
                {formData.price && formData.originalPrice && Number(formData.originalPrice) > Number(formData.price) && (
                  <div className="text-[0.68rem] font-body text-emerald-800 bg-emerald-50 border border-emerald-250/20 px-3 py-2.5 rounded-sm flex items-center gap-1.5 font-medium leading-none">
                    <span>✓ Custom discount applied successfully:</span>
                    <strong className="underline decoration-wavy">Save {Math.round(((Number(formData.originalPrice) - Number(formData.price)) / Number(formData.originalPrice)) * 100)}%</strong>
                  </div>
                )}
              </div>

              {/* Specifications Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block mb-1.5">Dimensions (Specifications)</label>
                  <input
                    type="text"
                    name="dimSpec"
                    value={formData.dimSpec}
                    onChange={handleInputChange}
                    placeholder="e.g., H 45cm x Diameter 90cm"
                    className="w-full bg-[#FDFBF7] border border-border px-4 py-2.5 font-body text-xs text-ink outline-none focus:border-bronze rounded-[2px]"
                  />
                </div>
                <div>
                  <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block mb-1.5">Material (Specifications)</label>
                  <input
                    type="text"
                    name="matSpec"
                    value={formData.matSpec}
                    onChange={handleInputChange}
                    placeholder="e.g., Solid Travertine Stone"
                    className="w-full bg-[#FDFBF7] border border-border px-4 py-2.5 font-body text-xs text-ink outline-none focus:border-bronze rounded-[2px]"
                  />
                </div>
              </div>

              {/* Dynamic Drag-and-Drop Image Section */}
              <div className="space-y-3">
                <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block font-medium">Images Asset Manager</label>
                
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-[3px] p-6 text-center transition-all duration-200 cursor-pointer ${
                    isDragging ? "border-bronze bg-bronze/5" : "border-border hover:border-bronze/60 bg-[#FDFBF7]"
                  }`}
                >
                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer space-y-2 block">
                    <svg className="w-7 h-7 text-muted/60 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-body text-xs text-ink block font-medium">
                      Drag & Drop Images Here
                    </span>
                    <span className="font-body text-[0.65rem] text-muted block font-light">
                      or click to browse local files (JPEG, PNG, WEBP)
                    </span>
                  </label>
                </div>

                {isUploadingImage && (
                  <div className="flex items-center gap-2 text-[0.68rem] text-bronze font-body animate-pulse font-medium">
                    <div className="w-3.5 h-3.5 border-2 border-bronze border-t-transparent rounded-full animate-spin" />
                    Uploading asset to catalog folder...
                  </div>
                )}

                {/* Uploaded image previews */}
                {formData.images.filter(Boolean).length > 0 && (
                  <div className="grid grid-cols-4 gap-3 pt-1">
                    {formData.images.filter(Boolean).map((img, idx) => (
                      <div key={idx} className="relative group aspect-square border border-border bg-surface overflow-hidden rounded-sm">
                        <img src={img} alt="Product view" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeUploadedImage(idx)}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white border-0 cursor-pointer transition-opacity duration-200 text-[0.55rem] font-body tracking-wider uppercase font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: HTML Editors & Descriptions */}
            <div className="flex flex-col justify-between space-y-6">
              
              {/* Description HTML Editor */}
              <div className="space-y-2 flex-grow">
                <div className="flex justify-between items-center pb-1">
                  <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted font-medium">Product Description</label>
                  <div className="flex border border-border rounded-sm overflow-hidden text-[0.68rem] font-body">
                    <button
                      type="button"
                      onClick={() => setDescTab("write")}
                      className={`px-3 py-1 border-0 cursor-pointer font-medium ${descTab === "write" ? "bg-ink text-background" : "bg-surface text-ink"}`}
                    >
                      Editor
                    </button>
                    <button
                      type="button"
                      onClick={() => setDescTab("preview")}
                      className={`px-3 py-1 border-0 cursor-pointer font-medium ${descTab === "preview" ? "bg-ink text-background" : "bg-surface text-ink"}`}
                    >
                      HTML Preview
                    </button>
                  </div>
                </div>

                {descTab === "write" ? (
                  <div className="border border-border rounded-[2px] overflow-hidden bg-[#FDFBF7] focus-within:border-bronze transition-colors">
                    {/* HTML Edit Toolbar */}
                    <div className="flex gap-1.5 p-2 border-b border-border bg-white text-[0.62rem] font-body text-ink">
                      <button type="button" onClick={() => insertHTMLTag("description", "b")} className="px-2 py-1 bg-surface border border-border/80 hover:bg-[#FDFBF7] cursor-pointer rounded-[2px] font-bold">B</button>
                      <button type="button" onClick={() => insertHTMLTag("description", "i")} className="px-2 py-1 bg-surface border border-border/80 hover:bg-[#FDFBF7] cursor-pointer rounded-[2px] italic">I</button>
                      <button type="button" onClick={() => insertHTMLTag("description", "p")} className="px-2 py-1 bg-surface border border-border/80 hover:bg-[#FDFBF7] cursor-pointer rounded-[2px]">Paragraph</button>
                      <button type="button" onClick={() => insertHTMLTag("description", "ul")} className="px-2 py-1 bg-surface border border-border/80 hover:bg-[#FDFBF7] cursor-pointer rounded-[2px]">List</button>
                    </div>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="6"
                      placeholder="Describe the architectural finish, materials, and form..."
                      className="w-full bg-white border-0 px-4 py-3 font-body text-xs text-ink outline-none resize-none focus:ring-0 placeholder:text-muted/30"
                    />
                  </div>
                ) : (
                  <div
                    className="w-full bg-[#FDFBF7] border border-border px-4 py-4 font-body text-xs text-ink min-h-[100px] max-h-[180px] overflow-y-auto leading-relaxed rounded-[2px]"
                    dangerouslySetInnerHTML={{ __html: formData.description || '<p class="text-muted/40 italic text-center py-6">Nothing to preview yet. Use the Editor tab to enter content.</p>' }}
                  />
                )}
              </div>

              {/* Care Instructions HTML Editor */}
              <div className="space-y-2 flex-grow">
                <div className="flex justify-between items-center pb-1">
                  <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted font-medium">Care & Maintenance Instructions</label>
                  <div className="flex border border-border rounded-sm overflow-hidden text-[0.68rem] font-body">
                    <button
                      type="button"
                      onClick={() => setCareTab("write")}
                      className={`px-3 py-1 border-0 cursor-pointer font-medium ${careTab === "write" ? "bg-ink text-background" : "bg-surface text-ink"}`}
                    >
                      Editor
                    </button>
                    <button
                      type="button"
                      onClick={() => setCareTab("preview")}
                      className={`px-3 py-1 border-0 cursor-pointer font-medium ${careTab === "preview" ? "bg-ink text-background" : "bg-surface text-ink"}`}
                    >
                      HTML Preview
                    </button>
                  </div>
                </div>

                {careTab === "write" ? (
                  <div className="border border-border rounded-[2px] overflow-hidden bg-[#FDFBF7] focus-within:border-bronze transition-colors">
                    {/* HTML Edit Toolbar */}
                    <div className="flex gap-1.5 p-2 border-b border-border bg-white text-[0.62rem] font-body text-ink">
                      <button type="button" onClick={() => insertHTMLTag("careInstructions", "b")} className="px-2 py-1 bg-surface border border-border/80 hover:bg-[#FDFBF7] cursor-pointer rounded-[2px] font-bold">B</button>
                      <button type="button" onClick={() => insertHTMLTag("careInstructions", "i")} className="px-2 py-1 bg-surface border border-border/80 hover:bg-[#FDFBF7] cursor-pointer rounded-[2px] italic">I</button>
                      <button type="button" onClick={() => insertHTMLTag("careInstructions", "p")} className="px-2 py-1 bg-surface border border-border/80 hover:bg-[#FDFBF7] cursor-pointer rounded-[2px]">Paragraph</button>
                      <button type="button" onClick={() => insertHTMLTag("careInstructions", "ul")} className="px-2 py-1 bg-surface border border-border/80 hover:bg-[#FDFBF7] cursor-pointer rounded-[2px]">List</button>
                    </div>
                    <textarea
                      id="careInstructions"
                      name="careInstructions"
                      value={formData.careInstructions}
                      onChange={handleInputChange}
                      rows="4"
                      placeholder="Clean with soft dry cloth, avoid harsh chemical detergents..."
                      className="w-full bg-white border-0 px-4 py-3 font-body text-xs text-ink outline-none resize-none focus:ring-0 placeholder:text-muted/30"
                    />
                  </div>
                ) : (
                  <div
                    className="w-full bg-[#FDFBF7] border border-border px-4 py-4 font-body text-xs text-ink min-h-[100px] max-h-[180px] overflow-y-auto leading-relaxed rounded-[2px]"
                    dangerouslySetInnerHTML={{ __html: formData.careInstructions || '<p class="text-muted/40 italic text-center py-6">Nothing to preview yet. Use the Editor tab to enter content.</p>' }}
                  />
                )}
              </div>

              {/* Checkboxes: Spaces */}
              <div>
                <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block mb-2 font-medium">Curated Spaces</label>
                <div className="grid grid-cols-2 gap-y-2">
                  {["living-room", "bedroom", "dining-room", "study-room", "outdoor"].map((space) => (
                    <label key={space} className="flex items-center gap-2 font-body text-xs text-ink select-none cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.spaces.includes(space)}
                        onChange={() => handleCheckboxChange("spaces", space)}
                        className="accent-bronze"
                      />
                      <span className="capitalize">{space.replace("-", " ")}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Checkboxes: Collections */}
              <div>
                <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block mb-2 font-medium">Curated Collections</label>
                <div className="grid grid-cols-2 gap-y-2">
                  {collections.length === 0 ? (
                    [
                      "modern-minimalist",
                      "luxury-living",
                      "scandinavian",
                      "boho-chic",
                      "new-arrivals",
                      "best-sellers"
                    ].map((coll) => (
                      <label key={coll} className="flex items-center gap-2 font-body text-xs text-ink select-none cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.collections.includes(coll)}
                          onChange={() => handleCheckboxChange("collections", coll)}
                          className="accent-bronze"
                        />
                        <span className="capitalize">{coll.replace("-", " ")}</span>
                      </label>
                    ))
                  ) : (
                    collections.map((coll) => (
                      <label key={coll.slug} className="flex items-center gap-2 font-body text-xs text-ink select-none cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.collections.includes(coll.slug)}
                          onChange={() => handleCheckboxChange("collections", coll.slug)}
                          className="accent-bronze"
                        />
                        <span>{coll.name}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              {/* Alert Feedback Messages */}
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-4 text-xs font-body rounded-sm">
                  {formError}
                </div>
              )}
              {formSuccess && (
                <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 p-4 text-xs font-body rounded-sm font-medium">
                  {formSuccess}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 bg-ink hover:bg-bronze text-background font-body font-medium text-xs tracking-[0.25em] uppercase border-0 cursor-pointer transition-all duration-300 disabled:opacity-55 disabled:cursor-not-allowed rounded-[3px] shadow-sm flex items-center justify-center gap-3"
              >
                {isSubmitting && (
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                <span>
                  {isSubmitting
                    ? "Registering catalog records..."
                    : editingProductId
                    ? "Apply Catalog Modifications"
                    : "Publish Piece to Atelier"}
                </span>
              </button>

            </div>
          </form>
        </div>
      )}

      {/* 4. ORDER DETAILS MODAL OVERLAY */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn print:bg-white print:p-0">
          <div className="bg-white border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 md:p-10 shadow-2xl relative flex flex-col gap-6 rounded-[3px] text-ink print:border-0 print:shadow-none print:max-h-full print:overflow-visible">
            
            {/* Close Button (Hidden on Print) */}
            <button
              type="button"
              onClick={() => setSelectedOrder(null)}
              className="absolute top-5 right-5 text-ink/65 hover:text-bronze bg-transparent border-0 cursor-pointer p-1 transition-colors duration-200 print:hidden"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Invoice Corporate Header */}
            <div className="text-center pb-4 border-b border-border/80 relative">
              <span className="font-display font-light text-2xl tracking-[0.25em] text-ink uppercase block">
                N O V E L L A
              </span>
              <span className="font-body text-[0.55rem] tracking-[0.3em] text-bronze uppercase block mt-1">
                Atelier Official Invoice
              </span>
              <div className="mt-4 flex justify-between items-center text-[0.7rem] font-body text-muted/80">
                <span><strong>Invoice ID:</strong> {selectedOrder.id}</span>
                <span><strong>Date:</strong> {new Date(selectedOrder.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
              </div>
            </div>

            {/* Customer & Shipping Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-body py-2 border-b border-border/50">
              <div>
                <span className="text-muted block uppercase text-[0.55rem] tracking-wider mb-1.5 font-medium">Customer Profile</span>
                <span className="font-medium text-ink block">{selectedOrder.customer}</span>
                <span className="text-muted/80 block mt-0.5">{selectedOrder.email}</span>
                <span className="text-muted/80 block">Phone: {selectedOrder.phone}</span>
              </div>
              
              <div>
                <span className="text-muted block uppercase text-[0.55rem] tracking-wider mb-1.5 font-medium">Delivery Destination</span>
                <span className="font-medium text-ink block">Method: {selectedOrder.method}</span>
                <span className="text-muted/80 block whitespace-pre-line leading-relaxed mt-0.5">
                  {(() => {
                    const addr = selectedOrder.address;
                    if (!addr) return "Not specified";
                    if (typeof addr === "string") return addr;
                    return [
                      addr.street,
                      addr.apartment,
                      `${addr.city || ""}, ${addr.state || ""} ${addr.zipCode || ""}`.trim()
                    ].filter(Boolean).join("\n");
                  })()}
                </span>
              </div>

              <div>
                <span className="text-muted block uppercase text-[0.55rem] tracking-wider mb-1.5 font-medium">Payment Gateway</span>
                <span className="font-medium text-ink block capitalize">
                  {selectedOrder.paymentDetails?.paymentMethod || selectedOrder.paymentDetails?.method || "Razorpay"}
                  {selectedOrder.paymentDetails?.paymentStatus && ` (${selectedOrder.paymentDetails.paymentStatus})`}
                </span>
                {(selectedOrder.paymentDetails?.transactionToken || selectedOrder.paymentDetails?.razorpayPaymentId) && (
                  <span className="text-muted/80 block mt-1 font-mono text-[0.65rem]">
                    Token ID: {selectedOrder.paymentDetails.transactionToken || selectedOrder.paymentDetails.razorpayPaymentId}
                  </span>
                )}
              </div>
            </div>

            {/* Purchased Items List */}
            <div className="space-y-3">
              <span className="font-body font-semibold text-[0.62rem] tracking-wider uppercase text-muted block">Purchased Ledger</span>
              <div className="border border-border/70 rounded-[2px] overflow-hidden">
                <div className="bg-[#FDFBF7] px-4 py-2 border-b border-border/70 grid grid-cols-4 text-[0.62rem] uppercase tracking-wider text-muted font-medium">
                  <div className="col-span-2">Item description</div>
                  <div className="text-center">Quantity</div>
                  <div className="text-right">Price Total</div>
                </div>
                <div className="divide-y divide-border/40 font-body text-xs px-4">
                  {selectedOrder.products.map((item, idx) => (
                    <div key={idx} className="py-3 grid grid-cols-4 items-center">
                      <div className="col-span-2">
                        <span className="font-medium text-ink block">{item.name}</span>
                        <div className="flex gap-2 text-[0.65rem] text-muted/80 font-light mt-0.5">
                          {item.color && <span>Color: {item.color}</span>}
                          {item.size && <span>Size: {item.size}</span>}
                        </div>
                      </div>
                      <div className="text-center font-mono text-muted">{item.quantity}</div>
                      <div className="text-right font-medium text-ink">₹{(item.price * item.quantity).toLocaleString("en-IN")}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Price Calculations breakdown */}
            <div className="bg-[#FDFBF7] p-5 border border-border/80 rounded-[2px] font-body text-xs space-y-2.5 ml-auto w-full sm:w-80">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span>
                <span>₹{selectedOrder.pricingBreakdown.subtotal.toLocaleString("en-IN")}</span>
              </div>
              {selectedOrder.pricingBreakdown.discount > 0 && (
                <div className="flex justify-between text-emerald-800 font-medium">
                  <span>Promo Code Deduction</span>
                  <span>-₹{selectedOrder.pricingBreakdown.discount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between text-muted">
                <span>Complimentary Delivery</span>
                <span>{selectedOrder.pricingBreakdown.shipping > 0 ? `₹${selectedOrder.pricingBreakdown.shipping}` : "₹0 (Free)"}</span>
              </div>
              <div className="flex justify-between text-muted/65 text-[0.68rem] font-light">
                <span>Estimated Tax ({cmsCheckout.taxRate}% GST inc.)</span>
                <span>₹{Math.round((selectedOrder.pricingBreakdown.subtotal - selectedOrder.pricingBreakdown.discount) * (cmsCheckout.taxRate / 100)).toLocaleString("en-IN")}</span>
              </div>
              <div className="border-t border-border/80 pt-3.5 flex justify-between items-end">
                <span className="font-display font-medium text-sm text-ink m-0">Settled Amount</span>
                <span className="font-display font-semibold text-base text-ink leading-none">
                  ₹{selectedOrder.pricingBreakdown.total.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Print trigger CTA */}
            <div className="flex justify-end gap-3 mt-2 border-t border-border/40 pt-4 print:hidden">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2.5 border border-border bg-white text-ink font-body text-[0.62rem] tracking-wider uppercase hover:bg-[#FDFBF7] hover:border-bronze cursor-pointer transition-colors duration-250 rounded-[2px]"
              >
                Print Invoice
              </button>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 bg-ink hover:bg-bronze text-background font-body text-[0.62rem] tracking-wider uppercase border-0 cursor-pointer transition-colors duration-250 rounded-[2px]"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPage;
