import { useState } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";

const StarRating = ({ rating }) => {
  const stars = [];
  const roundedRating = Math.round(rating || 0);
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <svg
        key={i}
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill={i <= roundedRating ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        className="text-bronze"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    );
  }
  return <div className="flex items-center gap-0.5">{stars}</div>;
};

export default function ProductCard({ product }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const wished = isInWishlist(product.id);

  const handleCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const badgeStyles = {
    Bestseller: "bg-ink text-gold border-ink",
    New: "bg-bronze text-background border-bronze",
    Sale: "bg-red-700 text-background border-red-700",
  };

  return (
    <div
      className="flex flex-col h-full bg-background border border-border overflow-hidden rounded-[24px] shadow-xs hover:shadow-md hover:border-bronze/35 group transition-all duration-500"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image container */}
      <div className="relative overflow-hidden aspect-[3/4] bg-surface shrink-0">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.images?.[0] || product.image || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-[800ms] group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Badge */}
        {product.badge && (
          <span
            className={`absolute top-3.5 left-3.5 font-body font-semibold text-[0.48rem] tracking-[0.2em] uppercase px-2.5 py-1 border rounded-[4px] shadow-xs ${
              badgeStyles[product.badge] || "bg-ink text-cream border-ink"
            }`}
          >
            {product.badge}
          </span>
        )}

        {/* Wishlist trigger */}
        <button
          onClick={handleWishlistClick}
          aria-label="Add to Wishlist"
          className={`absolute top-3.5 right-3.5 w-8 h-8 rounded-full border flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 shadow-xs ${
            wished
              ? "bg-bronze border-bronze text-background"
              : "bg-background/95 border-border text-bronze hover:border-bronze"
          }`}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill={wished ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Slide-up Quick Add button */}
        <div
          className={`absolute bottom-0 left-0 right-0 transition-transform duration-300 pointer-events-auto ${
            hovered ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <button
            onClick={handleCartClick}
            className={`w-full py-3.5 border-none cursor-pointer font-body font-medium text-[0.6rem] tracking-[0.22em] uppercase flex items-center justify-center gap-2 transition-all duration-300 ${
              added
                ? "bg-[#4a7a42] text-white"
                : "bg-ink text-cream-muted hover:bg-bronze hover:text-white"
            }`}
          >
            {added ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Added
              </>
            ) : (
              <>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                Quick Add
              </>
            )}
          </button>
        </div>
      </div>

      {/* Card Info Details */}
      <div className="p-5 flex flex-col justify-between flex-grow">
        <div className="space-y-1">
          {product.category && (
            <span className="font-body font-normal text-[0.55rem] tracking-[0.25em] uppercase text-bronze block">
              {product.category.replace("-", " ")}
            </span>
          )}

          <Link to={`/product/${product.id}`} className="no-underline block">
            <h3 className="font-display font-medium text-[1.1rem] text-ink m-0 leading-tight hover:text-bronze transition-colors duration-200 line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center gap-2 mt-1 pb-1">
            <StarRating rating={product.rating} />
            <span className="font-body font-light text-[0.62rem] text-muted">
              ({product.reviewsCount || product.reviews || 0})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-border/40">
          <span className="font-display font-semibold text-[1.1rem] text-ink">
            ₹{product.price?.toLocaleString("en-IN")}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="font-body font-light text-[0.78rem] text-muted line-through">
              ₹{product.originalPrice?.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
