import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../../context/ProductContext";
import ProductCard from "../common/ProductCard";
import API from "../../services/api";

const trendingSearches = ["Sofa", "Travertine", "Pendant", "Armchair", "Linen", "Vase"];

const defaultCategories = [
  { name: "Furniture",         to: "/shop/furniture"          },
  { name: "Lighting",          to: "/shop/lighting"           },
  { name: "Wall Decor",        to: "/shop/wall-decor"         },
  { name: "Textiles",          to: "/shop/textiles"           },
  { name: "Decor Accessories", to: "/shop/decor-accessories"  },
];

export default function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const { products } = useProducts();
  const inputRef = useRef(null);
  const [dbCategories, setDbCategories] = useState([]);

  useEffect(() => {
    if (!isOpen) return;
    const fetchCats = async () => {
      try {
        const res = await API.get("/categories");
        setDbCategories(res.data);
      } catch (err) {
        console.error("Failed to load categories for search overlay:", err);
      }
    };
    fetchCats();
  }, [isOpen]);

  const displayCategories = dbCategories.length > 0
    ? dbCategories.map(cat => ({ name: cat.name, to: `/shop/${cat.slug}` }))
    : defaultCategories;

  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => inputRef.current?.focus(), 150);
    document.body.style.overflow = "hidden";
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const matchingProducts = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          (p.description && p.description.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[99] bg-ink/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Overlay panel — slides down from top */}
      <div
        className="fixed top-0 left-0 right-0 z-[100] bg-background border-b border-border overflow-y-auto"
        style={{
          maxHeight: "85vh",
          animation: "slideDown 0.3s cubic-bezier(0.25,0.46,0.45,0.94) forwards",
          boxShadow: "0 20px 60px rgba(44,36,22,0.12)",
        }}
      >
        <div className="px-[clamp(1.5rem,5vw,6rem)] pt-8 pb-12 max-w-6xl mx-auto">

          {/* ── Search bar row ── */}
          <div className="flex items-center gap-4 pb-5 border-b border-border mb-8">
            {/* Search icon */}
            <svg
              width="20" height="20" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="1.5"
              className="text-bronze flex-shrink-0"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>

            {/* Input */}
            <input
              ref={inputRef}
              type="text"
              placeholder="Search our design catalog..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent border-0 font-display font-light text-[clamp(1.2rem,3vw,2rem)] text-ink placeholder:text-muted/40 focus:outline-none tracking-[-0.01em]"
            />

            {/* Clear button */}
            {query && (
              <button
                onClick={() => setQuery("")}
                className="font-body font-normal text-[0.6rem] tracking-[0.2em] uppercase text-muted hover:text-bronze transition-colors duration-200 bg-transparent border border-border px-3 py-1.5 cursor-pointer hover:border-bronze/40"
              >
                Clear
              </button>
            )}

            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close search"
              className="w-9 h-9 flex items-center justify-center border border-border hover:border-bronze/40 hover:bg-surface transition-all duration-200 bg-transparent cursor-pointer flex-shrink-0"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* ── No query — suggestions ── */}
          {!query.trim() ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

              {/* Trending keywords */}
              <div>
                <p className="font-body font-normal text-[0.55rem] tracking-[0.38em] uppercase text-bronze mb-4">
                  Trending Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-4 py-2 border border-border hover:border-bronze/50 hover:bg-surface font-body font-light text-[0.78rem] text-muted hover:text-bronze transition-all duration-200 bg-transparent cursor-pointer"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="md:col-span-2">
                <p className="font-body font-normal text-[0.55rem] tracking-[0.38em] uppercase text-bronze mb-4">
                  Browse Categories
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-0">
                  {displayCategories.map((cat, i) => (
                    <Link
                      key={cat.name}
                      to={cat.to}
                      onClick={onClose}
                      className="no-underline flex items-center justify-between py-3.5 border-b border-border group hover:border-bronze/30 transition-colors duration-200"
                    >
                      <span className="font-display font-light text-[1.05rem] text-ink group-hover:text-bronze transition-colors duration-200">
                        {cat.name}
                      </span>
                      <svg
                        width="14" height="6" viewBox="0 0 18 8" fill="none"
                        className="text-bronze opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-1 transform"
                      >
                        <path d="M0 4H16M13 1L16 4L13 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

          ) : (
            /* ── Live results ── */
            <div>
              <div className="flex items-center justify-between mb-6">
                <p className="font-body font-normal text-[0.55rem] tracking-[0.38em] uppercase text-bronze m-0">
                  {matchingProducts.length} Result{matchingProducts.length !== 1 ? "s" : ""} for "{query}"
                </p>
                {matchingProducts.length > 0 && (
                  <Link
                    to={`/shop?search=${query}`}
                    onClick={onClose}
                    className="no-underline font-body font-normal text-[0.6rem] tracking-[0.15em] uppercase text-muted hover:text-bronze border-b border-border hover:border-bronze/40 pb-0.5 transition-colors duration-200"
                  >
                    View All →
                  </Link>
                )}
              </div>

              {/* No results */}
              {matchingProducts.length === 0 ? (
                <div className="py-14 text-center border border-border bg-surface">
                  <h3 className="font-display font-light text-[1.4rem] text-ink mb-2">
                    No designs found
                  </h3>
                  <p className="font-body font-light text-[0.82rem] text-muted max-w-xs mx-auto m-0 leading-relaxed">
                    We couldn't find matches for "{query}". Try terms like "table", "chair", or "decor".
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center mt-5">
                    {trendingSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="px-3.5 py-1.5 border border-border hover:border-bronze/50 font-body font-light text-[0.72rem] text-muted hover:text-bronze bg-transparent cursor-pointer transition-all duration-200"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Results grid */
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {matchingProducts.slice(0, 10).map((p) => (
                    <div key={p.id} onClick={onClose} className="cursor-pointer">
                      <ProductCard product={p} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0);     }
        }
      `}</style>
    </>
  );
}