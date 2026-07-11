import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

const CartSummary = () => {
  const { cartSubtotal } = useCart();
  const navigate = useNavigate();

  const shippingCost = 0; // Free shipping
  const estimatedGst = cartSubtotal * 0.18; // 18% GST (indicated as included)
  const total = cartSubtotal + shippingCost;

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

      {/* Total Block */}
      <div className="flex justify-between items-end py-6 border-b border-border/40">
        <span className="font-display font-medium text-[1.1rem] text-ink m-0">Total</span>
        <div className="text-right">
          <span className="font-display font-semibold text-[1.4rem] text-ink block leading-none">
            ₹{total.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Checkout CTA */}
      <button
        onClick={() => navigate("/checkout")}
        className="w-full h-12 bg-bronze text-background font-body font-medium text-xs tracking-widest uppercase hover:brightness-110 transition-all duration-200 cursor-pointer border-0 rounded-[2px] mt-4"
      >
        Proceed to Checkout
      </button>

      {/* Trust factors */}
      <div className="flex flex-col gap-3 mt-6 pt-6 font-body text-[0.65rem] text-muted/80">
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
