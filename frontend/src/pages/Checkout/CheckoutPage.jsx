import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useProducts } from "../../context/ProductContext";
import API from "../../services/api";

const CheckoutPage = () => {
  const { user, updateProfile, addAddress } = useAuth();
  const { cart, clearCart, cartSubtotal } = useCart();
  const { products } = useProducts();
  const navigate = useNavigate();
  const location = useLocation();

  // Promo code states
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  // Checkout states
  const [activeStep, setActiveStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success
  const [shippingForm, setShippingForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    street: user?.address?.street || "",
    apartment: user?.address?.apartment || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    zipCode: user?.address?.zipCode || "",
    method: "standard",
  });

  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [billingForm, setBillingForm] = useState({
    name: "",
    phone: "",
    street: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("razorpay");

  const [checkoutSettings, setCheckoutSettings] = useState({
    standardShippingFee: 0,
    expressShippingFee: 500,
    freeShippingThreshold: 25000,
    codFee: 50,
    taxRate: 18
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await API.get("/cms/checkout_settings");
        if (res.data) {
          setCheckoutSettings({
            standardShippingFee: Number(res.data.standardShippingFee) ?? 0,
            expressShippingFee: Number(res.data.expressShippingFee) ?? 500,
            freeShippingThreshold: Number(res.data.freeShippingThreshold) ?? 25000,
            codFee: Number(res.data.codFee) ?? 50,
            taxRate: Number(res.data.taxRate) ?? 18
          });
        }
      } catch (err) {
        console.error("Failed to load checkout settings:", err);
      }
    };
    fetchSettings();
  }, []);

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(true);


  useEffect(() => {
    const fetchSavedAddresses = async () => {
      try {
        setAddressesLoading(true);
        const res = await API.get("/auth/profile/addresses");
        setSavedAddresses(res.data);
      } catch (err) {
        console.error("Failed to load saved addresses:", err);
      } finally {
        setAddressesLoading(false);
      }
    };
    fetchSavedAddresses();
  }, []);

  // Auto-select the user's default saved address on mount/load
  useEffect(() => {
    if (savedAddresses.length > 0) {
      const defaultAddr = savedAddresses.find((a) => a.isDefault);
      if (defaultAddr) {
        setShippingForm((prev) => ({
          ...prev,
          name: prev.name && prev.name !== "Home" && prev.name !== "Office" && !prev.name.startsWith("Shipping:") ? prev.name : (user.name || ""),
          phone: defaultAddr.phone || prev.phone,
          street: defaultAddr.street || "",
          apartment: defaultAddr.apartment || "",
          city: defaultAddr.city || "",
          state: defaultAddr.state || "",
          zipCode: defaultAddr.zipCode || "",
        }));
      }
    }
  }, [savedAddresses]);

  const [paymentForm, setPaymentForm] = useState({});

  const [formErrors, setFormErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("");
  const [checkoutError, setError] = useState("");

  if (!user) return null;

  // Calculate pricing details
  const discountAmount = appliedPromo ? appliedPromo.discountAmount : 0;
  const meetsThreshold = cartSubtotal >= checkoutSettings.freeShippingThreshold;
  let shippingCost = shippingForm.method === "express"
    ? checkoutSettings.expressShippingFee
    : (meetsThreshold ? 0 : checkoutSettings.standardShippingFee);

  if (paymentMethod === "cod") {
    shippingCost += checkoutSettings.codFee;
  }

  const grandTotal = cartSubtotal - discountAmount + shippingCost;

  // Handle promo code application
  const handleApplyPromo = async (e) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    setPromoError("");
    setPromoSuccess("");
    setIsApplyingPromo(true);

    try {
      const res = await API.post("/promos/validate", {
        code: promoCode,
        cartSubtotal: cartSubtotal
      });

      setAppliedPromo(res.data);
      setPromoSuccess(res.data.message || `Promo code applied successfully!`);
    } catch (err) {
      console.error("Promo validation error:", err);
      setAppliedPromo(null);
      setPromoError(err.response?.data?.message || "Invalid coupon code.");
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleShippingChange = (e) => {
    setShippingForm({ ...shippingForm, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: "" });
  };

  const handleBillingChange = (e) => {
    setBillingForm({ ...billingForm, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: "" });
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!shippingForm.name.trim()) errors.name = "Full name is required.";
    if (!shippingForm.email.trim()) errors.email = "Email address is required.";
    if (!shippingForm.phone.trim()) errors.phone = "Phone number is required.";
    if (!shippingForm.street.trim()) errors.street = "Street address is required.";
    if (!shippingForm.city.trim()) errors.city = "City is required.";
    if (!shippingForm.state.trim()) errors.state = "State is required.";
    if (!shippingForm.zipCode.trim()) errors.zipCode = "ZIP/Postal code is required.";

    if (!billingSameAsShipping) {
      if (!billingForm.name.trim()) errors.billingName = "Billing name is required.";
      if (!billingForm.phone.trim()) errors.billingPhone = "Billing phone is required.";
      if (!billingForm.street.trim()) errors.billingStreet = "Billing street address is required.";
      if (!billingForm.city.trim()) errors.billingCity = "Billing city is required.";
      if (!billingForm.state.trim()) errors.billingState = "Billing state is required.";
      if (!billingForm.zipCode.trim()) errors.billingZipCode = "Billing ZIP code is required.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setActiveStep(2);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    processOrderPlacement();
  };

  // Launch Razorpay secure checkout flow
  const processOrderPlacement = () => {
    setError("");
    setIsProcessing(true);
    setProcessingStatus("Initializing secure payment gateway...");
    finalizeOrder();
  };

  const finalizeOrder = async () => {
    const orderId = `NV-${Math.floor(1000 + Math.random() * 9000)}`;
    const itemsDescription = cart
      .map((item) => {
        const p = products.find((prod) => prod.id === item.id);
        return `${p ? p.name : "Curated Product"} (x${item.quantity})`;
      })
      .join(", ");

    const resolvedBillingDetails = billingSameAsShipping
      ? {
          name: shippingForm.name,
          address: {
            street: shippingForm.street,
            apartment: shippingForm.apartment,
            city: shippingForm.city,
            state: shippingForm.state,
            zipCode: shippingForm.zipCode,
          },
          phone: shippingForm.phone,
        }
      : {
          name: billingForm.name,
          address: {
            street: billingForm.street,
            apartment: billingForm.apartment,
            city: billingForm.city,
            state: billingForm.state,
            zipCode: billingForm.zipCode,
          },
          phone: billingForm.phone,
        };

    const newOrder = {
      id: orderId,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      total: `₹${grandTotal.toLocaleString("en-IN")}`,
      status: "Processing",
      items: itemsDescription,
      products: cart.map(item => {
        const p = products.find(prod => prod.id === item.id);
        return {
          id: item.id,
          name: p ? p.name : "Product",
          price: p ? p.price : 0,
          image: p ? (p.images?.[0] || p.image) : "",
          quantity: item.quantity,
          color: item.color,
          size: item.size
        };
      }),
      shippingDetails: {
        name: shippingForm.name,
        address: {
          street: shippingForm.street,
          apartment: shippingForm.apartment,
          city: shippingForm.city,
          state: shippingForm.state,
          zipCode: shippingForm.zipCode,
        },
        phone: shippingForm.phone,
        method: shippingForm.method
      },
      billingDetails: resolvedBillingDetails,
      paymentDetails: {
        method: paymentMethod === "cod" ? "COD" : "razorpay"
      },
      pricingBreakdown: {
        subtotal: cartSubtotal,
        discount: discountAmount,
        shipping: shippingCost,
        total: grandTotal,
        promoCode: appliedPromo ? appliedPromo.code : null
      }
    };

    // If Cash on Delivery, submit directly to backend and skip Razorpay
    if (paymentMethod === "cod") {
      setProcessingStatus("Placing Cash on Delivery order...");
      try {
        await API.post("/orders", {
          orderId: newOrder.id,
          date: newOrder.date,
          total: newOrder.total,
          items: newOrder.items,
          products: newOrder.products,
          shippingDetails: newOrder.shippingDetails,
          billingDetails: resolvedBillingDetails,
          paymentDetails: {
            method: "COD",
            paymentStatus: "Pending",
            transactionToken: `COD-${Date.now()}`
          },
          pricingBreakdown: newOrder.pricingBreakdown
        });

        // Save default address if not set
        const hasDefaultAddress = user.address && user.address.street;
        await updateProfile({
          address: hasDefaultAddress ? user.address : {
            street: shippingForm.street,
            apartment: shippingForm.apartment,
            city: shippingForm.city,
            state: shippingForm.state,
            zipCode: shippingForm.zipCode,
          },
          phone: user.phone || shippingForm.phone,
        });

        clearCart();
        setIsProcessing(false);
        navigate(`/order-success/${newOrder.id}`, { replace: true });
      } catch (err) {
        console.error("Failed to commit COD order:", err);
        setError(err.response?.data?.message || "Failed to create order record. Please try again.");
        setIsProcessing(false);
      }
      return;
    }

    try {
      // 1. Ask backend to register a secure Razorpay order transaction
      const rzpRes = await API.post("/orders/razorpay", {
        products: newOrder.products,
        shippingDetails: newOrder.shippingDetails,
        pricingBreakdown: newOrder.pricingBreakdown
      });

      const { key, razorpayOrder, pricingBreakdown: serverPricing } = rzpRes.data;

      // 2. Configure checkout overlay options
      const options = {
        key: key,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Novella Atelier",
        description: `Checkout transaction for order #${newOrder.id}`,
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            setIsProcessing(true);
            
            // 3. Save authorized order transaction details to database
            await API.post("/orders", {
              orderId: newOrder.id,
              date: newOrder.date,
              total: `₹${serverPricing.total.toLocaleString("en-IN")}`,
              items: newOrder.items,
              products: newOrder.products,
              shippingDetails: newOrder.shippingDetails,
              billingDetails: resolvedBillingDetails,
              paymentDetails: {
                method: "razorpay",
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature
              },
              pricingBreakdown: serverPricing
            });


            // Also save current address & phone as defaults if not already set
            const hasDefaultAddress = user.address && user.address.street;
            await updateProfile({
              address: hasDefaultAddress ? user.address : {
                street: shippingForm.street,
                apartment: shippingForm.apartment,
                city: shippingForm.city,
                state: shippingForm.state,
                zipCode: shippingForm.zipCode,
              },
              phone: user.phone || shippingForm.phone,
            });



            clearCart();
            setIsProcessing(false);
            navigate(`/order-success/${newOrder.id}`, { replace: true });
          } catch (err) {
            console.error("Failed to commit paid order:", err);
            setError(err.response?.data?.message || "Payment succeeded, but failed to create order record. Please contact support.");
            setIsProcessing(false);
          }
        },
        prefill: {
          name: shippingForm.name,
          email: user.email,
          contact: shippingForm.phone
        },
        theme: {
          color: "#B49A78" // match novella bronze color!
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Order processing failed:", err);
      setError(err.response?.data?.message || "Failed to initialize secure payment. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-[76px] pb-16">
      
      {/* Loading Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-dark/90 backdrop-blur-sm z-50 flex items-center justify-center text-center p-6 transition-all duration-300">
          <div className="space-y-6 max-w-sm">
            <svg className="animate-spin h-10 w-10 text-gold mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="font-display font-light italic text-xl text-white/95">
              Processing Order
            </p>
            <p className="font-body font-light text-xs text-gold/60 uppercase tracking-[0.2em] animate-pulse">
              {processingStatus}
            </p>
          </div>
        </div>
      )}

      {/* Checkout Error Banner */}
      {checkoutError && (
        <div className="mx-[clamp(1.5rem,5vw,4rem)] mt-4 bg-red-50 border border-red-200 text-red-800 px-5 py-3 rounded-[2px] font-body text-sm flex items-center justify-between">
          <span>{checkoutError}</span>
          <button onClick={() => setError("")} className="text-red-400 hover:text-red-600 bg-transparent border-0 text-lg cursor-pointer">×</button>
        </div>
      )}

      <div className="px-[clamp(1.5rem,5vw,4rem)] py-5 border-b border-border bg-background">
        <div className="flex items-center gap-2 font-body text-[0.68rem] tracking-[0.18em] uppercase text-muted">
          <Link to="/cart" className="hover:text-bronze transition-colors duration-200 no-underline text-current">
            Bag
          </Link>
          <span>/</span>
          <span className="text-ink font-normal">Checkout</span>
        </div>
      </div>

      <div className="px-[clamp(1.5rem,5vw,4rem)] py-12 md:py-16">
        <h1 className="font-display font-light text-4xl text-ink mb-10 pb-4 border-b border-border/80">
          Secured Checkout
        </h1>

        {cart.length === 0 ? (
          <div className="text-center py-16 bg-surface border border-border max-w-xl mx-auto rounded-[3px]">
            <h3 className="font-display font-light text-2xl text-ink mb-4">No items in cart</h3>
            <p className="font-body font-light text-sm text-muted mb-6">
              You must have items in your shopping bag to place an order.
            </p>
            <Link to="/shop" className="no-underline">
              <button className="bg-bronze text-background font-body font-medium text-xs tracking-widest uppercase px-6 py-3 border-0 cursor-pointer">
                Browse Shop
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Column: Checkout steps */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Shipping Accordion */}
              <div className="border border-border bg-surface rounded-[3px] overflow-hidden">
                <div
                  className={`px-6 py-4 flex justify-between items-center bg-dark/5 border-b border-border/60 ${
                    activeStep !== 1 ? "cursor-pointer" : ""
                  }`}
                  onClick={() => activeStep === 2 && setActiveStep(1)}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-ink text-cream-muted font-body text-xs font-bold flex items-center justify-center">
                      1
                    </span>
                    <h3 className="font-display font-normal text-lg text-ink m-0">
                      Shipping Details
                    </h3>
                  </div>
                  {activeStep > 1 && (
                    <span className="font-body font-normal text-[0.62rem] tracking-wider uppercase text-bronze">
                      Edit
                    </span>
                  )}
                </div>

                {activeStep === 1 && (
                  <form onSubmit={handleShippingSubmit} className="p-6 md:p-8 space-y-6 animate-fadeIn">
                    {/* Saved Addresses list */}
                    {savedAddresses.length > 0 && (
                      <div className="space-y-2 pb-6 border-b border-border/60">
                        <span className="font-body font-normal text-[0.62rem] tracking-[0.16em] uppercase text-muted block mb-2">
                          Select Saved Address
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {savedAddresses.map((addr) => (
                            <div
                              key={addr._id}
                              type="button"
                              onClick={() => {
                                setShippingForm((prev) => ({
                                   ...prev,
                                   name: prev.name && prev.name !== "Home" && prev.name !== "Office" && !prev.name.startsWith("Shipping:") ? prev.name : (user.name || ""),
                                   phone: addr.phone || prev.phone,
                                   street: addr.street || "",
                                   apartment: addr.apartment || "",
                                   city: addr.city || "",
                                   state: addr.state || "",
                                   zipCode: addr.zipCode || "",
                                 }));
                              }}
                              className={`border p-3.5 rounded-[8px] cursor-pointer transition-all duration-300 text-left space-y-1 font-body text-xs relative group ${
                                shippingForm.street === addr.street && shippingForm.city === addr.city && shippingForm.zipCode === addr.zipCode
                                  ? "border-bronze bg-[#FDFBF7] ring-1 ring-bronze/10 shadow-xs" 
                                  : "border-border/80 bg-surface/30 hover:border-bronze hover:bg-surface/50"
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-semibold text-ink">{addr.name}</span>
                                {addr.isDefault && (
                                  <span className="text-[0.55rem] text-white bg-bronze px-1.5 py-0.5 rounded-xs tracking-wider uppercase font-semibold">
                                    Default
                                  </span>
                                )}
                              </div>
                              <span className="text-muted block font-light truncate">{addr.street}{addr.apartment ? `, ${addr.apartment}` : ""}</span>
                              <span className="text-muted block font-light">{addr.city}, {addr.state} {addr.zipCode}</span>
                              <span className="text-muted block font-light text-[0.68rem]">{addr.phone}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="font-body font-normal text-[0.58rem] tracking-[0.16em] uppercase text-muted block mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={shippingForm.name}
                          onChange={handleShippingChange}
                          className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none transition-all duration-300 focus:border-bronze focus:ring-1 focus:ring-bronze/10"
                        />
                        {formErrors.name && <p className="text-[0.68rem] font-body text-red-700 m-0">{formErrors.name}</p>}
                      </div>

                      <div className="space-y-1">
                        <label className="font-body font-normal text-[0.58rem] tracking-[0.16em] uppercase text-muted block mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={shippingForm.email}
                          onChange={handleShippingChange}
                          className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none transition-all duration-300 focus:border-bronze focus:ring-1 focus:ring-bronze/10"
                        />
                        {formErrors.email && <p className="text-[0.68rem] font-body text-red-700 m-0">{formErrors.email}</p>}
                      </div>

                      <div className="space-y-1">
                        <label className="font-body font-normal text-[0.58rem] tracking-[0.16em] uppercase text-muted block mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={shippingForm.phone}
                          onChange={handleShippingChange}
                          placeholder="+91 XXXXX XXXXX"
                          className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none transition-all duration-300 focus:border-bronze focus:ring-1 focus:ring-bronze/10 placeholder:text-muted/30"
                        />
                        {formErrors.phone && <p className="text-[0.68rem] font-body text-red-700 m-0">{formErrors.phone}</p>}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="font-body font-normal text-[0.58rem] tracking-[0.16em] uppercase text-muted block mb-1">
                          Street Address
                        </label>
                        <input
                          type="text"
                          name="street"
                          value={shippingForm.street}
                          onChange={handleShippingChange}
                          placeholder="Flat, House no., Building, Company, Staff quarter"
                          className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none transition-all duration-300 focus:border-bronze focus:ring-1 focus:ring-bronze/10 placeholder:text-muted/30"
                        />
                        {formErrors.street && <p className="text-[0.68rem] font-body text-red-700 m-0">{formErrors.street}</p>}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="font-body font-normal text-[0.58rem] tracking-[0.16em] uppercase text-muted block mb-1">
                            Apartment, suite, unit (Optional)
                          </label>
                          <input
                            type="text"
                            name="apartment"
                            value={shippingForm.apartment}
                            onChange={handleShippingChange}
                            placeholder="e.g. Apt 4B, Floor 2"
                            className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none transition-all duration-300 focus:border-bronze focus:ring-1 focus:ring-bronze/10 placeholder:text-muted/30"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-body font-normal text-[0.58rem] tracking-[0.16em] uppercase text-muted block mb-1">
                            Town / City
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={shippingForm.city}
                            onChange={handleShippingChange}
                            placeholder="e.g. Mumbai"
                            className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none transition-all duration-300 focus:border-bronze focus:ring-1 focus:ring-bronze/10 placeholder:text-muted/30"
                          />
                          {formErrors.city && <p className="text-[0.68rem] font-body text-red-700 m-0">{formErrors.city}</p>}
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
                            value={shippingForm.state}
                            onChange={handleShippingChange}
                            placeholder="e.g. Maharashtra"
                            className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none transition-all duration-300 focus:border-bronze focus:ring-1 focus:ring-bronze/10 placeholder:text-muted/30"
                          />
                          {formErrors.state && <p className="text-[0.68rem] font-body text-red-700 m-0">{formErrors.state}</p>}
                        </div>

                        <div className="space-y-1">
                          <label className="font-body font-normal text-[0.58rem] tracking-[0.16em] uppercase text-muted block mb-1">
                            ZIP / Postal Code
                          </label>
                          <input
                            type="text"
                            name="zipCode"
                            value={shippingForm.zipCode}
                            onChange={handleShippingChange}
                            placeholder="e.g. 400001"
                            className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none transition-all duration-300 focus:border-bronze focus:ring-1 focus:ring-bronze/10 placeholder:text-muted/30"
                          />
                          {formErrors.zipCode && <p className="text-[0.68rem] font-body text-red-700 m-0">{formErrors.zipCode}</p>}
                        </div>
                      </div>
                    </div>

                    {/* Shipping option */}
                    <div className="pt-4 border-t border-border/60">
                      <label className="font-body font-normal text-[0.58rem] tracking-[0.16em] uppercase text-muted block mb-3">
                        Shipping Method
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <label className={`border p-4 flex items-center justify-between cursor-pointer rounded-[2px] transition-all duration-300 ${
                          shippingForm.method === "standard" ? "border-bronze bg-bronze/5" : "border-border hover:border-bronze/40"
                        }`}>
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="method"
                              value="standard"
                              checked={shippingForm.method === "standard"}
                              onChange={handleShippingChange}
                              className="accent-bronze"
                            />
                            <div className="text-left">
                              <span className="font-body font-normal text-xs text-ink block">Atelier Standard Delivery</span>
                              <span className="font-body font-light text-[0.65rem] text-muted block">Delivered in 5-8 business days</span>
                            </div>
                          </div>
                          <span className="font-body font-medium text-xs text-bronze uppercase tracking-wider">
                            {checkoutSettings.standardShippingFee === 0 || cartSubtotal >= checkoutSettings.freeShippingThreshold ? "Free" : `₹${checkoutSettings.standardShippingFee}`}
                          </span>
                        </label>

                        <label className={`border p-4 flex items-center justify-between cursor-pointer rounded-[2px] transition-all duration-300 ${
                          shippingForm.method === "express" ? "border-bronze bg-bronze/5" : "border-border hover:border-bronze/40"
                        }`}>
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="method"
                              value="express"
                              checked={shippingForm.method === "express"}
                              onChange={handleShippingChange}
                              className="accent-bronze"
                            />
                            <div className="text-left">
                              <span className="font-body font-normal text-xs text-ink block">White-Glove Express</span>
                              <span className="font-body font-light text-[0.65rem] text-muted block">Delivered in 2-4 business days</span>
                            </div>
                          </div>
                          <span className="font-body font-medium text-xs text-ink">₹{checkoutSettings.expressShippingFee}</span>
                        </label>
                      </div>
                    </div>



                    {/* Billing Address Selection */}
                    <div className="pt-6 border-t border-border/60 space-y-4">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={billingSameAsShipping}
                          onChange={(e) => setBillingSameAsShipping(e.target.checked)}
                          className="w-4.5 h-4.5 accent-bronze cursor-pointer rounded-[2px]"
                        />
                        <span className="font-body text-xs text-ink group-hover:text-bronze transition-colors duration-200 select-none">
                          My billing address is the same as my shipping address
                        </span>
                      </label>

                      {!billingSameAsShipping && (
                        <div className="space-y-6 pt-4 border-t border-border/30 animate-fadeIn">
                          <h4 className="font-display font-light text-base text-ink m-0 pb-1.5 border-b border-border/40">
                            Billing Address Details
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                              <label className="font-body font-normal text-[0.58rem] tracking-[0.16em] uppercase text-muted block mb-1">
                                Full Name
                              </label>
                              <input
                                type="text"
                                name="name"
                                value={billingForm.name}
                                onChange={handleBillingChange}
                                className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none transition-all duration-300 focus:border-bronze focus:ring-1 focus:ring-bronze/10"
                              />
                              {formErrors.billingName && <p className="text-[0.68rem] font-body text-red-700 m-0">{formErrors.billingName}</p>}
                            </div>

                            <div className="space-y-1">
                              <label className="font-body font-normal text-[0.58rem] tracking-[0.16em] uppercase text-muted block mb-1">
                                Phone Number
                              </label>
                              <input
                                type="tel"
                                name="phone"
                                value={billingForm.phone}
                                onChange={handleBillingChange}
                                placeholder="+91 XXXXX XXXXX"
                                className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none transition-all duration-300 focus:border-bronze focus:ring-1 focus:ring-bronze/10 placeholder:text-muted/30"
                              />
                              {formErrors.billingPhone && <p className="text-[0.68rem] font-body text-red-700 m-0">{formErrors.billingPhone}</p>}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="space-y-1">
                              <label className="font-body font-normal text-[0.58rem] tracking-[0.16em] uppercase text-muted block mb-1">
                                Street Address
                              </label>
                              <input
                                type="text"
                                name="street"
                                value={billingForm.street}
                                onChange={handleBillingChange}
                                placeholder="Flat, House no., Building, Company"
                                className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none transition-all duration-300 focus:border-bronze focus:ring-1 focus:ring-bronze/10 placeholder:text-muted/30"
                              />
                              {formErrors.billingStreet && <p className="text-[0.68rem] font-body text-red-700 m-0">{formErrors.billingStreet}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="font-body font-normal text-[0.58rem] tracking-[0.16em] uppercase text-muted block mb-1">
                                  Apartment, suite, unit (Optional)
                                </label>
                                <input
                                  type="text"
                                  name="apartment"
                                  value={billingForm.apartment}
                                  onChange={handleBillingChange}
                                  placeholder="e.g. Apt 4B, Floor 2"
                                  className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none transition-all duration-300 focus:border-bronze focus:ring-1 focus:ring-bronze/10 placeholder:text-muted/30"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="font-body font-normal text-[0.58rem] tracking-[0.16em] uppercase text-muted block mb-1">
                                  Town / City
                                </label>
                                <input
                                  type="text"
                                  name="city"
                                  value={billingForm.city}
                                  onChange={handleBillingChange}
                                  placeholder="e.g. Mumbai"
                                  className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none transition-all duration-300 focus:border-bronze focus:ring-1 focus:ring-bronze/10 placeholder:text-muted/30"
                                />
                                {formErrors.billingCity && <p className="text-[0.68rem] font-body text-red-700 m-0">{formErrors.billingCity}</p>}
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
                                  value={billingForm.state}
                                  onChange={handleBillingChange}
                                  placeholder="e.g. Maharashtra"
                                  className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none transition-all duration-300 focus:border-bronze focus:ring-1 focus:ring-bronze/10 placeholder:text-muted/30"
                                />
                                {formErrors.billingState && <p className="text-[0.68rem] font-body text-red-700 m-0">{formErrors.billingState}</p>}
                              </div>

                              <div className="space-y-1">
                                <label className="font-body font-normal text-[0.58rem] tracking-[0.16em] uppercase text-muted block mb-1">
                                  ZIP / Postal Code
                                </label>
                                <input
                                  type="text"
                                  name="zipCode"
                                  value={billingForm.zipCode}
                                  onChange={handleBillingChange}
                                  placeholder="e.g. 400001"
                                  className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none transition-all duration-300 focus:border-bronze focus:ring-1 focus:ring-bronze/10 placeholder:text-muted/30"
                                />
                                {formErrors.billingZipCode && <p className="text-[0.68rem] font-body text-red-700 m-0">{formErrors.billingZipCode}</p>}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="bg-ink text-cream-muted font-body font-medium text-[0.65rem] tracking-[0.2em] uppercase px-8 py-3.5 mt-2 transition-all duration-300 hover:bg-gold hover:text-dark cursor-pointer rounded-[2px]"
                    >
                      Continue to Payment
                    </button>
                  </form>
                )}
              </div>

              {/* Payment Accordion */}
              <div className="border border-border bg-surface rounded-[3px] overflow-hidden">
                <div className="px-6 py-4 flex items-center gap-3 bg-dark/5 border-b border-border/60">
                  <span className={`w-6 h-6 rounded-full font-body text-xs font-bold flex items-center justify-center ${
                    activeStep === 2 ? "bg-ink text-cream-muted" : "bg-border text-muted"
                  }`}>
                    2
                  </span>
                  <h3 className="font-display font-normal text-lg text-ink m-0">
                    Payment Details
                  </h3>
                </div>

                {activeStep === 2 && (
                  <form onSubmit={handlePaymentSubmit} className="p-6 md:p-8 space-y-6 animate-fadeIn">
                    <div className="space-y-4">
                      <label className="font-body font-normal text-[0.58rem] tracking-[0.16em] uppercase text-muted block mb-1">
                        Select Payment Method
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Option 1: Razorpay */}
                        <label className={`border p-4.5 flex items-start gap-3.5 cursor-pointer rounded-[2px] transition-all duration-300 ${
                          paymentMethod === "razorpay" ? "border-bronze bg-bronze/5" : "border-border hover:border-bronze/40"
                        }`}>
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="razorpay"
                            checked={paymentMethod === "razorpay"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="accent-bronze mt-0.5"
                          />
                          <div className="text-left space-y-1">
                            <span className="font-body font-semibold text-xs text-ink block">Razorpay Online Payment</span>
                            <span className="font-body font-light text-[0.68rem] text-muted block leading-relaxed">
                              Pay securely using Cards, UPI, Netbanking, or digital wallets.
                            </span>
                          </div>
                        </label>

                        {/* Option 2: Cash on Delivery (COD) */}
                        <label className={`border p-4.5 flex items-start gap-3.5 cursor-pointer rounded-[2px] transition-all duration-300 ${
                          paymentMethod === "cod" ? "border-bronze bg-bronze/5" : "border-border hover:border-bronze/40"
                        }`}>
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="cod"
                            checked={paymentMethod === "cod"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="accent-bronze mt-0.5"
                          />
                          <div className="text-left space-y-1">
                            <span className="font-body font-semibold text-xs text-ink block">Cash on Delivery (COD)</span>
                            <span className="font-body font-light text-[0.68rem] text-muted block leading-relaxed">
                              Pay in cash upon physical package delivery.
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-4 items-center">
                      <button
                        type="submit"
                        className="bg-ink text-cream-muted font-body font-medium text-[0.65rem] tracking-[0.2em] uppercase px-8 py-3.5 transition-all duration-300 hover:bg-gold hover:text-dark cursor-pointer rounded-[2px]"
                      >
                        Proceed to Pay (₹{grandTotal.toLocaleString("en-IN")})
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveStep(1)}
                        className="bg-transparent border border-border text-muted font-body font-normal text-[0.65rem] tracking-[0.2em] uppercase px-6 py-3.5 hover:text-ink transition-all duration-300 cursor-pointer rounded-[2px]"
                      >
                        Back to Shipping
                      </button>
                    </div>
                  </form>
                )}
              </div>

            </div>

            {/* Right Column: Checkout Summary Card */}
            <div className="lg:col-span-4 bg-surface border border-border p-6 md:p-8 rounded-[3px] space-y-6">
              <h3 className="font-display font-medium text-[1.2rem] text-ink m-0 pb-4 border-b border-border/80">
                Your Order
              </h3>

              {/* Items List */}
              <div className="divide-y divide-border/60 max-h-60 overflow-y-auto pr-2">
                {cart.map((item) => {
                  const p = products.find((prod) => prod.id === item.id);
                  if (!p) return null;
                  return (
                    <div key={`${item.id}-${item.color}-${item.size}`} className="py-4 flex gap-4 text-[0.78rem] font-body items-start">
                      <img src={p.images?.[0]} alt={p.name} className="w-12 h-12 object-cover border border-border/60 bg-background" />
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-ink block truncate">{p.name}</span>
                        <div className="flex gap-2 text-[0.68rem] text-muted font-light mt-0.5">
                          {item.color && <span>Col: {item.color}</span>}
                          {item.size && <span>Size: {item.size}</span>}
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <span className="font-medium text-ink">₹{(p.price * item.quantity).toLocaleString("en-IN")}</span>
                    </div>
                  );
                })}
              </div>

              {/* Promo Code Input Form */}
              <div className="border-t border-border/60 pt-4.5 space-y-2">
                <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block mb-1 font-medium">Promo Code</label>
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="e.g. WELCOME10"
                    disabled={isApplyingPromo}
                    className="flex-1 bg-background border border-border px-3 py-2 font-body text-xs text-ink outline-none focus:border-bronze rounded-[2px] uppercase"
                  />
                  <button
                    type="submit"
                    disabled={isApplyingPromo || !promoCode.trim()}
                    className="px-4 bg-ink hover:bg-bronze text-background font-body font-medium text-[0.62rem] tracking-wider uppercase border-0 cursor-pointer transition-colors duration-200 rounded-[2px] disabled:opacity-40"
                  >
                    {isApplyingPromo ? "..." : "Apply"}
                  </button>
                </form>

                {promoError && (
                  <p className="font-body text-[0.68rem] text-red-700 m-0">{promoError}</p>
                )}
                {promoSuccess && (
                  <p className="font-body text-[0.68rem] text-emerald-800 m-0 font-medium">{promoSuccess}</p>
                )}
              </div>

              {/* Price Details */}
              <div className="border-t border-border/60 pt-4 space-y-3 font-body text-[0.78rem]">
                <div className="flex justify-between items-center text-muted">
                  <span className="font-light">Subtotal</span>
                  <span className="font-medium text-ink">₹{cartSubtotal.toLocaleString("en-IN")}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between items-center text-emerald-800 font-medium">
                    <span className="font-light">Discount ({appliedPromo?.code})</span>
                    <span className="font-medium">-₹{discountAmount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-muted">
                  <span className="font-light">Shipping</span>
                  {shippingCost > 0 ? (
                    <span className="font-medium text-ink">₹{shippingCost}</span>
                  ) : (
                    <span className="font-medium text-bronze uppercase tracking-wider text-[0.68rem]">Complimentary</span>
                  )}
                </div>
              </div>

              <div className="border-t border-border/80 pt-4 flex justify-between items-end">
                <span className="font-display font-medium text-[1.15rem] text-ink m-0">Grand Total</span>
                <span className="font-display font-semibold text-[1.35rem] text-ink leading-none">
                  ₹{grandTotal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

          </div>
        )}
      </div>

      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.35s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default CheckoutPage;
