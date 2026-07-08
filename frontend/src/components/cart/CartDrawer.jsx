import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useProducts } from "../../context/ProductContext";

const CartDrawer = () => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartSubtotal, cartCount } = useCart();
  const { products } = useProducts();
  const navigate = useNavigate();
  const drawerRef = useRef(null);

  // Close drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsCartOpen(false);
    };
    if (isCartOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Prevents background scrolling
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isCartOpen, setIsCartOpen]);

  // Click outside to close drawer
  const handleBackdropClick = (e) => {
    if (drawerRef.current && !drawerRef.current.contains(e.target)) {
      setIsCartOpen(false);
    }
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate("/checkout");
  };

  const handleViewBag = () => {
    setIsCartOpen(false);
    navigate("/cart");
  };

  if (!isCartOpen) return null;

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 bg-dark/60 backdrop-blur-xs flex justify-end animate-fadeIn"
    >
      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        className="w-full max-w-[400px] h-full bg-background border-l border-border flex flex-col shadow-2xl animate-slideIn"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-display font-medium text-[1.1rem] text-ink uppercase tracking-wider">
              Shopping Bag
            </span>
            {cartCount > 0 && (
              <span className="font-body font-light text-[0.72rem] text-muted">
                ({cartCount})
              </span>
            )}
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
            className="text-ink/60 hover:text-bronze bg-transparent border-0 cursor-pointer p-1 transition-colors duration-200"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto px-6 divide-y divide-border/60">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-10">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-muted/65 mb-4">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              <h3 className="font-display font-light text-lg text-ink mb-1.5">Your bag is empty</h3>
              <p className="font-body font-light text-xs text-muted max-w-[220px] leading-relaxed mb-6">
                Explore our collections to find items for your space.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate("/shop");
                }}
                className="bg-bronze text-background font-body font-medium text-[0.62rem] tracking-[0.2em] uppercase px-6 py-3 border-0 hover:brightness-110 transition-all duration-200 cursor-pointer"
              >
                Shop Collection
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const p = products.find((prod) => prod.id === item.id);
              if (!p) return null;
              return (
                <div
                  key={`${item.id}-${item.color || "none"}-${item.size || "none"}`}
                  className="py-5 flex gap-4 text-[0.78rem] font-body items-start"
                >
                  <img
                    src={p.images?.[0] || p.image}
                    alt={p.name}
                    className="w-16 h-20 object-cover border border-border/60 bg-surface shrink-0"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-ink block truncate text-[0.85rem]">{p.name}</span>
                    
                    {/* Item parameters */}
                    <div className="flex gap-2 text-[0.68rem] text-muted font-light mt-1">
                      {item.color && <span>Col: {item.color}</span>}
                      {item.size && <span>Size: {item.size}</span>}
                    </div>

                    {/* Price and Quantities */}
                    <div className="flex items-center justify-between mt-3.5">
                      <div className="flex items-center border border-border bg-background">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1, item.color, item.size)}
                          className="w-6 h-6 flex items-center justify-center border-0 bg-transparent text-muted hover:text-ink cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-ink text-xs">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.color, item.size)}
                          className="w-6 h-6 flex items-center justify-center border-0 bg-transparent text-muted hover:text-ink cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id, item.color, item.size)}
                        className="text-muted hover:text-red-700 bg-transparent border-0 cursor-pointer font-light underline text-[0.65rem] tracking-wider uppercase transition-colors duration-200"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <span className="font-medium text-ink text-[0.82rem] shrink-0">
                    ₹{(p.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer actions */}
        {cart.length > 0 && (
          <div className="px-6 py-6 border-t border-border bg-surface/50 space-y-4">
            <div className="flex justify-between items-end font-body text-sm">
              <span className="text-muted font-light">Subtotal</span>
              <span className="font-display font-semibold text-[1.2rem] text-ink">
                ₹{cartSubtotal.toLocaleString("en-IN")}
              </span>
            </div>
            
            <p className="font-body font-light text-[0.65rem] text-muted leading-tight m-0">
              Shipping & taxes calculated at checkout. Enjoy complimentary delivery across India.
            </p>

            <div className="grid grid-cols-2 gap-3.5 pt-2">
              <button
                onClick={handleViewBag}
                className="h-11 bg-transparent border border-border text-ink hover:border-bronze hover:text-bronze font-body font-medium text-[0.62rem] tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer rounded-[2px]"
              >
                View Bag
              </button>
              <button
                onClick={handleCheckout}
                className="h-11 bg-bronze text-background font-body font-medium text-[0.62rem] tracking-[0.2em] uppercase hover:brightness-110 transition-all duration-300 border-0 cursor-pointer rounded-[2px]"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Styled Animations */}
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-slideIn {
          animation: slideIn 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default CartDrawer;
