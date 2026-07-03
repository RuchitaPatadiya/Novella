import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../context/ProductContext";
import BrandStrip from "../../components/home/BrandStrip";
import API from "../../services/api";


const AdminPage = () => {
  const { user, loading } = useAuth();
  const { products, addProduct } = useProducts();
  const navigate = useNavigate();

  // Tab State: "orders" or "catalog"
  const [activeTab, setActiveTab] = useState("orders");

  // Orders table states
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");

  // Add Product Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "furniture",
    price: "",
    originalPrice: "",
    imageInput: "", // comma separated list
    description: "",
    dimSpec: "", // Dimensions spec
    matSpec: "", // Material spec
    careInstructions: "",
    spaces: [], // array of selected spaces
    collections: [], // array of selected collections
  });

  const [formSuccess, setFormSuccess] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Route protection and dynamic order loading
  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login");
      } else if (!user.isAdmin) {
        navigate("/profile");
      } else {
        // Logged in as Admin! Fetch orders from DB
        const fetchOrders = async () => {
          try {
            const res = await API.get("/orders/admin");
            // Map database schema values to table UI columns
            const mappedDb = res.data.map(order => ({
              id: order.orderId,
              customer: order.shippingDetails?.name || (order.user?.name || "Customer"),
              email: order.user?.email || "customer@example.com",
              date: order.date,
              total: order.total,
              status: order.status,
              items: order.items
            }));
            setOrders(mappedDb);
          } catch (err) {
            console.error("Failed to load store orders:", err);
            setOrders([]); // fallback
          }
        };
        fetchOrders();
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="bg-background min-h-screen pt-32 flex items-center justify-center font-body text-[0.62rem] text-muted tracking-[0.2em] uppercase animate-pulse">
        Verifying Atelier Authorization...
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    return null;
  }

  // Handle order status changes locally and write back to database
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status: newStatus });

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Failed to update order status on database server:", err);
    }
  };

  const filteredOrders = filterStatus === "All"
    ? orders
    : orders.filter((o) => o.status === filterStatus);

  // Calculate dynamic stats
  const totalSales = orders.reduce((acc, order) => {
    const numericVal = parseInt(order.total.replace(/[^0-9]/g, ""), 10) || 0;
    return acc + numericVal;
  }, 0);

  const totalOrders = orders.length;
  const catalogCount = products.length;

  // Handle product form input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle checkboxes for spaces / collections
  const handleCheckboxChange = (field, itemValue) => {
    setFormData((prev) => {
      const currentList = prev[field];
      const updatedList = currentList.includes(itemValue)
        ? currentList.filter((item) => item !== itemValue)
        : [...currentList, itemValue];
      return { ...prev, [field]: updatedList };
    });
  };

  // Handle product submit
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setIsSubmitting(true);

    // Validate inputs
    if (!formData.name || !formData.price || !formData.description) {
      setFormError("Product Name, Price, and Description are required fields.");
      setIsSubmitting(false);
      return;
    }

    // Prepare images array
    const imageList = formData.imageInput
      ? formData.imageInput.split(",").map((url) => url.trim())
      : ["https://images.unsplash.com/photo-1592078615290-033ee584e267?w=1000&q=80"]; // fallback image

    // Prepare specifications map
    const specsMap = {};
    if (formData.dimSpec) specsMap["Dimensions"] = formData.dimSpec;
    if (formData.matSpec) specsMap["Material"] = formData.matSpec;

    const newProduct = {
      name: formData.name,
      category: formData.category,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
      images: imageList,
      description: formData.description,
      specifications: specsMap,
      careInstructions: formData.careInstructions,
      spaces: formData.spaces,
      collections: formData.collections,
    };

    try {
      await addProduct(newProduct);
      setFormSuccess("Artistic product added successfully to the live database catalog!");
      // Reset form
      setFormData({
        name: "",
        category: "furniture",
        price: "",
        originalPrice: "",
        imageInput: "",
        description: "",
        dimSpec: "",
        matSpec: "",
        careInstructions: "",
        spaces: [],
        collections: [],
      });
      // Close form modal after 1.5 seconds
      setTimeout(() => {
        setIsFormOpen(false);
        setFormSuccess("");
      }, 1500);
    } catch (err) {
      setFormError(err.message || "Failed to create product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background min-h-screen pt-[76px]">
      
      {/* Breadcrumbs Row */}
      <div className="px-[clamp(1.5rem,5vw,4rem)] py-5 border-b border-border bg-background">
        <div className="flex items-center gap-2 font-body text-[0.68rem] tracking-[0.18em] uppercase text-muted">
          <Link to="/" className="hover:text-bronze transition-colors duration-200 no-underline text-current">
            Home
          </Link>
          <span>/</span>
          <span className="text-ink font-normal">Admin Registry</span>
        </div>
      </div>

      <div className="px-[clamp(1.5rem,5vw,4rem)] py-12 md:py-16 bg-background">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border pb-6 mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="block w-5 h-px bg-bronze" />
              <span className="font-body font-normal text-[0.55rem] tracking-[0.38em] uppercase text-bronze">
                Atelier Control Panel
              </span>
            </div>
            <h1 className="font-display font-light text-[clamp(2.2rem,4vw,3.2rem)] text-ink m-0 leading-none">
              Store <em className="text-bronze italic font-medium">Overview</em>
            </h1>
          </div>

          {/* Tab buttons */}
          <div className="flex border border-border bg-surface p-1 rounded-[3px]">
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-5 py-2 font-body text-[0.68rem] tracking-wider uppercase border-0 cursor-pointer transition-all duration-300 rounded-[2px] ${
                activeTab === "orders"
                  ? "bg-ink text-background font-medium"
                  : "bg-transparent text-muted hover:text-ink"
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab("catalog")}
              className={`px-5 py-2 font-body text-[0.68rem] tracking-wider uppercase border-0 cursor-pointer transition-all duration-300 rounded-[2px] ${
                activeTab === "catalog"
                  ? "bg-ink text-background font-medium"
                  : "bg-transparent text-muted hover:text-ink"
              }`}
            >
              Catalog ({catalogCount})
            </button>
          </div>
        </div>

        {/* Stats Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-surface border border-border p-6 rounded-[2px] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gold" />
            <span className="font-body font-normal text-[0.58rem] tracking-[0.18em] uppercase text-muted block mb-1">
              Total Revenue
            </span>
            <span className="font-display font-semibold text-2xl md:text-3xl text-ink">
              ₹{totalSales.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="bg-surface border border-border p-6 rounded-[2px] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-bronze" />
            <span className="font-body font-normal text-[0.58rem] tracking-[0.18em] uppercase text-muted block mb-1">
              Orders Processed
            </span>
            <span className="font-display font-semibold text-2xl md:text-3xl text-ink">
              {totalOrders}
            </span>
          </div>

          <div className="bg-surface border border-border p-6 rounded-[2px] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-ink" />
            <span className="font-body font-normal text-[0.58rem] tracking-[0.18em] uppercase text-muted block mb-1">
              Catalog Items
            </span>
            <span className="font-display font-semibold text-2xl md:text-3xl text-ink">
              {catalogCount}
            </span>
          </div>
        </div>

        {/* TAB CONTENT: ORDERS */}
        {activeTab === "orders" && (
          <div className="bg-surface/40 border border-border p-6 sm:p-8 rounded-[3px] animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-border/50">
              <h3 className="font-display font-light text-2xl text-ink m-0">
                Customer Purchase Registry
              </h3>
              
              <div className="flex items-center gap-3">
                <span className="font-body text-xs text-muted font-light">Filter:</span>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-background border border-border px-3.5 py-1.5 font-body text-xs text-ink outline-none focus:border-bronze rounded-[2px]"
                >
                  <option value="All">All Statuses</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>

            {/* Registry Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left font-body text-xs text-ink">
                <thead>
                  <tr className="border-b border-border text-[0.65rem] tracking-[0.15em] uppercase text-muted font-normal">
                    <th className="pb-4 font-normal">Order ID</th>
                    <th className="pb-4 font-normal">Customer</th>
                    <th className="pb-4 font-normal">Date</th>
                    <th className="pb-4 font-normal">Items</th>
                    <th className="pb-4 font-normal">Amount</th>
                    <th className="pb-4 font-normal">Status</th>
                    <th className="pb-4 font-normal text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-muted italic">
                        No orders found.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-surface/30 transition-colors duration-150">
                        <td className="py-4.5 font-medium text-bronze">{order.id}</td>
                        <td className="py-4.5">
                          <span className="font-medium block">{order.customer}</span>
                          <span className="text-[0.68rem] text-muted block mt-0.5">{order.email}</span>
                        </td>
                        <td className="py-4.5 text-muted font-light">{order.date}</td>
                        <td className="py-4.5 font-light max-w-xs truncate">{order.items}</td>
                        <td className="py-4.5 font-medium">{order.total}</td>
                        <td className="py-4.5">
                          <span className={`font-normal text-[0.62rem] tracking-[0.1em] uppercase border px-2 py-0.5 ${
                            order.status === "Delivered"
                              ? "text-emerald-700 bg-emerald-50/50 border-emerald-200"
                              : order.status === "Shipped"
                              ? "text-blue-700 bg-blue-50/50 border-blue-200"
                              : "text-bronze bg-bronze/5 border-bronze/10"
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4.5 text-right">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="bg-background border border-border px-2 py-1 font-body text-[0.7rem] text-ink outline-none focus:border-bronze rounded-[2px]"
                          >
                            <option value="Processing">Set Processing</option>
                            <option value="Shipped">Set Shipped</option>
                            <option value="Delivered">Set Delivered</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB CONTENT: PRODUCT CATALOG */}
        {activeTab === "catalog" && (
          <div className="bg-surface/40 border border-border p-6 sm:p-8 rounded-[3px] animate-fadeIn">
            <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-border/50">
              <h3 className="font-display font-light text-2xl text-ink m-0">
                Atelier Catalog
              </h3>
              
              <button
                onClick={() => setIsFormOpen(true)}
                className="bg-ink hover:bg-bronze text-background font-body font-medium text-[0.62rem] tracking-[0.2em] uppercase px-5 py-3 border-0 transition-colors duration-300 cursor-pointer rounded-[2px]"
              >
                + Add Product
              </button>
            </div>

            {/* Inventory table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left font-body text-xs text-ink">
                <thead>
                  <tr className="border-b border-border text-[0.65rem] tracking-[0.15em] uppercase text-muted font-normal">
                    <th className="pb-4 font-normal">Product</th>
                    <th className="pb-4 font-normal">Category</th>
                    <th className="pb-4 font-normal">Price</th>
                    <th className="pb-4 font-normal">Curated Spaces</th>
                    <th className="pb-4 font-normal">Curated Collections</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-surface/30 transition-colors duration-150">
                      <td className="py-4 flex items-center gap-3.5">
                        <img
                          src={p.images?.[0] || p.image}
                          alt={p.name}
                          className="w-10 h-12 object-cover border border-border/60 bg-surface shrink-0"
                        />
                        <div>
                          <span className="font-medium text-ink block">{p.name}</span>
                          <span className="text-[0.68rem] text-muted block mt-0.5">ID: {p.id}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="text-[0.68rem] tracking-[0.08em] uppercase text-muted font-light">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-4 font-medium">₹{p.price.toLocaleString("en-IN")}</td>
                      <td className="py-4">
                        <div className="flex flex-wrap gap-1.5 max-w-[180px]">
                          {p.spaces && p.spaces.length > 0 ? (
                            p.spaces.map((space) => (
                              <span key={space} className="bg-bronze/5 border border-bronze/10 text-bronze text-[0.55rem] px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
                                {space.replace("-", " ")}
                              </span>
                            ))
                          ) : (
                            <span className="text-muted italic text-[0.68rem] font-light">None</span>
                          )}
                        </div>
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
                            <span className="text-muted italic text-[0.68rem] font-light">None</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* ADD PRODUCT MODAL OVERLAY */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-dark/65 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <form
            onSubmit={handleProductSubmit}
            className="bg-background border border-border w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 md:p-10 shadow-2xl relative flex flex-col gap-6 rounded-[3px]"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="absolute top-5 right-5 text-ink/65 hover:text-bronze bg-transparent border-0 cursor-pointer p-1 transition-colors duration-200"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Header */}
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="block w-5 h-px bg-bronze" />
                <span className="font-body font-normal text-[0.55rem] tracking-[0.38em] uppercase text-bronze">
                  Atelier Registry
                </span>
              </div>
              <h2 className="font-display font-light text-2xl text-ink m-0">
                Add New Product
              </h2>
            </div>

            {/* Status alerts */}
            {formSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 text-xs font-body tracking-[0.02em] rounded-sm">
                {formSuccess}
              </div>
            )}
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-4 text-xs font-body tracking-[0.02em] rounded-sm">
                {formError}
              </div>
            )}

            {/* Basic Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block mb-1.5">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Travertine Column Table"
                  className="w-full bg-background border border-border px-4 py-3 font-body text-xs text-ink outline-none focus:border-bronze rounded-[2px]"
                />
              </div>

              <div>
                <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block mb-1.5">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full bg-background border border-border px-3 py-3 font-body text-xs text-ink outline-none focus:border-bronze rounded-[2px]"
                >
                  <option value="furniture">Furniture</option>
                  <option value="lighting">Lighting</option>
                  <option value="wall-decor">Wall Decor</option>
                  <option value="textiles">Textiles</option>
                  <option value="decor-accessories">Decor Accessories</option>
                </select>
              </div>

              <div>
                <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block mb-1.5">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="e.g., 28000"
                  className="w-full bg-background border border-border px-4 py-3 font-body text-xs text-ink outline-none focus:border-bronze rounded-[2px]"
                />
              </div>

              <div className="col-span-2">
                <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block mb-1.5">Image URLs (comma separated)</label>
                <input
                  type="text"
                  name="imageInput"
                  value={formData.imageInput}
                  onChange={handleInputChange}
                  placeholder="https://images.unsplash.com/photo-..., https://images.unsplash.com/..."
                  className="w-full bg-background border border-border px-4 py-3 font-body text-xs text-ink outline-none focus:border-bronze rounded-[2px]"
                />
              </div>

              <div className="col-span-2">
                <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block mb-1.5">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Provide an artistic description of the materials, architectural shape, and design inspiration..."
                  className="w-full bg-background border border-border px-4 py-3 font-body text-xs text-ink outline-none focus:border-bronze rounded-[2px] resize-none"
                />
              </div>

              <div>
                <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block mb-1.5">Dimensions Spec</label>
                <input
                  type="text"
                  name="dimSpec"
                  value={formData.dimSpec}
                  onChange={handleInputChange}
                  placeholder='e.g., W: 32" | D: 32" | H: 18"'
                  className="w-full bg-background border border-border px-4 py-3 font-body text-xs text-ink outline-none focus:border-bronze rounded-[2px]"
                />
              </div>

              <div>
                <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block mb-1.5">Materials Spec</label>
                <input
                  type="text"
                  name="matSpec"
                  value={formData.matSpec}
                  onChange={handleInputChange}
                  placeholder="e.g., Solid Honed Travertine"
                  className="w-full bg-background border border-border px-4 py-3 font-body text-xs text-ink outline-none focus:border-bronze rounded-[2px]"
                />
              </div>

              <div className="col-span-2">
                <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block mb-1.5">Care Instructions</label>
                <textarea
                  name="careInstructions"
                  value={formData.careInstructions}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="Wipe with soft clean cloth. Do not use..."
                  className="w-full bg-background border border-border px-4 py-3 font-body text-xs text-ink outline-none focus:border-bronze rounded-[2px] resize-none"
                />
              </div>
            </div>

            {/* Checkboxes: Spaces */}
            <div>
              <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block mb-2">Curated Spaces</label>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {["living-room", "bedroom", "dining-room", "home-office", "outdoor"].map((space) => (
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
              <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block mb-2">Curated Collections</label>
              <div className="grid grid-cols-2 gap-y-2">
                {[
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
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 h-12 bg-ink hover:bg-bronze text-background font-body font-medium text-[0.62rem] tracking-[0.2em] uppercase border-0 cursor-pointer transition-colors duration-300 disabled:opacity-55 rounded-[2px]"
            >
              {isSubmitting ? "Uploading to Atelier..." : "Publish Product"}
            </button>

          </form>
        </div>
      )}

      <BrandStrip />
    </div>
  );
};

export default AdminPage;
