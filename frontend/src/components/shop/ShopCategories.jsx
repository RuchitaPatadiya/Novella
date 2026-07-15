import React, { useState, useEffect } from "react";
import API from "../../services/api";

const defaultIcons = {
  "all": (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <rect x="3" y="3" width="7" height="7" rx="0.5" />
      <rect x="14" y="3" width="7" height="7" rx="0.5" />
      <rect x="3" y="14" width="7" height="7" rx="0.5" />
      <rect x="14" y="14" width="7" height="7" rx="0.5" />
    </svg>
  ),
  "sofa": (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M2 12V17C2 18.1 2.9 19 4 19H20C21.1 19 22 18.1 22 17V12" />
      <path d="M4 12V9C4 7.9 4.9 7 6 7H18C19.1 7 20 7.9 20 9V12" />
      <path d="M2 12H22" />
      <path d="M6 12V15" />
      <path d="M18 12V15" />
    </svg>
  ),
  "coffee-table": (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M2 10H22V12H2ZM5 12V17M19 12V17" />
      <path d="M9 12V15M15 12V15" />
    </svg>
  ),
  "side-table": (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M6 7H18V9H6ZM9 9V19M15 9V19" />
      <circle cx="12" cy="14" r="1" />
    </svg>
  ),
  "credenza": (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <rect x="3" y="7" width="18" height="11" rx="0.5" />
      <line x1="9" y1="7" x2="9" y2="18" />
      <line x1="15" y1="7" x2="15" y2="18" />
      <line x1="6" y1="18" x2="6" y2="20" />
      <line x1="18" y1="18" x2="18" y2="20" />
      <circle cx="6" cy="12" r="0.75" fill="currentColor" />
      <circle cx="12" cy="12" r="0.75" fill="currentColor" />
      <circle cx="18" cy="12" r="0.75" fill="currentColor" />
    </svg>
  ),
  "table-lamp": (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M9 11L7 6H17L15 11H9Z" />
      <path d="M12 11V18" />
      <path d="M9 18H15" />
    </svg>
  ),
  "pendant-light": (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M12 2V10" />
      <path d="M5 15C5 11.7 8.1 9 12 9C15.9 9 19 11.7 19 15H5Z" />
      <circle cx="12" cy="18" r="1.5" />
    </svg>
  ),
  "wall-sconce": (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <rect x="10" y="4" width="4" height="16" rx="2" />
      <circle cx="12" cy="12" r="4" />
      <path d="M6 12H10" />
      <path d="M14 12H18" />
    </svg>
  ),
  "vase": (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M8 3H16" />
      <path d="M8 3C7 5 6 7 6 9C6 14 8.5 17 8.5 21H15.5C15.5 17 18 14 18 9C18 7 17 5 16 3" />
      <path d="M6 9H18" />
      <path d="M8.5 21H15.5" />
    </svg>
  ),
  "mirror": (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" />
      <path d="M12 5C8.13401 5 5 8.13401 5 12" />
    </svg>
  ),
  "art": (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <rect x="3" y="3" width="18" height="18" rx="1.5" />
      <path d="M3 16L9 10L21 20" />
      <circle cx="15" cy="7" r="1.5" />
    </svg>
  ),
  "textiles": (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M2 6C6 6 6 8 10 8C14 8 14 6 18 6C22 6 22 8 26 8" />
      <path d="M2 12C6 12 6 14 10 14C14 14 14 12 18 12C22 12 22 14 26 14" />
      <path d="M2 18C6 18 6 20 10 20C14 20 14 18 18 18C22 18 22 20 26 20" />
    </svg>
  ),
  "organizer": (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M3 7V17C3 18.1 3.9 19 5 19H19C20.1 19 21 18.1 21 17V7" />
      <path d="M3 7H21" />
      <path d="M8 7V12" />
      <path d="M16 7V12" />
      <rect x="9" y="14" width="6" height="3" rx="0.5" />
    </svg>
  ),
};

export default function ShopCategories({ activeCategory = "all", activeType = "all", onSelect }) {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await API.get("/subcategories");
        setTypes(res.data);
      } catch (err) {
        console.error("Failed to fetch subcategories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTypes();
  }, []);

  // Filter subcategories by selected storefront Category slug
  const visibleTypes = activeCategory === "all"
    ? types
    : types.filter(t => t.category === activeCategory);

  // Prepend the "All Pieces" filter button
  const filtersList = [
    { slug: "all", name: "All Pieces" },
    ...visibleTypes
  ];

  if (loading) {
    return (
      <div className="bg-surface border-b border-border px-[clamp(1.5rem,5vw,4rem)] pt-12 pb-10 flex items-center justify-center font-body text-[0.62rem] text-muted tracking-[0.2em] uppercase animate-pulse">
        Loading Atelier Types...
      </div>
    );
  }

  return (
    <div className="bg-surface border-b border-border px-[clamp(1.5rem,5vw,4rem)] pt-12 pb-10">
      
      {/* Title */}
      <div className="mb-8">
        <div className="flex items-center gap-2.5 mb-2.5">
          <span className="block w-5 h-px bg-bronze" />
          <span className="font-body font-normal text-[0.55rem] tracking-[0.38em] uppercase text-bronze">
            Atelier Curations
          </span>
        </div>
        <h2 className="font-display font-light text-[clamp(1.8rem,3.5vw,2.5rem)] text-ink m-0 leading-none">
          Filter by <em className="text-bronze font-medium not-italic">Atelier Type</em>
        </h2>
      </div>

      {/* Horizontal Scrollable Circles Wrapper */}
      <div 
        className="flex items-center gap-6 md:gap-8 overflow-x-auto pb-4 scrollbar-none"
        style={{
          msOverflowStyle: "none",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {filtersList.map((type) => {
          const isActive = activeType === type.slug;
          const hasDefaultIcon = !!defaultIcons[type.slug];

          return (
            <button
              key={type.slug}
              onClick={() => onSelect(type.slug)}
              className="flex flex-col items-center group cursor-pointer bg-transparent border-none p-0 shrink-0 outline-none"
            >
              {/* Circle container */}
              <div 
                className={`w-18 h-18 md:w-20 md:h-20 rounded-full flex items-center justify-center border transition-all duration-300 relative overflow-hidden ${
                  isActive
                    ? "bg-bronze/5 border-bronze text-bronze ring-4 ring-bronze/10"
                    : "bg-background border-border text-muted group-hover:border-bronze/40 group-hover:text-ink"
                }`}
              >
                {hasDefaultIcon ? (
                  defaultIcons[type.slug]
                ) : type.image ? (
                  <img
                    src={type.image}
                    alt={type.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-display font-light text-base text-ink select-none">
                    {type.name.charAt(0)}
                  </span>
                )}
              </div>

              {/* Text label */}
              <span 
                className={`font-body font-light text-[0.62rem] tracking-wider uppercase mt-3 transition-colors duration-200 ${
                  isActive ? "text-bronze font-medium" : "text-muted group-hover:text-ink"
                }`}
              >
                {type.name}
              </span>
            </button>
          );
        })}
      </div>

    </div>
  );
}
