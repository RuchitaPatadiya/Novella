import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../services/api";

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get(`/orders/${orderId}`);
      setOrder(res.data);
    } catch (err) {
      console.error("Failed to load order details:", err);
      setError(err.response?.data?.message || "Failed to retrieve order details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && orderId) {
      fetchOrder();
    }
  }, [user, orderId]);

  const handleCancelOrder = async () => {
    if (window.confirm("Are you sure you want to cancel this order? This action cannot be undone.")) {
      try {
        setActionLoading(true);
        await API.put(`/orders/${orderId}/cancel`);
        alert("Your order has been successfully cancelled. Refund details have been sent to your email.");
        fetchOrder();
      } catch (err) {
        alert(err.response?.data?.message || "Failed to cancel order.");
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleReturnOrder = async () => {
    if (window.confirm("Are you sure you want to return this order? We will send a pre-paid shipping label guidelines to your email.")) {
      try {
        setActionLoading(true);
        await API.put(`/orders/${orderId}/return`);
        alert("Return request successfully submitted. Check your inbox for label instructions.");
        fetchOrder();
      } catch (err) {
        alert(err.response?.data?.message || "Failed to submit return request.");
      } finally {
        setActionLoading(false);
      }
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-bronze border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-body text-xs tracking-widest uppercase text-muted">Retrieving Order Details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-20 px-6">
        <div className="max-w-2xl mx-auto text-center py-16 bg-surface border border-border rounded-[24px]">
          <p className="font-display font-light italic text-[1.5rem] text-muted mb-6">
            {error || "Order not found."}
          </p>
          <Link
            to="/profile"
            className="font-body text-[0.68rem] tracking-[0.2em] uppercase text-background bg-ink px-8 py-3.5 hover:bg-bronze transition-colors duration-300 rounded-[4px]"
          >
            Back to Profile
          </Link>
        </div>
      </div>
    );
  }

  // Stepper timeline calculation
  const steps = [
    { label: "Ordered", date: order.date, completed: true },
    { label: "Prepared", date: order.date, completed: order.status !== "Cancelled" },
    { label: "Shipped", date: order.date, completed: order.status === "Shipped" || order.status === "Delivered" },
    { label: "Delivered", date: order.status === "Delivered" ? order.date : "Estimated 4-7 days", completed: order.status === "Delivered" }
  ];

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6 md:px-14 animate-fadeIn">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Back Link */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 bg-transparent border-0 text-ink/70 hover:text-bronze font-body text-xs tracking-wider uppercase cursor-pointer transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Dashboard
          </button>
        </div>

        {/* Order Header Card */}
        <div className="bg-surface border border-border p-8 relative overflow-hidden rounded-[24px]">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-bronze/40" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="block w-4 h-px bg-bronze" />
                <span className="font-body font-normal text-[0.55rem] tracking-[0.38em] uppercase text-bronze">
                  Order Tracking
                </span>
              </div>
              <h1 className="font-display font-light text-3xl text-ink m-0 leading-tight">
                {order.orderId}
              </h1>
              <p className="font-body font-light text-xs text-muted mt-2 m-0">
                Placed on {order.date} · Payment Method: <span className="text-ink font-medium uppercase">{order.paymentMethod || "Card"}</span>
              </p>
            </div>
            
            <div className="text-left sm:text-right space-y-1">
              <span className="font-body text-[0.58rem] tracking-[0.16em] uppercase text-muted block">
                Total Price
              </span>
              <p className="font-display text-2xl text-ink m-0 font-light">
                ₹{order.pricingBreakdown?.total?.toLocaleString("en-IN") || order.total?.toLocaleString("en-IN")}
              </p>
              <span className={`inline-block text-[0.55rem] font-body tracking-widest uppercase px-3 py-1 font-semibold rounded-full border mt-1.5 ${
                order.status === "Cancelled"
                  ? "bg-red-50 text-red-700 border-red-200"
                  : order.status === "Returned"
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-bronze/5 text-bronze border-bronze/25"
              }`}>
                {order.status}
              </span>
            </div>
          </div>

          {/* Stepper Timeline */}
          {order.status !== "Cancelled" && order.status !== "Returned" && (
            <div className="border-t border-border/60 mt-8 pt-8 pb-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative">
                
                {/* Connector Line for Desktop */}
                <div className="absolute left-[12%] right-[12%] top-3.5 h-[2px] bg-border z-0 hidden md:block" />
                
                {/* Nodes */}
                {steps.map((step, idx) => (
                  <div key={step.label} className="flex flex-col items-center text-center z-10 relative">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border font-body text-xs transition-all duration-300 ${
                      step.completed
                        ? "bg-bronze border-bronze text-background"
                        : "bg-background border-border text-muted"
                    }`}>
                      {step.completed ? "✓" : idx + 1}
                    </div>
                    <span className="font-body font-medium text-[0.62rem] tracking-wider uppercase text-ink mt-3">
                      {step.label}
                    </span>
                    <span className="font-body font-light text-[0.55rem] text-muted mt-0.5">
                      {step.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cancelled/Returned Feedback */}
          {order.status === "Cancelled" && (
            <div className="bg-red-50/60 border border-red-200 p-5 rounded-[12px] mt-6 flex gap-4 text-xs font-body text-red-800">
              <svg className="w-5 h-5 text-red-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold m-0 uppercase tracking-wider text-[0.62rem] mb-1">Order Cancelled</p>
                <p className="m-0 text-red-700/85">This order has been cancelled. If payment was charged, a refund of ₹{(order.pricingBreakdown?.total || order.total).toLocaleString("en-IN")} will be credited back to your payment source within 3-5 business days.</p>
              </div>
            </div>
          )}

          {order.status === "Returned" && (
            <div className="bg-amber-50/60 border border-amber-200 p-5 rounded-[12px] mt-6 flex gap-4 text-xs font-body text-amber-800">
              <svg className="w-5 h-5 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.5" />
              </svg>
              <div>
                <p className="font-semibold m-0 uppercase tracking-wider text-[0.62rem] mb-1">Item Returned</p>
                <p className="m-0 text-amber-700/85">Return guidelines and pre-paid shipping labels have been sent to your email. Once the curated pieces are returned to our atelier, your refund will be processed.</p>
              </div>
            </div>
          )}
        </div>

        {/* Detailed Grid: Left Info details, Right items summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Block: Shipping & Payments details */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-surface border border-border p-6 rounded-[20px] space-y-4">
              <h4 className="font-display font-normal text-base text-ink m-0 pb-2 border-b border-border/50">
                Delivery Details
              </h4>
              
              <div className="space-y-1.5 font-body text-xs">
                <label className="text-[0.55rem] uppercase tracking-wider text-muted font-normal">Recipient</label>
                <p className="font-medium text-ink m-0">{order.shippingDetails?.name}</p>
              </div>

              <div className="space-y-1.5 font-body text-xs">
                <label className="text-[0.55rem] uppercase tracking-wider text-muted font-normal">Contact Phone</label>
                <p className="font-medium text-ink m-0">{order.shippingDetails?.phone}</p>
              </div>

              <div className="space-y-1.5 font-body text-xs">
                <label className="text-[0.55rem] uppercase tracking-wider text-muted font-normal">Shipping Address</label>
                <div className="text-ink leading-relaxed space-y-0.5">
                  {typeof order.shippingDetails?.address === "object" ? (
                    <>
                      <p className="m-0">{order.shippingDetails.address.street}{order.shippingDetails.address.apartment ? `, ${order.shippingDetails.address.apartment}` : ""}</p>
                      <p className="m-0">{order.shippingDetails.address.city}, {order.shippingDetails.address.state} {order.shippingDetails.address.zipCode}</p>
                    </>
                  ) : (
                    <p className="m-0">{order.shippingDetails?.address}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Billing Details */}
            <div className="bg-surface border border-border p-6 rounded-[20px] space-y-4 animate-fadeIn">
              <h4 className="font-display font-normal text-base text-ink m-0 pb-2 border-b border-border/50">
                Billing Details
              </h4>
              
              {order.billingDetails ? (
                <>
                  <div className="space-y-1.5 font-body text-xs">
                    <label className="text-[0.55rem] uppercase tracking-wider text-muted font-normal">Billing Recipient</label>
                    <p className="font-medium text-ink m-0">{order.billingDetails.name}</p>
                  </div>

                  <div className="space-y-1.5 font-body text-xs">
                    <label className="text-[0.55rem] uppercase tracking-wider text-muted font-normal">Contact Phone</label>
                    <p className="font-medium text-ink m-0">{order.billingDetails.phone}</p>
                  </div>

                  <div className="space-y-1.5 font-body text-xs">
                    <label className="text-[0.55rem] uppercase tracking-wider text-muted font-normal">Billing Address</label>
                    <div className="text-ink leading-relaxed space-y-0.5">
                      {typeof order.billingDetails.address === "object" ? (
                        <>
                          <p className="m-0">{order.billingDetails.address.street}{order.billingDetails.address.apartment ? `, ${order.billingDetails.address.apartment}` : ""}</p>
                          <p className="m-0">{order.billingDetails.address.city}, {order.billingDetails.address.state} {order.billingDetails.address.zipCode}</p>
                        </>
                      ) : (
                        <p className="m-0">{order.billingDetails.address}</p>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <p className="font-body text-xs text-muted italic m-0">Same as shipping address</p>
              )}
            </div>

            {/* Payment Details */}
            <div className="bg-surface border border-border p-6 rounded-[20px] space-y-4 animate-fadeIn">
              <h4 className="font-display font-normal text-base text-ink m-0 pb-2 border-b border-border/50">
                Payment Summary
              </h4>
              
              <div className="space-y-1.5 font-body text-xs">
                <label className="text-[0.55rem] uppercase tracking-wider text-muted font-normal">Payment Method</label>
                <p className="font-medium text-ink m-0">{order.paymentDetails?.paymentMethod || "Online Payment"}</p>
              </div>

              <div className="space-y-1.5 font-body text-xs">
                <label className="text-[0.55rem] uppercase tracking-wider text-muted font-normal">Payment Status</label>
                <p className={`font-semibold m-0 ${
                  order.paymentDetails?.paymentStatus === "Paid" ? "text-emerald-700" : "text-amber-700"
                }`}>
                  {order.paymentDetails?.paymentStatus || "Pending"}
                </p>
              </div>

              {(order.paymentDetails?.transactionToken || order.paymentDetails?.razorpayPaymentId) && (
                <div className="space-y-1.5 font-body text-xs">
                  <label className="text-[0.55rem] uppercase tracking-wider text-muted font-normal">Transaction ID</label>
                  <p className="font-mono text-[0.68rem] text-muted break-all m-0">{order.paymentDetails.transactionToken || order.paymentDetails.razorpayPaymentId}</p>
                </div>
              )}
            </div>

            {/* Actions card */}
            {order.status !== "Cancelled" && order.status !== "Returned" && (
              <div className="bg-surface border border-border p-6 rounded-[20px]">
                {order.status === "Delivered" ? (
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={handleReturnOrder}
                    className="w-full bg-transparent hover:bg-bronze hover:text-white text-bronze border border-bronze/50 font-body font-medium text-[0.62rem] tracking-[0.2em] uppercase py-3 cursor-pointer transition-all duration-300 rounded-[4px]"
                  >
                    {actionLoading ? "Processing..." : "Request Return"}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={handleCancelOrder}
                    className="w-full bg-transparent hover:bg-red-600 hover:text-white text-red-600 border border-red-200 font-body font-medium text-[0.62rem] tracking-[0.2em] uppercase py-3 cursor-pointer transition-all duration-300 rounded-[4px]"
                  >
                    {actionLoading ? "Processing..." : "Cancel Order"}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right Block: Ordered Items and Receipt summary */}
          <div className="lg:col-span-8 space-y-6">
            
            <div className="bg-surface border border-border p-6 rounded-[20px] space-y-6">
              <h4 className="font-display font-normal text-base text-ink m-0 pb-2 border-b border-border/50">
                Ordered Pieces
              </h4>
              
              <div className="divide-y divide-border/40">
                {order.products && order.products.map((p, idx) => (
                  <div key={idx} className="py-4 flex gap-4 text-xs font-body items-start">
                    <div className="w-16 h-16 bg-background border border-border rounded-[8px] overflow-hidden shrink-0 flex items-center justify-center p-1">
                      <img src={p.image} alt={p.name} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="flex-grow space-y-0.5">
                      <p className="font-display font-light text-sm text-ink m-0 leading-tight pr-4">{p.name}</p>
                      <p className="text-muted text-[0.68rem] m-0">Qty: {p.quantity}</p>
                      {(p.color || p.size) && (
                        <p className="text-[0.65rem] text-muted/80 m-0">
                          {p.color && `Color: ${p.color}`} {p.size && `· Size: ${p.size}`}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-medium text-ink m-0">₹{(p.price * p.quantity).toLocaleString("en-IN")}</p>
                      {p.quantity > 1 && <p className="text-muted text-[0.62rem] m-0">₹{p.price.toLocaleString("en-IN")} each</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Summary Card */}
            <div className="bg-surface border border-border p-6 rounded-[20px] space-y-4">
              <h4 className="font-display font-normal text-base text-ink m-0 pb-2 border-b border-border/50">
                Receipt Summary
              </h4>

              <div className="space-y-3 font-body text-xs text-ink/80">
                <div className="flex justify-between">
                  <span className="text-muted">Subtotal</span>
                  <span>₹{order.pricingBreakdown?.subtotal?.toLocaleString("en-IN") || order.total?.toLocaleString("en-IN")}</span>
                </div>
                
                {order.pricingBreakdown?.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount {order.pricingBreakdown.promoCode && `(${order.pricingBreakdown.promoCode})`}</span>
                    <span>- ₹{order.pricingBreakdown.discount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-muted">Shipping</span>
                  <span>{order.pricingBreakdown?.shipping === 0 ? "Complimentary" : `₹${order.pricingBreakdown?.shipping?.toLocaleString("en-IN")}`}</span>
                </div>

                <div className="border-t border-border/60 my-1 pt-3 flex justify-between font-display font-normal text-base text-ink">
                  <span>Grand Total</span>
                  <span className="text-bronze">₹{(order.pricingBreakdown?.total || order.total)?.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default OrderDetailPage;
