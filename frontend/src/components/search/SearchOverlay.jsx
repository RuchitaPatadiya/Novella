import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { products } from "../../utils/mockData";

const trendingSearches = ["Sofa", "Travertine", "Pendant", "Armchair", "Linen", "Vase"];

const categoriesList = [
  { name: "Furniture", to: "/shop/furniture" },
  { name: "Lighting", to: "/shop/lighting" },
  { name: "Wall Decor", to: "/shop/wall-decor" },
  { name: "Textiles", to: "/shop/textiles" },
  { name: "Decor Accessories", to: "/shop/decor-accessories" },
];

export default function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  // Lock body scroll and listen for escape key
  useEffect(() => {
    if (!isOpen) return;

    // Focus input field
    const focusTimeout = setTimeout(() => inputRef.current?.focus(), 150);

    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(focusTimeout);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter matching products
  const matchingProducts = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="fixed inset-0 z-[100] bg-dark/98 backdrop-blur-xl flex flex-col pt-[12vh] px-[clamp(1.5rem,5vw,6rem)] pb-10 text-cream overflow-y-auto animate-fadeIn">
      {/* Close button top right */}
      <button
        onClick={onClose}
        aria-label="Close search overlay"
        className="absolute top-8 right-8 md:right-14 text-cream-muted/50 hover:text-gold transition-colors duration-200 bg-transparent border-0 cursor-pointer p-2 flex items-center"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Main Search Panel */}
      <div className="max-w-5xl w-full mx-auto flex flex-col">
        {/* Search Bar Input */}
        <div className="relative border-b border-gold/15 pb-4 mb-10 flex items-center gap-4">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-gold">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search our design catalog..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-0 font-display font-light text-[clamp(1.4rem,3.5vw,2.5rem)] text-cream placeholder-cream-muted/30 focus:outline-none tracking-wide"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="font-body text-[0.62rem] tracking-widest uppercase text-gold/60 hover:text-gold bg-transparent border-0 cursor-pointer p-1"
            >
              Clear
            </button>
          )}
        </div>

        {/* Dynamic Display Layout */}
        {!query.trim() ? (
          /* Suggestion Section */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-4">
            {/* Trending Keywords */}
            <div className="flex flex-col">
              <p className="font-body font-light text-[0.56rem] tracking-[0.38em] uppercase text-gold/45 mb-5">
                Trending Searches
              </p>
              <div className="flex flex-wrap gap-2.5">
                {trendingSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="h-9 px-4 rounded-full border border-gold/10 hover:border-gold/30 hover:bg-gold/5 transition-all duration-200 bg-transparent text-cream-muted font-body text-xs cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Categories Navigation */}
            <div className="flex flex-col md:col-span-2">
              <p className="font-body font-light text-[0.56rem] tracking-[0.38em] uppercase text-gold/45 mb-5">
                Suggested Categories
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                {categoriesList.map((cat) => (
                  <Link
                    key={cat.name}
                    to={cat.to}
                    onClick={onClose}
                    className="no-underline py-3 border-b border-gold/8 flex items-center justify-between group font-display text-[1.1rem] text-cream/80 hover:text-gold transition-colors duration-200"
                  >
                    <span>{cat.name}</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-[-4px] group-hover:translate-x-0 text-gold font-body text-xs">
                      ➔
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Live Results Grid */
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <p className="font-body font-light text-[0.56rem] tracking-[0.38em] uppercase text-gold/45 m-0">
                Search Results ({matchingProducts.length})
              </p>
            </div>

            {matchingProducts.length === 0 ? (
              <div className="py-14 text-center border border-gold/10 bg-gold/3 rounded-[3px]">
                <h3 className="font-display font-light text-xl text-cream-muted mb-2">No Designs Found</h3>
                <p className="font-body font-light text-[0.8rem] text-cream-muted/40 max-w-xs mx-auto m-0 leading-relaxed">
                  We couldn't find matches for "{query}". Try looking up generic terms like "table", "chair", or "decor".
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {matchingProducts.map((p) => (
                  <Link
                    key={p.id}
                    to={`/product/${p.id}`}
                    onClick={onClose}
                    className="no-underline flex flex-col group border border-gold/8 p-3 hover:border-gold/25 bg-gold/[0.02] transition-colors duration-250"
                  >
                    <div className="aspect-[4/5] overflow-hidden bg-surface relative">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      />
                    </div>
                    <div className="pt-3">
                      <h4 className="font-display font-medium text-[0.92rem] text-cream m-0 leading-tight group-hover:text-gold transition-colors duration-200 truncate">
                        {p.name}
                      </h4>
                      <p className="font-body font-light text-[0.62rem] text-gold/50 tracking-wider uppercase mt-1 mb-2.5">
                        {p.category}
                      </p>
                      <p className="font-display font-semibold text-[0.9rem] text-cream m-0">
                        ₹{p.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
