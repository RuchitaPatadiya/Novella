import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

const CartSummary = () => {
  const { cartSubtotal } = useCart();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const code = promoCode.trim().toUpperCase();
    if (!code) return;

    if (code === "WELCOME10" || code === "NOVELLA10") {
      setDiscountPercent(10);
      setSuccessMsg("10% discount applied successfully!");
    } else {
      setErrorMsg("Invalid promotional code.");
      setDiscountPercent(0);
    }
  };

  const shippingCost = 0; // Free shipping
  const discountAmount = (cartSubtotal * discountPercent) / 100;
  const estimatedGst = (cartSubtotal - discountAmount) * 0.18; // 18% GST (indicated as included)
  const total = cartSubtotal - discountAmount + shippingCost;

  return (
    <div className="bg-surface border border-border p-6 sm:p-8 flex flex-col rounded-[3px]">
      <h3 className="font-display font-medium text-[1.2rem] text-ink m-0 pb-4 border-b border-border/80">
        Order Summary
      </h3>

      {/* Pricing Slices */}
      <div className="flex flex-col gap-3.5 py-6 border-b border-border/60 font-body text-[0.8rem]">
        <div className="flex justify-between items-center text-muted">
          <span className="font-light">Subtotal</span>
          <span className="font-medium text-ink">₹{cartSubtotal.toLocaleString("en-IN")}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between items-center text-emerald-700">
            <span className="font-light">Promo Code Discount ({discountPercent}%)</span>
            <span className="font-medium">-₹{discountAmount.toLocaleString("en-IN")}</span>
          </div>
        )}

        <div className="flex justify-between items-center text-muted">
          <span className="font-light">Shipping</span>
          <span className="font-medium text-ink uppercase tracking-wider text-[0.7rem] text-bronze">
            Complimentary
          </span>
        </div>

        <div className="flex justify-between items-center text-muted">
          <span className="font-light">Estimated GST (18%)</span>
          <span className="font-light italic text-[0.72rem]">Included</span>
        </div>
      </div>

      {/* Promo Code Input */}
      <form onSubmit={handleApplyPromo} className="py-6 border-b border-border/60">
        <label htmlFor="promo" className="font-body text-[0.7rem] font-medium tracking-wider uppercase text-ink block mb-2">
          Promotional Code
        </label>
        <div className="flex gap-2.5">
          <input
            id="promo"
            type="text"
            placeholder="e.g. WELCOME10"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="flex-1 h-9 px-3 border border-border font-body text-[0.75rem] bg-background focus:outline-none focus:border-bronze rounded-[2px]"
          />
          <button
            type="submit"
            className="h-9 px-4 bg-ink text-background hover:bg-bronze transition-colors duration-250 font-body font-medium text-[0.68rem] tracking-wider uppercase border-0 cursor-pointer rounded-[2px]"
          >
            Apply
          </button>
        </div>
        {errorMsg && <p className="font-body text-[0.7rem] text-red-700 mt-2 m-0">{errorMsg}</p>}
        {successMsg && <p className="font-body text-[0.7rem] text-emerald-700 mt-2 m-0">{successMsg}</p>}
      </form>

      {/* Total Block */}
      <div className="flex justify-between items-end py-6">
        <span className="font-display font-medium text-[1.1rem] text-ink m-0">Total</span>
        <div className="text-right">
          <span className="font-display font-semibold text-[1.4rem] text-ink block leading-none">
            ₹{total.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Checkout CTA */}
      <button
        onClick={() => navigate("/checkout", { state: { discountPercent } })}
        className="w-full h-12 bg-bronze text-background font-body font-medium text-xs tracking-widest uppercase hover:brightness-110 transition-all duration-200 cursor-pointer border-0 rounded-[2px] mt-2"
      >
        Proceed to Checkout
      </button>

      {/* Trust factors */}
      <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-border/40 font-body text-[0.65rem] text-muted/80">
        <div className="flex items-center gap-2">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-bronze">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          <span>Secure checkout with 256-bit SSL encryption</span>
        </div>
        <div className="flex items-center gap-2">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-bronze">
            <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
          </svg>
          <span>Free insured transit delivery across India</span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
