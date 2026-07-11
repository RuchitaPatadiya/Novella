import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../services/api";

const ProfilePage = () => {
  const { user, logout, updateProfile, addAddress, deleteAddress, updateAddress, error: authError } = useAuth();
  const navigate = useNavigate();
  const defaultAddress = user.addresses?.find((addr) => addr.isDefault) || user.addresses?.[0] || null;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Address book states
  const [newAddrForm, setNewAddrForm] = useState({
    name: "",
    street: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    isDefault: false
  });
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [isAddingAddr, setIsAddingAddr] = useState(false);
  const [addrError, setAddrError] = useState("");
  const [addrSuccess, setAddrSuccess] = useState("");

  const handleAddrChange = (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setNewAddrForm({ ...newAddrForm, [e.target.name]: val });
    setAddrError("");
    setAddrSuccess("");
  };

  const handleAddAddrSubmit = async (e) => {
    e.preventDefault();
    if (!newAddrForm.street || !newAddrForm.city || !newAddrForm.state || !newAddrForm.zipCode) {
      setAddrError("Please fill out all required address fields.");
      return;
    }
    setAddrError("");
    setAddrSuccess("");
    try {
      if (editingAddressId) {
        await updateAddress(editingAddressId, newAddrForm);
        setAddrSuccess("Address updated successfully.");
      } else {
        await addAddress(newAddrForm);
        setAddrSuccess("New address added successfully.");
      }
      setNewAddrForm({
        name: "",
        street: "",
        apartment: "",
        city: "",
        state: "",
        zipCode: "",
        phone: "",
        isDefault: false
      });
      setEditingAddressId(null);
      setIsAddingAddr(false);
    } catch (err) {
      setAddrError(err.message || "Failed to save address.");
    }
  };

  const handleEditAddr = (addr) => {
    setEditingAddressId(addr._id);
    setNewAddrForm({
      name: addr.name || "",
      street: addr.street || "",
      apartment: addr.apartment || "",
      city: addr.city || "",
      state: addr.state || "",
      zipCode: addr.zipCode || "",
      phone: addr.phone || "",
      isDefault: addr.isDefault || false
    });
    setIsAddingAddr(true);
    setAddrError("");
    setAddrSuccess("");
  };

  const handleDeleteAddr = async (addrId) => {
    setAddrError("");
    setAddrSuccess("");
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        await deleteAddress(addrId);
        setAddrSuccess("Address deleted successfully.");
        if (editingAddressId === addrId) {
          setEditingAddressId(null);
          setIsAddingAddr(false);
        }
      } catch (err) {
        setAddrError(err.message || "Failed to delete address.");
      }
    }
  };

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

            {/* Sidebar Navigation */}
            <div className="bg-surface border border-border p-6 rounded-[24px]">
              <span className="font-body font-normal text-[0.55rem] tracking-[0.25em] uppercase text-muted block mb-4 px-2">
                Atelier Account Menu
              </span>
              <nav className="space-y-1.5 font-body text-xs">
                <button
                  type="button"
                  onClick={() => { setActiveTab("overview"); setSelectedOrder(null); }}
                  className={`w-full text-left px-4 py-3 rounded-[8px] transition-all duration-300 border-0 cursor-pointer flex items-center gap-3 ${
                    activeTab === "overview"
                      ? "bg-ink text-background font-medium"
                      : "bg-transparent text-ink/75 hover:bg-surface/60 hover:text-bronze"
                  }`}
                >
                  <svg className="w-4.5 h-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Overview & Details
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab("orders"); setSelectedOrder(null); }}
                  className={`w-full text-left px-4 py-3 rounded-[8px] transition-all duration-300 border-0 cursor-pointer flex items-center gap-3 ${
                    activeTab === "orders"
                      ? "bg-ink text-background font-medium"
                      : "bg-transparent text-ink/75 hover:bg-surface/60 hover:text-bronze"
                  }`}
                >
                  <svg className="w-4.5 h-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  Order History
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab("addresses"); setSelectedOrder(null); }}
                  className={`w-full text-left px-4 py-3 rounded-[8px] transition-all duration-300 border-0 cursor-pointer flex items-center gap-3 ${
                    activeTab === "addresses"
                      ? "bg-ink text-background font-medium"
                      : "bg-transparent text-ink/75 hover:bg-surface/60 hover:text-bronze"
                  }`}
                >
                  <svg className="w-4.5 h-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Saved Addresses
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab("concierge"); setSelectedOrder(null); }}
                  className={`w-full text-left px-4 py-3 rounded-[8px] transition-all duration-300 border-0 cursor-pointer flex items-center gap-3 ${
                    activeTab === "concierge"
                      ? "bg-ink text-background font-medium"
                      : "bg-transparent text-ink/75 hover:bg-surface/60 hover:text-bronze"
                  }`}
                >
                  <svg className="w-4.5 h-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Atelier Concierge
                </button>
              </nav>
            </div>
          </div>

          {/* Column Right: Profile Dynamic Panels */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Tab: OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-12 animate-fadeIn">
                {/* Personal Information Block */}
                <div className="bg-surface/30 border border-border p-8 md:p-10 rounded-[24px]">
                  <div className="flex justify-between items-center mb-8 pb-3 border-b border-border/50">
                    <h3 className="font-display font-light text-2xl text-ink">Personal Information</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="font-body font-normal text-[0.58rem] tracking-[0.16em] uppercase text-muted block mb-1">
                          Full Name
                        </label>
                        <p className="font-body text-sm text-ink/80 py-1.5 m-0 font-medium">{user.name}</p>
                      </div>

                      <div className="space-y-1">
                        <label className="font-body font-normal text-[0.58rem] tracking-[0.16em] uppercase text-muted block mb-1">
                          Email Address
                        </label>
                        <p className="font-body text-sm text-ink/80 py-1.5 m-0 font-medium">{user.email}</p>
                      </div>

                      <div className="space-y-1">
                        <label className="font-body font-normal text-[0.58rem] tracking-[0.16em] uppercase text-muted block mb-1">
                          Phone Number
                        </label>
                        <p className="font-body text-sm text-ink/80 py-1.5 m-0 font-medium">{user.phone || "Not specified"}</p>
                      </div>
                    </div>

                    <div className="space-y-1 pt-4 border-t border-border/40">
                      <label className="font-body font-normal text-[0.58rem] tracking-[0.16em] uppercase text-muted block mb-2">
                        Default Shipping Address
                      </label>
                      {defaultAddress ? (
                        <div className="font-body text-sm text-ink/75 leading-relaxed space-y-0.5">
                          <p className="m-0 font-display font-medium text-xs text-bronze uppercase tracking-wider mb-1">{defaultAddress.name}</p>
                          <p className="m-0">{defaultAddress.street}{defaultAddress.apartment ? `, ${defaultAddress.apartment}` : ""}</p>
                          <p className="m-0">{defaultAddress.city}, {defaultAddress.state} {defaultAddress.zipCode}</p>
                          {defaultAddress.phone && <p className="m-0 text-ink/65 pt-1 text-xs">📞 {defaultAddress.phone}</p>}
                        </div>
                      ) : (
                        <p className="font-body text-sm text-muted/50 italic py-1 m-0">No default address saved. Set one in your address book.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Recent Orders block (max 2) */}
                <div className="bg-surface/30 border border-border p-8 md:p-10 rounded-[24px]">
                  <div className="flex justify-between items-center mb-8 pb-3 border-b border-border/50">
                    <h3 className="font-display font-light text-2xl text-ink">Recent Orders</h3>
                    {dbOrders.length > 2 && (
                      <button
                        onClick={() => setActiveTab("orders")}
                        className="font-body font-medium text-[0.62rem] tracking-[0.2em] uppercase text-bronze hover:text-gold transition-colors duration-200 bg-transparent border-0 cursor-pointer"
                      >
                        View All Orders &rarr;
                      </button>
                    )}
                  </div>

                  <div className="space-y-6">
                    {dbOrders.length > 0 ? (
                      dbOrders.slice(0, 2).map((order) => (
                        <div
                          key={order.id}
                          onClick={() => navigate(`/order/${order.orderId}`)}
                          className="border border-border/80 bg-background/50 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 hover:border-bronze/40 cursor-pointer group/order rounded-[12px]"
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
                              <span className="font-body font-medium text-[0.78rem] text-ink mt-0.5">₹{order.pricingBreakdown?.total?.toLocaleString("en-IN") || order.total?.toLocaleString("en-IN")}</span>
                            </div>
                            
                            <div className="flex flex-col items-end">
                              <span className="font-body font-light text-[0.62rem] tracking-[0.1em] uppercase text-muted">Status</span>
                              <span className={`font-body font-normal text-[0.65rem] tracking-[0.12em] uppercase mt-1 px-2.5 py-0.5 rounded-full border ${
                                order.status === "Cancelled"
                                  ? "bg-red-50/50 text-red-700 border-red-100"
                                  : "bg-bronze/5 text-bronze border-bronze/15"
                              }`}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="font-body text-sm text-muted/50 italic py-2 m-0">No orders placed yet.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: ORDERS */}
            {activeTab === "orders" && (
              <div className="bg-surface/30 border border-border p-8 md:p-10 rounded-[24px] animate-fadeIn space-y-8">
                <div className="pb-3 border-b border-border/50">
                  <h3 className="font-display font-light text-2xl text-ink">Order History</h3>
                  <p className="font-body text-xs text-muted mt-1.5 m-0">Track status, download invoices, or submit return requests.</p>
                </div>

                <div className="space-y-6">
                  {dbOrders.length > 0 ? (
                    dbOrders.map((order) => (
                      <div
                        key={order.id}
                        onClick={() => navigate(`/order/${order.orderId}`)}
                        className="border border-border/80 bg-background/50 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 hover:border-bronze/40 cursor-pointer group/order rounded-[12px]"
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
                            <span className="font-body font-medium text-[0.78rem] text-ink mt-0.5">₹{order.pricingBreakdown?.total?.toLocaleString("en-IN") || order.total?.toLocaleString("en-IN")}</span>
                          </div>
                          
                          <div className="flex flex-col items-end">
                            <span className="font-body font-light text-[0.62rem] tracking-[0.1em] uppercase text-muted">Status</span>
                            <span className={`font-body font-normal text-[0.65rem] tracking-[0.12em] uppercase mt-1 px-2.5 py-0.5 rounded-full border ${
                              order.status === "Cancelled"
                                ? "bg-red-50/50 text-red-700 border-red-100"
                                : "bg-bronze/5 text-bronze border-bronze/15"
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-16">
                      <p className="font-display font-light italic text-lg text-muted mb-4">No orders placed yet.</p>
                      <Link
                        to="/shop"
                        className="font-body text-[0.62rem] tracking-[0.2em] uppercase text-background bg-ink px-6 py-2.5 hover:bg-bronze transition-colors duration-200 rounded-[2px]"
                      >
                        Explore Catalog
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab: ADDRESSES */}
            {activeTab === "addresses" && (
              <div className="space-y-12 animate-fadeIn">
                {/* Address Book Card Block */}
                <div className="bg-surface/30 border border-border p-8 md:p-10 rounded-[24px]">
                  <div className="flex justify-between items-center mb-8 pb-3 border-b border-border/50">
                    <h3 className="font-display font-light text-2xl text-ink">
                      {editingAddressId ? "Edit Address" : "Saved Addresses"}
                    </h3>
                    {!isAddingAddr ? (
                      <button
                        onClick={() => setIsAddingAddr(true)}
                        className="font-body font-medium text-[0.62rem] tracking-[0.2em] uppercase text-bronze hover:text-gold transition-colors duration-200 bg-transparent border-0 cursor-pointer"
                      >
                        + Add New Address
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setIsAddingAddr(false);
                          setEditingAddressId(null);
                          setNewAddrForm({
                            name: "",
                            street: "",
                            apartment: "",
                            city: "",
                            state: "",
                            zipCode: "",
                            phone: "",
                            isDefault: false
                          });
                        }}
                        className="font-body font-light text-[0.62rem] tracking-[0.2em] uppercase text-muted hover:text-ink transition-colors duration-200 bg-transparent border-0 cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  {/* Success/Error messages for Address Book */}
                  {addrSuccess && (
                    <div className="bg-bronze/5 border border-bronze/20 text-bronze px-5 py-4 text-xs font-body tracking-[0.02em] rounded-sm mb-6 flex items-center gap-3">
                      <svg className="w-4 h-4 text-bronze shrink-0 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{addrSuccess}</span>
                    </div>
                  )}

                  {addrError && (
                    <div className="bg-red-50/60 border border-red-200 text-red-700 px-5 py-4 text-xs font-body tracking-[0.02em] rounded-sm mb-6 flex items-center gap-3">
                      <svg className="w-4 h-4 text-red-500 shrink-0 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span>{addrError}</span>
                    </div>
                  )}

                  {!isAddingAddr ? (
                    /* Address Cards Grid */
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {user.addresses && user.addresses.length > 0 ? (
                        user.addresses.map((addr) => (
                          <div 
                            key={addr._id} 
                            className={`p-6 border rounded-[16px] bg-background flex flex-col justify-between relative transition-all duration-300 ${
                              addr.isDefault ? "border-bronze shadow-xs" : "border-border hover:border-bronze/45"
                            }`}
                          >
                            {addr.isDefault && (
                              <span className="absolute top-4 right-4 bg-bronze/10 text-bronze border border-bronze/20 font-body text-[0.52rem] tracking-wider uppercase px-2 py-0.5 rounded-[4px] font-semibold">
                                Default
                              </span>
                            )}
                            <div className="space-y-2">
                              <p className="font-display font-light text-base text-ink m-0 pr-12">
                                {addr.name || "Address"}
                              </p>
                              <div className="font-body text-xs text-muted leading-relaxed space-y-1">
                                <p className="m-0 text-ink/80">{addr.street}{addr.apartment ? `, ${addr.apartment}` : ""}</p>
                                <p className="m-0">{addr.city}, {addr.state} {addr.zipCode}</p>
                                <p className="m-0 pt-1 text-ink/65">📞 {addr.phone || "No phone contact"}</p>
                              </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-5 pt-3 border-t border-border/50 items-center">
                              <button
                                type="button"
                                onClick={() => handleEditAddr(addr)}
                                className="bg-transparent border-0 font-body text-[0.62rem] tracking-wider uppercase text-bronze hover:text-gold cursor-pointer transition-colors"
                              >
                                Edit
                              </button>
                              <span className="text-border/50 text-[10px] select-none">|</span>
                              <button
                                type="button"
                                onClick={() => handleDeleteAddr(addr._id)}
                                className="bg-transparent border-0 font-body text-[0.62rem] tracking-wider uppercase text-red-600 hover:text-red-700 cursor-pointer transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="sm:col-span-2 text-center py-8">
                          <p className="font-body text-sm text-muted/50 italic m-0">No saved addresses found. Add one above to get started.</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Add New Address Form */
                    <form onSubmit={handleAddAddrSubmit} className="space-y-4 animate-fadeIn">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="font-body font-normal text-[0.58rem] tracking-[0.16em] uppercase text-muted block mb-1">
                            Address Label (e.g. Home, Office) *
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={newAddrForm.name}
                            onChange={handleAddrChange}
                            placeholder="e.g. Home"
                            className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none transition-all duration-300 focus:border-bronze focus:ring-1 focus:ring-bronze/10 rounded-[6px]"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-body font-normal text-[0.58rem] tracking-[0.16em] uppercase text-muted block mb-1">
                            Contact Phone *
                          </label>
                          <input
                            type="text"
                            name="phone"
                            value={newAddrForm.phone}
                            onChange={handleAddrChange}
                            placeholder="10-digit mobile number"
                            className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none transition-all duration-300 focus:border-bronze focus:ring-1 focus:ring-bronze/10 rounded-[6px]"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="font-body font-normal text-[0.58rem] tracking-[0.16em] uppercase text-muted block mb-1">
                          Street Address *
                        </label>
                        <input
                          type="text"
                          name="street"
                          value={newAddrForm.street}
                          onChange={handleAddrChange}
                          placeholder="Flat, House no., Building, Area"
                          className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none transition-all duration-300 focus:border-bronze focus:ring-1 focus:ring-bronze/10 rounded-[6px]"
                          required
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
                            value={newAddrForm.apartment}
                            onChange={handleAddrChange}
                            placeholder="e.g. Apt 4B"
                            className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none transition-all duration-300 focus:border-bronze focus:ring-1 focus:ring-bronze/10 rounded-[6px]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-body font-normal text-[0.58rem] tracking-[0.16em] uppercase text-muted block mb-1">
                            Town / City *
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={newAddrForm.city}
                            onChange={handleAddrChange}
                            placeholder="e.g. Mumbai"
                            className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none transition-all duration-300 focus:border-bronze focus:ring-1 focus:ring-bronze/10 rounded-[6px]"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="font-body font-normal text-[0.58rem] tracking-[0.16em] uppercase text-muted block mb-1">
                            State *
                          </label>
                          <input
                            type="text"
                            name="state"
                            value={newAddrForm.state}
                            onChange={handleAddrChange}
                            placeholder="e.g. Maharashtra"
                            className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none transition-all duration-300 focus:border-bronze focus:ring-1 focus:ring-bronze/10 rounded-[6px]"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-body font-normal text-[0.58rem] tracking-[0.16em] uppercase text-muted block mb-1">
                            ZIP / Postal Code *
                          </label>
                          <input
                            type="text"
                            name="zipCode"
                            value={newAddrForm.zipCode}
                            onChange={handleAddrChange}
                            placeholder="6-digit PIN code"
                            className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none transition-all duration-300 focus:border-bronze focus:ring-1 focus:ring-bronze/10 rounded-[6px]"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 py-2">
                        <input
                          type="checkbox"
                          name="isDefault"
                          id="isDefault"
                          checked={newAddrForm.isDefault}
                          onChange={handleAddrChange}
                          className="cursor-pointer accent-bronze w-4 h-4"
                        />
                        <label htmlFor="isDefault" className="font-body text-xs text-muted cursor-pointer select-none">
                          Set as default shipping address
                        </label>
                      </div>

                      <button
                        type="submit"
                        className="bg-ink text-background font-body font-medium text-[0.62rem] tracking-[0.2em] uppercase px-8 py-3.5 mt-2 transition-all duration-300 hover:bg-bronze cursor-pointer rounded-[4px]"
                      >
                        {editingAddressId ? "Save Changes" : "Save Address"}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}

            {/* Tab: CONCIERGE */}
            {activeTab === "concierge" && (
              <div className="bg-surface/30 border border-border p-8 md:p-10 rounded-[24px] animate-fadeIn space-y-8">
                <div className="pb-3 border-b border-border/50">
                  <h3 className="font-display font-light text-2xl text-ink">Atelier Concierge</h3>
                  <p className="font-body text-xs text-muted mt-1.5 m-0">Direct support and premium design advisory services.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-border/60 bg-background/50 p-6 rounded-[16px] space-y-3">
                    <span className="font-body font-normal text-[0.55rem] tracking-[0.2em] uppercase text-bronze block">
                      Styling Advisory
                    </span>
                    <p className="font-display font-light text-lg text-ink m-0">Complimentary Styling Advice</p>
                    <p className="font-body text-xs text-muted leading-relaxed m-0">
                      As an Atelier Collector, you have direct access to our styling consultants. Schedule a call to discuss curation, colors, or spatial layout matching for your home.
                    </p>
                    <button className="mt-2 font-body text-[0.58rem] tracking-[0.28em] uppercase text-bronze hover:text-gold bg-transparent border-0 cursor-pointer font-medium p-0">
                      SCHEDULE SESSION &rarr;
                    </button>
                  </div>

                  <div className="border border-border/60 bg-background/50 p-6 rounded-[16px] space-y-3">
                    <span className="font-body font-normal text-[0.55rem] tracking-[0.2em] uppercase text-bronze block">
                      Priority Shipping
                    </span>
                    <p className="font-display font-light text-lg text-ink m-0">Track & Manage Deliveries</p>
                    <p className="font-body text-xs text-muted leading-relaxed m-0">
                      All your deliveries are handled with premium white-glove packaging. For custom requests or adjustments to active shipments, please get in touch with our operations desk.
                    </p>
                    <a href="mailto:support@novella.com" className="inline-block mt-2 font-body text-[0.58rem] tracking-[0.28em] uppercase text-bronze hover:text-gold font-medium no-underline">
                      EMAIL SUPPORT &rarr;
                    </a>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>


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
