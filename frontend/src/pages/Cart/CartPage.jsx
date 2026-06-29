import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import CartItem from "../../components/cart/CartItem";
import CartSummary from "../../components/cart/CartSummary";
import BrandStrip from "../../components/home/BrandStrip";

const CartPage = () => {
  const { cart, clearCart, cartCount } = useCart();

  return (
    <div className="bg-background min-h-screen pt-[76px]">
      {/* Breadcrumbs Row */}
      <div className="px-[clamp(1.5rem,5vw,4rem)] py-5 border-b border-border bg-background">
        <div className="flex items-center gap-2 font-body text-[0.68rem] tracking-[0.18em] uppercase text-muted">
          <Link to="/" className="hover:text-bronze transition-colors duration-200 no-underline text-current">
            Home
          </Link>
          <span>/</span>
          <span className="text-ink font-normal">Shopping Bag</span>
        </div>
      </div>

      <div className="px-[clamp(1.5rem,5vw,4rem)] py-12 md:py-16 bg-background">
        {/* Header Block */}
        <div className="flex items-end justify-between border-b border-border pb-6 mb-10 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="block w-5 h-px bg-bronze" />
              <span className="font-body font-normal text-[0.55rem] tracking-[0.38em] uppercase text-bronze">
                Order Review
              </span>
            </div>
            <h1 className="font-display font-light text-[clamp(2.2rem,4vw,3.2rem)] text-ink m-0 leading-none">
              Shopping <em className="text-bronze italic font-medium">Bag</em>
              {cartCount > 0 && (
                <span className="font-body font-light text-muted text-base ml-4 normal-case">
                  ({cartCount} {cartCount === 1 ? "item" : "items"})
                </span>
              )}
            </h1>
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="font-body font-light text-[0.65rem] tracking-[0.18em] uppercase text-muted hover:text-bronze bg-transparent border-0 cursor-pointer p-0 underline transition-colors duration-200"
            >
              Empty Shopping Bag
            </button>
          )}
        </div>

        {/* Cart Contents */}
        {cart.length === 0 ? (
          /* Empty Bag State */
          <div className="text-center py-20 bg-surface border border-border px-6 max-w-xl mx-auto rounded-[3px] animate-fadeIn">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              className="text-muted/65 mb-6 mx-auto"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <h2 className="font-display font-light text-2xl text-ink mb-3.5">Your Shopping Bag is Empty</h2>
            <p className="font-body font-light text-[0.85rem] leading-[1.8] text-muted max-w-sm mx-auto mb-8">
              You haven't added any pieces to your bag yet. Browse our curated designs to find items you love.
            </p>
            <Link to="/shop" className="no-underline">
              <span className="px-8 py-3.5 bg-bronze text-background font-body font-medium text-xs tracking-widest uppercase hover:brightness-110 transition-all duration-200">
                Continue Shopping
              </span>
            </Link>
          </div>
        ) : (
          /* Split Layout */
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            {/* Left side: Items List */}
            <div className="flex-1 w-full border border-border bg-surface p-6 sm:p-8 rounded-[3px] animate-fadeIn">
              <div className="flex flex-col">
                {cart.map((item, idx) => (
                  <CartItem
                    key={`${item.id}-${item.color || "none"}-${item.size || "none"}`}
                    item={item}
                  />
                ))}
              </div>
            </div>

            {/* Right side: Sticky checkout summary card */}
            <div className="w-full lg:w-[380px] shrink-0 lg:sticky lg:top-24 animate-fadeIn">
              <CartSummary />
            </div>
          </div>
        )}
      </div>

      <BrandStrip />

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

export default CartPage;
