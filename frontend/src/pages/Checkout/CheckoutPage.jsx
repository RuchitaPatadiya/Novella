import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { products } from "../../utils/mockData";
import API from "../../services/api";

const CheckoutPage = () => {
  const { user, updateProfile } = useAuth();
  const { cart, clearCart, cartSubtotal } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to login if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: location } });
    }
  }, [user, navigate, location]);

  const discountPercent = location.state?.discountPercent || 0;

  // Checkout states
  const [activeStep, setActiveStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success
  const [shippingForm, setShippingForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    method: "standard", // standard or express
  });

  const [paymentForm, setPaymentForm] = useState({
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("");
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  if (!user) return null;

  // Calculate pricing details
  const discountAmount = (cartSubtotal * discountPercent) / 100;
  const shippingCost = shippingForm.method === "express" ? 500 : 0;
  const grandTotal = cartSubtotal - discountAmount + shippingCost;

  const handleShippingChange = (e) => {
    setShippingForm({ ...shippingForm, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: "" });
  };

  const handlePaymentChange = (e) => {
    let { name, value } = e.target;

    // Formatting inputs
    if (name === "cardNumber") {
      value = value.replace(/\s?/g, "").replace(/(\d{4})/g, "$1 ").trim();
      if (value.length > 19) return;
    }
    if (name === "cardExpiry") {
      value = value.replace(/\//g, "");
      if (value.length > 2) {
        value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
      }
      if (value.length > 5) return;
    }
    if (name === "cardCvv") {
      value = value.replace(/\D/g, "");
      if (value.length > 3) return;
    }

    setPaymentForm({ ...paymentForm, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" });
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!shippingForm.name.trim()) errors.name = "Full name is required.";
    if (!shippingForm.email.trim()) errors.email = "Email address is required.";
    if (!shippingForm.phone.trim()) errors.phone = "Phone number is required.";
    if (!shippingForm.address.trim()) errors.address = "Shipping address is required.";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setActiveStep(2);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!paymentForm.cardName.trim()) errors.cardName = "Cardholder name is required.";
    if (paymentForm.cardNumber.replace(/\s/g, "").length < 16) {
      errors.cardNumber = "Enter a valid 16-digit card number.";
    }
    if (paymentForm.cardExpiry.length < 5) {
      errors.cardExpiry = "Enter a valid expiry date (MM/YY).";
    }
    if (paymentForm.cardCvv.length < 3) {
      errors.cardCvv = "CVV must be 3 digits.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    processOrderPlacement();
  };

  // Simulated payment processing steps for rich aesthetics
  const processOrderPlacement = () => {
    setIsProcessing(true);
    const statuses = [
      "Verifying payment authorization...",
      "Securing connection with gate...",
      "Registering order details in Novella registry...",
      "Configuring shipping logistics...",
    ];

    let currentStatusIdx = 0;
    setProcessingStatus(statuses[0]);

    const interval = setInterval(() => {
      currentStatusIdx++;
      if (currentStatusIdx < statuses.length) {
        setProcessingStatus(statuses[currentStatusIdx]);
      } else {
        clearInterval(interval);
        finalizeOrder();
      }
    }, 900);
  };

  const finalizeOrder = async () => {
    const orderId = `NV-${Math.floor(1000 + Math.random() * 9000)}`;
    const itemsDescription = cart
      .map((item) => {
        const p = products.find((prod) => prod.id === item.id);
        return `${p ? p.name : "Curated Product"} (x${item.quantity})`;
      })
      .join(", ");

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
        address: shippingForm.address,
        phone: shippingForm.phone,
        method: shippingForm.method
      },
      paymentDetails: {
        cardName: paymentForm.cardName,
        cardNumber: `•••• •••• •••• ${paymentForm.cardNumber.slice(-4)}`
      },
      pricingBreakdown: {
        subtotal: cartSubtotal,
        discount: discountAmount,
        shipping: shippingCost,
        total: grandTotal
      }
    };

    try {
      // Save order to the live Order database collection
      await API.post("/orders", {
        orderId: newOrder.id,
        date: newOrder.date,
        total: newOrder.total,
        items: newOrder.items,
        products: newOrder.products,
        shippingDetails: newOrder.shippingDetails,
        paymentDetails: newOrder.paymentDetails,
        pricingBreakdown: newOrder.pricingBreakdown,
      });

      // Also save current address & phone as defaults if not already set
      await updateProfile({
        address: user.address || shippingForm.address,
        phone: user.phone || shippingForm.phone,
      });

      setConfirmedOrder(newOrder);
      clearCart();
      setIsProcessing(false);
      setActiveStep(3);
    } catch (err) {
      console.error("Order processing failed:", err);
      setIsProcessing(false);
    }
  };

  if (activeStep === 3 && confirmedOrder) {
    return (
      <div className="min-h-screen bg-background pt-[76px] flex items-center justify-center px-6 md:px-14 py-16">
        <div className="w-full max-w-xl bg-surface border border-border p-8 md:p-12 text-center relative overflow-hidden animate-fadeIn">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-bronze via-gold to-bronze" />

          {/* Success Icon */}
          <div className="w-16 h-16 rounded-full bg-bronze/10 border border-bronze/20 text-bronze flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div className="flex items-center justify-center gap-2.5 mb-3">
            <span className="block w-5 h-px bg-bronze" />
            <span className="font-body font-normal text-[0.55rem] tracking-[0.38em] uppercase text-bronze">
              Order Confirmed
            </span>
            <span className="block w-5 h-px bg-bronze" />
          </div>

          <h1 className="font-display font-light text-3xl md:text-4xl text-ink leading-tight mb-4">
            Thank you for your order
          </h1>

          <p className="font-body font-light text-[0.85rem] text-muted leading-relaxed max-w-md mx-auto mb-8">
            Your payment was authorized, and order <strong className="text-ink font-medium">{confirmedOrder.id}</strong> has been registered. We’ve sent a confirmation summary and shipping tracking details to your email.
          </p>

          {/* Details list */}
          <div className="bg-background border border-border p-6 text-left space-y-3 mb-8 font-body text-xs text-ink/80">
            <div className="flex justify-between">
              <span className="text-muted font-light">Order ID:</span>
              <span className="font-medium">{confirmedOrder.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted font-light">Delivery Estimate:</span>
              <span className="font-medium">4 - 7 Business Days</span>
            </div>
            <div className="flex justify-between border-t border-border/60 pt-3 text-sm">
              <span className="text-muted font-light">Grand Total:</span>
              <span className="text-bronze font-semibold">{confirmedOrder.total}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/profile" className="no-underline">
              <button className="w-full sm:w-auto bg-ink text-cream-muted font-body font-medium text-[0.65rem] tracking-[0.2em] uppercase px-8 py-3.5 hover:bg-gold hover:text-dark transition-all duration-300 cursor-pointer">
                View Account Orders
              </button>
            </Link>
            <Link to="/shop" className="no-underline">
              <button className="w-full sm:w-auto bg-transparent border border-border text-ink hover:border-bronze hover:text-bronze font-body font-medium text-[0.65rem] tracking-[0.2em] uppercase px-8 py-3.5 transition-all duration-300 cursor-pointer">
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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

      {/* Breadcrumbs */}
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

                    <div className="space-y-1">
                      <label className="font-body font-normal text-[0.58rem] tracking-[0.16em] uppercase text-muted block mb-1">
                        Shipping Address
                      </label>
                      <textarea
                        name="address"
                        value={shippingForm.address}
                        onChange={handleShippingChange}
                        rows="3"
                        placeholder="House/Apartment no., Street, City, State, ZIP code"
                        className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none transition-all duration-300 resize-none focus:border-bronze focus:ring-1 focus:ring-bronze/10 placeholder:text-muted/30"
                      />
                      {formErrors.address && <p className="text-[0.68rem] font-body text-red-700 m-0">{formErrors.address}</p>}
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
                          <span className="font-body font-medium text-xs text-bronze uppercase tracking-wider">Free</span>
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
                          <span className="font-body font-medium text-xs text-ink">₹500</span>
                        </label>
                      </div>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="font-body font-normal text-[0.58rem] tracking-[0.16em] uppercase text-muted block mb-1">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          name="cardName"
                          value={paymentForm.cardName}
                          onChange={handlePaymentChange}
                          placeholder="e.g. Eleanor Vance"
                          className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none transition-all duration-300 focus:border-bronze focus:ring-1 focus:ring-bronze/10 placeholder:text-muted/30"
                        />
                        {formErrors.cardName && <p className="text-[0.68rem] font-body text-red-700 m-0">{formErrors.cardName}</p>}
                      </div>

                      <div className="space-y-1">
                        <label className="font-body font-normal text-[0.58rem] tracking-[0.16em] uppercase text-muted block mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={paymentForm.cardNumber}
                          onChange={handlePaymentChange}
                          placeholder="XXXX XXXX XXXX XXXX"
                          className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none transition-all duration-300 focus:border-bronze focus:ring-1 focus:ring-bronze/10 placeholder:text-muted/30"
                        />
                        {formErrors.cardNumber && <p className="text-[0.68rem] font-body text-red-700 m-0">{formErrors.cardNumber}</p>}
                      </div>

                      <div className="space-y-1">
                        <label className="font-body font-normal text-[0.58rem] tracking-[0.16em] uppercase text-muted block mb-1">
                          Expiry Date (MM/YY)
                        </label>
                        <input
                          type="text"
                          name="cardExpiry"
                          value={paymentForm.cardExpiry}
                          onChange={handlePaymentChange}
                          placeholder="MM/YY"
                          className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none transition-all duration-300 focus:border-bronze focus:ring-1 focus:ring-bronze/10 placeholder:text-muted/30"
                        />
                        {formErrors.cardExpiry && <p className="text-[0.68rem] font-body text-red-700 m-0">{formErrors.cardExpiry}</p>}
                      </div>

                      <div className="space-y-1">
                        <label className="font-body font-normal text-[0.58rem] tracking-[0.16em] uppercase text-muted block mb-1">
                          CVV
                        </label>
                        <input
                          type="password"
                          name="cardCvv"
                          value={paymentForm.cardCvv}
                          onChange={handlePaymentChange}
                          placeholder="•••"
                          className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none transition-all duration-300 focus:border-bronze focus:ring-1 focus:ring-bronze/10 placeholder:text-muted/30"
                        />
                        {formErrors.cardCvv && <p className="text-[0.68rem] font-body text-red-700 m-0">{formErrors.cardCvv}</p>}
                      </div>
                    </div>

                    <div className="flex gap-4 items-center">
                      <button
                        type="submit"
                        className="bg-ink text-cream-muted font-body font-medium text-[0.65rem] tracking-[0.2em] uppercase px-8 py-3.5 transition-all duration-300 hover:bg-gold hover:text-dark cursor-pointer rounded-[2px]"
                      >
                        Place Order (₹{grandTotal.toLocaleString("en-IN")})
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

              {/* Price Details */}
              <div className="border-t border-border/60 pt-4 space-y-3 font-body text-[0.78rem]">
                <div className="flex justify-between items-center text-muted">
                  <span className="font-light">Subtotal</span>
                  <span className="font-medium text-ink">₹{cartSubtotal.toLocaleString("en-IN")}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between items-center text-emerald-700">
                    <span className="font-light">Discount ({discountPercent}%)</span>
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
