import { useState } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";

const badgeClass = {
  Bestseller: "bg-ink text-gold",
  New:        "bg-bronze text-white",
  Sale:       "bg-ink/90 text-cream",
  Trending:   "bg-background text-bronze border border-bronze",
};

const StarRow = ({ rating, reviews }) => (
  <div className="flex items-center gap-1.5">
    <div className="flex gap-0.5 text-bronze">
      {[1, 2, 3, 4, 5].map(s => (
        <svg key={s} width="9" height="9" viewBox="0 0 24 24"
          fill={s <= Math.round(rating) ? "currentColor" : "none"}
          stroke="currentColor" strokeWidth="1.8">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
    <span className="font-body font-light text-[0.62rem] text-muted">
      ({reviews})
    </span>
  </div>
);

const ProductCard = ({ p }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const wished = isInWishlist(p.id);
  const [added,   setAdded]   = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative overflow-hidden bg-surface border border-border aspect-[3/4] group-hover:border-bronze/30 transition-colors duration-300">
        <Link to={`/product/${p.id}`}>
          <img
            src={p.images?.[0] || p.image}
            alt={p.name}
            className={`w-full h-full object-cover transition-transform duration-700 ${hovered ? "scale-105" : "scale-100"}`}
          />
        </Link>

        {p.badge && (
          <span className={`absolute top-2.5 left-2.5 font-body font-medium text-[0.5rem] tracking-[0.18em] uppercase px-2.5 py-1 ${badgeClass[p.badge]}`}>
            {p.badge}
          </span>
        )}

        <button
          onClick={() => toggleWishlist(p.id)}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-background/95 border border-border flex items-center justify-center cursor-pointer hover:border-bronze transition-colors duration-200"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" className="text-bronze"
            fill={wished ? "currentColor" : "none"}
            stroke="currentColor" strokeWidth="1.8">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        <div className={`absolute bottom-0 left-0 right-0 transition-transform duration-300 ${hovered ? "translate-y-0" : "translate-y-full"}`}>
          <button
            onClick={(e) => {
              e.preventDefault();
              setAdded(true);
              setTimeout(() => setAdded(false), 1800);
            }}
            className={`w-full py-3.5 border-none cursor-pointer font-body font-medium text-[0.6rem] tracking-[0.22em] uppercase flex items-center justify-center gap-2 transition-colors duration-300 ${
              added
                ? "bg-bronze text-white"
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
            ) : "Add to Cart"}
          </button>
        </div>
      </div>

      <div className="pt-3.5">
        <Link to={`/product/${p.id}`} className="no-underline">
          <p className="font-display font-medium text-[1rem] text-ink m-0 mb-1 leading-tight hover:text-bronze transition-colors duration-200">
            {p.name}
          </p>
        </Link>

        <StarRow rating={p.rating} reviews={p.reviewsCount || p.reviews || 0} />

        <div className="flex items-center gap-2 mt-1.5">
          <span className="font-display font-semibold text-[1rem] text-ink">
            ₹{p.price.toLocaleString("en-IN")}
          </span>
          {p.originalPrice && (
            <span className="font-body font-light text-[0.75rem] text-muted line-through">
              ₹{p.originalPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default function ShopProductGrid({ products, onClearFilters }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 bg-surface border border-border px-6">
        <p className="font-display font-light italic text-[1.5rem] text-muted">
          No products match your filters.
        </p>
        <button
          onClick={onClearFilters}
          className="mt-4 font-body text-[0.62rem] tracking-[0.2em] uppercase text-bronze bg-transparent border border-bronze px-6 py-2.5 cursor-pointer hover:bg-bronze hover:text-white transition-all duration-200"
        >
          Clear Filters
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10">
      {products.map(p => <ProductCard key={p.id} p={p} />)}
    </div>
  );
}
