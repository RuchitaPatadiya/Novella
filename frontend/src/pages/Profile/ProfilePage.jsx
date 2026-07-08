import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../services/api";

const ProfilePage = () => {
  const { user, logout, updateProfile, error: authError } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    street: user?.address?.street || "",
    apartment: user?.address?.apartment || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    zipCode: user?.address?.zipCode || "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Sync form details when user session changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        street: user.address?.street || "",
        apartment: user.address?.apartment || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        zipCode: user.address?.zipCode || "",
      });
    }
  }, [user]);

  // Get Initials for Avatar
  const getInitials = (name) => {
    if (!name) return "N";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccessMsg("");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      await updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: {
          street: formData.street,
          apartment: formData.apartment,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        }
      });
      setSuccessMsg("Profile updated successfully.");
      setIsEditing(false);
      
      // Clear success message after 4 seconds
      setTimeout(() => {
        setSuccessMsg("");
      }, 4000);
    } catch (err) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Dynamic user orders state
  const [dbOrders, setDbOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const fetchMyOrders = async () => {
    try {
      setOrdersLoading(true);
      const res = await API.get("/orders/myorders");
      const mapped = res.data.map(order => ({
        ...order,
        id: order.orderId,
      }));
      setDbOrders(mapped);
    } catch (err) {
      console.error("Failed to load user orders from database:", err);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyOrders();
    }
  }, [user]);

  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order? This action cannot be undone.")) {
      try {
        await API.put(`/orders/${orderId}/cancel`);
        alert("Your order has been successfully cancelled. Refund details have been sent to your email.");
        setSelectedOrder(null);
        fetchMyOrders();
      } catch (err) {
        alert(err.response?.data?.message || "Failed to cancel order.");
      }
    }
  };

  const handleReturnOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to return this order? We will send a pre-paid shipping label guidelines to your email.")) {
      try {
        await API.put(`/orders/${orderId}/return`);
        alert("Return request successfully submitted. Check your inbox for label instructions.");
        setSelectedOrder(null);
        fetchMyOrders();
      } catch (err) {
        alert(err.response?.data?.message || "Failed to submit return request.");
      }
    }
  };

  const activeOrders = dbOrders;

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6 md:px-14">
      <div className="max-w-6xl mx-auto">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border pb-8 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="block w-5 h-px bg-bronze" />
              <span className="font-body font-normal text-[0.55rem] tracking-[0.38em] uppercase text-bronze">
                Atelier Account
              </span>
            </div>
            <h1 className="font-display font-light text-4xl md:text-5xl text-ink leading-tight">
              Welcome, {user.name.split(" ")[0]}
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 md:mt-0 font-body font-medium text-[0.62rem] tracking-[0.2em] uppercase border border-border hover:border-bronze px-6 py-2.5 text-ink hover:text-bronze bg-transparent transition-all duration-300 cursor-pointer self-start"
          >
            Sign Out
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Column Left: Summary Card */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-surface border border-border p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-bronze/40" />
              
              {/* Profile Avatar */}
              <div className="w-20 h-20 rounded-full bg-ink text-cream-muted font-display font-light text-2xl flex items-center justify-center mx-auto mb-5 border border-gold/20 shadow-inner select-none">
                {getInitials(user.name)}
              </div>
              
              <h3 className="font-display font-light text-xl text-ink leading-snug">{user.name}</h3>
              <p className="font-body font-light text-xs text-muted mt-1">{user.email}</p>
              
              <div className="my-6 border-t border-border/60" />
              
              <div className="text-left space-y-3.5">
                <div className="flex justify-between items-center text-[0.78rem] font-body">
                  <span className="text-muted font-light">Status:</span>
                  <span className="text-bronze font-normal tracking-[0.05em] uppercase text-[0.68rem] bg-bronze/5 px-2 py-0.5 border border-bronze/10">Atelier Collector</span>
                </div>
                <div className="flex justify-between items-center text-[0.78rem] font-body">
                  <span className="text-muted font-light">Registered:</span>
                  <span className="text-ink font-light">{user.createdAt}</span>
                </div>
              </div>

              {user.isAdmin && (
                <div className="mt-6 pt-6 border-t border-border/60">
                  <Link
                    to="/admin"
                    className="w-full inline-block text-center font-body font-medium text-[0.62rem] tracking-[0.2em] uppercase bg-ink hover:bg-bronze text-background py-3 transition-all duration-300 no-underline rounded-[2px]"
                  >
                    Admin Registry
                  </Link>
                </div>
              )}
            </div>

            {/* Premium Perks Box */}
            <div className="bg-surface border border-border/80 p-6 flex flex-col justify-between">
              <div>
                <p className="font-body font-light text-[0.55rem] tracking-[0.3em] uppercase text-gold/60 mb-2">
                  Novella Concierge
                </p>
                <p className="font-display font-light text-base text-ink leading-relaxed">
                  Enjoy complimentary styling advice and priority scheduling on future space designs.
                </p>
              </div>
              <div className="mt-5 w-8 h-[1px] bg-bronze" />
            </div>
          </div>

          {/* Column Right: Profile Form & History */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Success/Error Alerts */}
            {successMsg && (
              <div className="bg-emerald-50/60 border border-emerald-200 text-emerald-800 px-5 py-4 text-xs font-body tracking-[0.02em] rounded-sm flex items-center gap-3 transition-all duration-300">
                <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{successMsg}</span>
              </div>
            )}
            
            {(error || authError) && (
              <div className="bg-red-50/60 border border-red-200 text-red-700 px-5 py-4 text-xs font-body tracking-[0.02em] rounded-sm flex items-center gap-3 transition-all duration-300">
                <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error || authError}</span>
              </div>
            )}

            {/* Profile Settings Block */}
            <div className="bg-surface/30 border border-border p-8 md:p-10">
              <div className="flex justify-between items-center mb-8 pb-3 border-b border-border/50">
                <h3 className="font-display font-light text-2xl text-ink">Personal Information</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="font-body font-medium text-[0.62rem] tracking-[0.2em] uppercase text-bronze hover:text-gold transition-colors duration-200"
                  >
                    Edit Details
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user.name,
                        email: user.email,
                        phone: user.phone || "",
                        street: user.address?.street || "",
                        apartment: user.address?.apartment || "",
                        city: user.address?.city || "",
                        state: user.address?.state || "",
                        zipCode: user.address?.zipCode || "",
                      });
                      setError("");
                    }}
                    className="font-body font-light text-[0.62rem] tracking-[0.2em] uppercase text-muted hover:text-ink transition-colors duration-200"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="font-body font-normal text-[0.58rem] tracking-[0.16em] uppercase text-muted block mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full bg-background border px-4 py-3 font-body text-sm text-ink outline-none transition-all duration-300 ${
                        isEditing
                          ? "border-border focus:border-bronze focus:ring-1 focus:ring-bronze/10"
                          : "border-transparent bg-transparent pl-0 text-ink/75 font-normal cursor-not-allowed"
                      }`}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-body font-normal text-[0.58rem] tracking-[0.16em] uppercase text-muted block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full bg-background border px-4 py-3 font-body text-sm text-ink outline-none transition-all duration-300 ${
                        isEditing
                          ? "border-border focus:border-bronze focus:ring-1 focus:ring-bronze/10"
                          : "border-transparent bg-transparent pl-0 text-ink/75 font-normal cursor-not-allowed"
                      }`}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-body font-normal text-[0.58rem] tracking-[0.16em] uppercase text-muted block mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder={isEditing ? "e.g. +1 (555) 019-2834" : "Not specified"}
                      className={`w-full bg-background border px-4 py-3 font-body text-sm text-ink outline-none transition-all duration-300 ${
                        isEditing
                          ? "border-border focus:border-bronze focus:ring-1 focus:ring-bronze/10 placeholder:text-muted/40"
                          : "border-transparent bg-transparent pl-0 text-ink/75 font-normal cursor-not-allowed"
                      }`}
                    />
                  </div>
                </div>

                {!isEditing ? (
                  <div className="space-y-1">
                    <label className="font-body font-normal text-[0.58rem] tracking-[0.16em] uppercase text-muted block mb-1">
                      Shipping Address
                    </label>
                    {formData.street ? (
                      <div className="font-body text-sm text-ink/75 py-2 leading-relaxed">
                        <p className="m-0">{formData.street}{formData.apartment ? `, ${formData.apartment}` : ""}</p>
                        <p className="m-0">{formData.city}, {formData.state} {formData.zipCode}</p>
                      </div>
                    ) : (
                      <p className="font-body text-sm text-muted/50 italic py-2 m-0">No address saved</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="font-body font-normal text-[0.58rem] tracking-[0.16em] uppercase text-muted block mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                        placeholder="Flat, House no., Building, Company"
                        className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none transition-all duration-300 focus:border-bronze focus:ring-1 focus:ring-bronze/10 placeholder:text-muted/40"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-body font-normal text-[0.58rem] tracking-[0.16em] uppercase text-muted block mb-1">
                          Apartment, suite, unit (Optional)
                        </label>
                        <input
                          type="text"
                          name="apartment"
                          value={formData.apartment}
                          onChange={handleChange}
                          placeholder="e.g. Apt 4B"
                          className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none transition-all duration-300 focus:border-bronze focus:ring-1 focus:ring-bronze/10 placeholder:text-muted/40"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-body font-normal text-[0.58rem] tracking-[0.16em] uppercase text-muted block mb-1">
                          Town / City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="e.g. Mumbai"
                          className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none transition-all duration-300 focus:border-bronze focus:ring-1 focus:ring-bronze/10 placeholder:text-muted/40"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-body font-normal text-[0.58rem] tracking-[0.16em] uppercase text-muted block mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          placeholder="e.g. Maharashtra"
                          className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none transition-all duration-300 focus:border-bronze focus:ring-1 focus:ring-bronze/10 placeholder:text-muted/40"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-body font-normal text-[0.58rem] tracking-[0.16em] uppercase text-muted block mb-1">
                          ZIP / Postal Code
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          placeholder="e.g. 400001"
                          className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none transition-all duration-300 focus:border-bronze focus:ring-1 focus:ring-bronze/10 placeholder:text-muted/40"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {isEditing && (
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-ink text-cream-muted font-body font-medium text-[0.62rem] tracking-[0.2em] uppercase px-8 py-3.5 mt-2 transition-all duration-300 hover:bg-gold hover:text-dark disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? "Saving Changes..." : "Save Changes"}
                  </button>
                )}
              </form>
            </div>

            {/* Order History Block */}
            <div className="bg-surface/30 border border-border p-8 md:p-10">
              <h3 className="font-display font-light text-2xl text-ink mb-8 pb-3 border-b border-border/50">
                Recent Orders
              </h3>

              <div className="space-y-6">
                {activeOrders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="border border-border/80 bg-background/50 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 hover:border-bronze/40 cursor-pointer group/order"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-body font-medium text-[0.78rem] text-ink group-hover/order:text-bronze transition-colors duration-200">{order.id}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-bronze/40" />
                        <span className="font-body font-light text-xs text-muted">{order.date}</span>
                      </div>
                      <p className="font-display font-light text-sm text-ink/80 mt-2">
                        {order.items}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between md:justify-end gap-6 md:text-right">
                      <div className="flex flex-col">
                        <span className="font-body font-light text-[0.62rem] tracking-[0.1em] uppercase text-muted">Total</span>
                        <span className="font-body font-medium text-[0.78rem] text-ink mt-0.5">{order.total}</span>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <span className="font-body font-light text-[0.62rem] tracking-[0.1em] uppercase text-muted">Status</span>
                        <span className="font-body font-normal text-[0.65rem] tracking-[0.12em] uppercase text-bronze mt-1 bg-bronze/5 border border-bronze/10 px-2 py-0.5">
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Order Details Modal Overlay */}
      {selectedOrder && (() => {
        const normalized = (() => {
          if (!selectedOrder) return null;
          if (selectedOrder.products) return selectedOrder;
          
          // Mock order 1 mapping
          if (selectedOrder.id === "NV-8921") {
            return {
              ...selectedOrder,
              products: [
                {
                  id: 3,
                  name: "Travertine Side Table",
                  price: 8900,
                  quantity: 1,
                  image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&q=80",
                  color: "Beige",
                  size: "Standard"
                }
              ],
              shippingDetails: {
                name: user.name,
                address: user.address || "742 Evergreen Terrace, Springfield, OR 97477",
                phone: user.phone || "+91 99887 76655",
                method: "standard"
              },
              paymentDetails: {
                method: "razorpay",
                razorpayPaymentId: "pay_sample_01"
              },
              pricingBreakdown: {
                subtotal: 8900,
                discount: 0,
                shipping: 0,
                total: 8900
              }
            };
          }

          // Mock order 2 mapping
          if (selectedOrder.id === "NV-7634") {
            return {
              ...selectedOrder,
              products: [
                {
                  id: 1,
                  name: "Arco Floor Lamp",
                  price: 4200,
                  quantity: 1,
                  image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80",
                  color: "Chrome/White",
                  size: "Standard"
                }
              ],
              shippingDetails: {
                name: user.name,
                address: user.address || "742 Evergreen Terrace, Springfield, OR 97477",
                phone: user.phone || "+91 99887 76655",
                method: "standard"
              },
              paymentDetails: {
                method: "razorpay",
                razorpayPaymentId: "pay_sample_02"
              },
              pricingBreakdown: {
                subtotal: 4200,
                discount: 0,
                shipping: 0,
                total: 4200
              }
            };
          }

          return {
            ...selectedOrder,
            products: [],
            shippingDetails: { name: user.name, address: user.address || "No address stored", phone: user.phone || "No phone stored", method: "standard" },
            paymentDetails: { method: "razorpay" },
            pricingBreakdown: { subtotal: 0, discount: 0, shipping: 0, total: 0 }
          };
        })();

        if (!normalized) return null;

        // Stepper statuses setup
        const steps = [
          { label: "Ordered", date: normalized.date, completed: true },
          { label: "Prepared", date: normalized.date, completed: true },
          { label: "Shipped", date: normalized.date, completed: normalized.status === "Shipped" || normalized.status === "Delivered" },
          { label: "Delivered", date: normalized.status === "Delivered" ? normalized.date : "Estimated 4-7 days", completed: normalized.status === "Delivered" }
        ];

        return (
          <div
            className="fixed inset-0 bg-dark/65 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn"
            onClick={() => setSelectedOrder(null)}
          >
            <div
              className="bg-background border border-border w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 md:p-10 shadow-2xl relative flex flex-col gap-8 rounded-[3px] animate-scaleUp"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedOrder(null)}
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
                    Order Details
                  </span>
                </div>
                <h2 className="font-display font-light text-2xl text-ink leading-tight m-0">
                  Receipt for {normalized.id}
                </h2>
                <p className="font-body font-light text-xs text-muted mt-1.5 m-0">
                  Placed on {normalized.date} · Status: <span className="text-bronze font-medium">{normalized.status}</span>
                </p>
              </div>

              {/* Progress Stepper */}
              <div className="border-y border-border/60 py-6 my-1">
                <div className="flex justify-between items-center relative">
                  
                  {/* Background bar */}
                  <div className="absolute left-0 right-0 h-[2px] bg-border z-0" />
                  
                  {/* Progress fill bar */}
                  <div
                    className="absolute left-0 h-[2px] bg-bronze z-0 transition-all duration-500"
                    style={{
                      width:
                        normalized.status === "Delivered"
                          ? "100%"
                          : normalized.status === "Shipped"
                          ? "66.6%"
                          : "33.3%"
                    }}
                  />

                  {/* Nodes */}
                  {steps.map((step, idx) => (
                    <div key={step.label} className="flex flex-col items-center z-10 relative">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center border font-body text-[0.68rem] transition-all duration-300 ${
                        step.completed
                          ? "bg-bronze border-bronze text-background"
                          : "bg-background border-border text-muted"
                      }`}>
                        {step.completed ? "✓" : idx + 1}
                      </div>
                      <span className="font-body font-medium text-[0.62rem] tracking-wider uppercase text-ink mt-2.5">
                        {step.label}
                      </span>
                      <span className="font-body font-light text-[0.55rem] text-muted mt-0.5">
                        {step.date}
                      </span>
                    </div>
                  ))}

                </div>
              </div>

              {/* Products Table */}
              <div className="space-y-4">
                <h4 className="font-display font-normal text-[1.05rem] text-ink m-0 pb-2 border-b border-border/40">
                  Ordered Items
                </h4>
                <div className="divide-y divide-border/40">
                  {normalized.products.map((p, idx) => (
                    <div key={idx} className="py-3.5 flex gap-4 text-xs font-body items-start">
                      {p.image && (
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-12 h-14 object-cover border border-border/60 bg-surface shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-ink block truncate">{p.name}</span>
                        <div className="flex gap-2 text-[0.68rem] text-muted font-light mt-1">
                          {p.color && <span>Color: {p.color}</span>}
                          {p.size && <span>Size: {p.size}</span>}
                          <span>Quantity: {p.quantity}</span>
                        </div>
                      </div>
                      <span className="font-medium text-ink shrink-0">
                        ₹{(p.price * p.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grid: Shipping and Payment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[0.78rem] font-body bg-surface/50 border border-border/60 p-5 rounded-[2px]">
                
                <div className="space-y-2">
                  <h5 className="font-display font-medium text-xs text-ink uppercase tracking-wider m-0">
                    Shipping Details
                  </h5>
                  <div className="font-light text-ink/80 space-y-1">
                    <p className="font-normal m-0">{normalized.shippingDetails.name}</p>
                    <p className="m-0 leading-relaxed whitespace-pre-line">
                      {typeof normalized.shippingDetails.address === "object"
                        ? `${normalized.shippingDetails.address.street}${normalized.shippingDetails.address.apartment ? `, ${normalized.shippingDetails.address.apartment}` : ""}\n${normalized.shippingDetails.address.city}, ${normalized.shippingDetails.address.state} ${normalized.shippingDetails.address.zipCode}`
                        : normalized.shippingDetails.address}
                    </p>
                    <p className="m-0 text-muted">Tel: {normalized.shippingDetails.phone}</p>
                    <p className="m-0 text-[0.68rem] tracking-wider uppercase text-bronze font-normal mt-1.5">
                      Method: {normalized.shippingDetails.method === "express" ? "White-Glove Express" : "Atelier Standard"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h5 className="font-display font-medium text-xs text-ink uppercase tracking-wider m-0">
                      Payment Method
                    </h5>
                    <div className="font-light text-ink/80 space-y-1">
                      <p className="m-0 font-normal capitalize">
                        {normalized.paymentDetails?.paymentMethod || normalized.paymentDetails?.method || "Razorpay"}
                        {normalized.paymentDetails?.paymentStatus && ` (${normalized.paymentDetails.paymentStatus})`}
                      </p>
                      {(normalized.paymentDetails?.transactionToken || normalized.paymentDetails?.razorpayPaymentId) && (
                        <p className="m-0 text-muted font-mono text-[0.7rem]">Txn: {normalized.paymentDetails.transactionToken || normalized.paymentDetails.razorpayPaymentId}</p>
                      )}
                    </div>
                  </div>

                  {/* Pricing Summary */}
                  <div className="border-t border-border/60 pt-4 space-y-2.5">
                    <div className="flex justify-between items-center text-muted">
                      <span className="font-light">Subtotal:</span>
                      <span className="font-medium text-ink">₹{normalized.pricingBreakdown.subtotal.toLocaleString("en-IN")}</span>
                    </div>
                    {normalized.pricingBreakdown.discount > 0 && (
                      <div className="flex justify-between items-center text-emerald-700">
                        <span className="font-light">Promo Discount:</span>
                        <span className="font-medium">-₹{normalized.pricingBreakdown.discount.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-muted">
                      <span className="font-light">Shipping:</span>
                      <span className="font-medium text-ink">
                        {normalized.pricingBreakdown.shipping > 0
                          ? `₹${normalized.pricingBreakdown.shipping}`
                          : "Free"}
                      </span>
                    </div>
                    <div className="flex justify-between items-end border-t border-border/40 pt-2 text-sm font-semibold">
                      <span className="font-display font-medium text-ink">Grand Total:</span>
                      <span className="font-display font-semibold text-bronze text-base leading-none">
                        {normalized.total}
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Customer actions: Cancel or Return */}
              {(normalized.status === "Processing" || normalized.status === "Delivered") && (
                <div className="flex justify-end gap-4 border-t border-border/60 pt-5">
                  {normalized.status === "Processing" && (
                    <button
                      onClick={() => handleCancelOrder(normalized.id)}
                      className="font-body font-medium text-[0.62rem] tracking-[0.2em] uppercase border border-red-700 hover:border-red-950 text-red-700 hover:text-red-950 px-6 py-2.5 bg-transparent transition-all duration-300 cursor-pointer rounded-[2px]"
                    >
                      Cancel Order
                    </button>
                  )}
                  {normalized.status === "Delivered" && (
                    <button
                      onClick={() => handleReturnOrder(normalized.id)}
                      className="font-body font-medium text-[0.62rem] tracking-[0.2em] uppercase border border-ink hover:border-bronze text-ink hover:text-bronze px-6 py-2.5 bg-transparent transition-all duration-300 cursor-pointer rounded-[2px]"
                    >
                      Request Return
                    </button>
                  )}
                </div>
              )}

            </div>
          </div>
        );
      })()}

      <style>{`
        .animate-scaleUp {
          animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
