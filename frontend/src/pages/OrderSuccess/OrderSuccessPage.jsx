import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../../services/api";

const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/orders/${orderId}`);
        setOrder(res.data);
      } catch (err) {
        console.error("Failed to load order:", err);
        setError("We couldn't retrieve the details of your order. It may not exist or you may not have permission to view it.");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 pt-20">
        <div className="font-body text-xs text-muted tracking-widest uppercase animate-pulse">
          Retrieving receipt details...
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 pt-20 text-center">
        <h2 className="font-display font-light text-3xl text-ink mb-4">Receipt Not Found</h2>
        <p className="font-body text-muted text-sm mb-8 max-w-md leading-relaxed">
          {error || "The order receipt you are trying to view is unavailable."}
        </p>
        <Link
          to="/"
          className="font-body font-medium text-[0.62rem] tracking-[0.2em] uppercase bg-ink hover:bg-bronze text-background px-8 py-3.5 transition-colors duration-300 no-underline rounded-[2px]"
        >
          Return to Atelier
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-[76px] pb-16 px-6 md:px-14">
      <div className="max-w-3xl mx-auto py-12 md:py-16">
        
        {/* Success header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-full bg-bronze/10 border border-bronze/20 text-bronze flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="flex items-center justify-center gap-2.5 mb-3">
            <span className="block w-5 h-px bg-bronze" />
            <span className="font-body font-normal text-[0.55rem] tracking-[0.38em] uppercase text-bronze">
              Order Confirmed
            </span>
            <span className="block w-5 h-px bg-bronze" />
          </div>
          <h1 className="font-display font-light text-4xl text-ink leading-tight m-0">
            Thank you for your purchase
          </h1>
          <p className="font-body font-light text-[0.8rem] text-muted mt-3">
            Your receipt number is <strong className="text-ink font-medium tracking-wide">{order.orderId}</strong>. A verification email has been sent.
          </p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Shipping Summary */}
          <div className="bg-surface border border-border p-6 rounded-[2px] flex flex-col justify-between">
            <div>
              <h3 className="font-body font-normal text-[0.62rem] tracking-[0.18em] uppercase text-muted mb-4 border-b border-border pb-2">
                Shipping Summary
              </h3>
              <div className="font-body text-xs text-ink space-y-2">
                <p className="font-medium">{order.shippingDetails.name}</p>
                <p className="font-light text-muted leading-relaxed whitespace-pre-line">
                  {typeof order.shippingDetails.address === "object"
                    ? `${order.shippingDetails.address.street}${order.shippingDetails.address.apartment ? `, ${order.shippingDetails.address.apartment}` : ""}\n${order.shippingDetails.address.city}, ${order.shippingDetails.address.state} ${order.shippingDetails.address.zipCode}`
                    : order.shippingDetails.address}
                </p>
                <p className="font-light">Phone: {order.shippingDetails.phone}</p>
              </div>
            </div>
            <p className="font-body font-light text-[0.68rem] text-bronze capitalize tracking-wide mt-4 pt-2 border-t border-border/40">Delivery: {order.shippingDetails.method} Shipping</p>
          </div>

          {/* Billing Summary */}
          <div className="bg-surface border border-border p-6 rounded-[2px]">
            <h3 className="font-body font-normal text-[0.62rem] tracking-[0.18em] uppercase text-muted mb-4 border-b border-border pb-2">
              Billing Summary
            </h3>
            {order.billingDetails ? (
              <div className="font-body text-xs text-ink space-y-2">
                <p className="font-medium">{order.billingDetails.name}</p>
                <p className="font-light text-muted leading-relaxed whitespace-pre-line">
                  {typeof order.billingDetails.address === "object"
                    ? `${order.billingDetails.address.street}${order.billingDetails.address.apartment ? `, ${order.billingDetails.address.apartment}` : ""}\n${order.billingDetails.address.city}, ${order.billingDetails.address.state} ${order.billingDetails.address.zipCode}`
                    : order.billingDetails.address}
                </p>
                <p className="font-light">Phone: {order.billingDetails.phone}</p>
              </div>
            ) : (
              <div className="font-body text-xs text-muted italic">
                Same as shipping address
              </div>
            )}
          </div>

          {/* Payment Summary */}
          <div className="bg-surface border border-border p-6 rounded-[2px] flex flex-col justify-between">
            <div>
              <h3 className="font-body font-normal text-[0.62rem] tracking-[0.18em] uppercase text-muted mb-4 border-b border-border pb-2">
                Payment Summary
              </h3>
              <div className="font-body text-xs text-ink space-y-2">
                <p className="font-light">Method: <strong className="font-medium text-ink">{order.paymentDetails?.paymentMethod || "Online Payment"}</strong></p>
                {(order.paymentDetails?.transactionToken || order.paymentDetails?.razorpayPaymentId) && (
                  <p className="font-light font-mono text-[0.65rem] text-muted break-all">Transaction ID: {order.paymentDetails.transactionToken || order.paymentDetails.razorpayPaymentId}</p>
                )}
              </div>
            </div>
            <p className="font-body font-light text-[0.68rem] text-muted mt-4 pt-2 border-t border-border/40">Purchased on: {order.date}</p>
          </div>
        </div>

        {/* Purchase Items List */}
        <div className="bg-surface border border-border p-6 rounded-[2px] mb-8">
          <h3 className="font-body font-normal text-[0.62rem] tracking-[0.18em] uppercase text-muted mb-6 border-b border-border pb-2">
            Items Ordered
          </h3>
          <div className="divide-y divide-border/60">
            {order.products.map((p, idx) => (
              <div key={idx} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-16 h-20 object-cover border border-border/80 bg-background"
                />
                <div className="flex-1 flex justify-between">
                  <div className="space-y-1">
                    <h4 className="font-display font-light text-sm text-ink m-0">{p.name}</h4>
                    <div className="flex gap-4 font-body text-[0.68rem] text-muted font-light">
                      {p.color && <p>Color: {p.color}</p>}
                      {p.size && <p>Size: {p.size}</p>}
                      <p>Qty: {p.quantity}</p>
                    </div>
                  </div>
                  <p className="font-body text-xs font-medium text-ink">
                    ₹{p.price.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cost breakdown */}
        <div className="bg-surface border border-border p-6 rounded-[2px] mb-12">
          <h3 className="font-body font-normal text-[0.62rem] tracking-[0.18em] uppercase text-muted mb-6 border-b border-border pb-2">
            Total Breakdown
          </h3>
          <div className="font-body text-xs text-ink space-y-3.5">
            <div className="flex justify-between items-center font-light">
              <span className="text-muted">Subtotal</span>
              <span>₹{order.pricingBreakdown.subtotal.toLocaleString("en-IN")}</span>
            </div>
            {order.pricingBreakdown.discount > 0 && (
              <div className="flex justify-between items-center text-emerald-700 font-light">
                <span>Discount</span>
                <span>-₹{order.pricingBreakdown.discount.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between items-center font-light">
              <span className="text-muted">Shipping</span>
              <span>{order.pricingBreakdown.shipping === 0 ? "Free" : `₹${order.pricingBreakdown.shipping.toLocaleString("en-IN")}`}</span>
            </div>
            <div className="border-t border-border/60 pt-3.5 flex justify-between items-center font-medium text-sm text-ink">
              <span>Grand Total</span>
              <span className="text-base text-ink">₹{order.pricingBreakdown.total.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/shop"
            className="font-body font-medium text-[0.62rem] tracking-[0.2em] uppercase bg-ink hover:bg-bronze text-background px-8 py-3.5 transition-colors duration-300 no-underline text-center rounded-[2px]"
          >
            Continue Shopping
          </Link>
          <Link
            to="/profile"
            className="font-body font-medium text-[0.62rem] tracking-[0.2em] uppercase border border-border hover:border-bronze text-ink hover:text-bronze px-8 py-3.5 transition-all duration-300 no-underline text-center rounded-[2px]"
          >
            View My Orders
          </Link>
        </div>

      </div>
    </div>
  );
};

export default OrderSuccessPage;
