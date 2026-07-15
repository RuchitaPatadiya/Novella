const defaultCategories = [
  { id: "all",               label: "All"               },
  { id: "furniture",         label: "Furniture"         },
  { id: "lighting",          label: "Lighting"          },
  { id: "wall-decor",        label: "Wall Decor"        },
  { id: "textiles",          label: "Textiles"          },
  { id: "decor-accessories", label: "Decor Accessories" },
];

const spacesOptions = [
  { id: "living-room", label: "Living Room" },
  { id: "bedroom",     label: "Bedroom"     },
  { id: "dining-room", label: "Dining Room" },
  { id: "home-office", label: "Home Office" },
  { id: "outdoor",     label: "Outdoor"     },
];

const defaultCollections = [
  { id: "modern-minimalist", label: "Modern Minimalist" },
  { id: "luxury-living",     label: "Luxury Living"     },
  { id: "scandinavian",      label: "Scandinavian"      },
  { id: "boho-chic",         label: "Boho Chic"         },
  { id: "new-arrivals",      label: "New Arrivals"      },
  { id: "best-sellers",      label: "Best Sellers"      },
];

export default function ShopFilterBar({
  categories = [],
  collections = [],
  activeCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  filtersOpen,
  onFiltersToggle,
  priceRange,
  onPriceChange,
  selectedSpaces = [],
  onSpaceChange,
  selectedCollections = [],
  onCollectionChange,
  resultCount,
  onClearAll,
}) {
  const displayCategories = categories && categories.length > 0
    ? [{ id: "all", label: "All" }, ...categories.map(c => ({ id: c.slug, label: c.name }))]
    : defaultCategories;

  const displayCollections = collections && collections.length > 0
    ? collections.map(c => ({ id: c.slug, label: c.name }))
    : defaultCollections;
  
  const handleSpaceToggle = (spaceId) => {
    const next = selectedSpaces.includes(spaceId)
      ? selectedSpaces.filter((s) => s !== spaceId)
      : [...selectedSpaces, spaceId];
    onSpaceChange(next);
  };

  const handleCollectionToggle = (collId) => {
    const next = selectedCollections.includes(collId)
      ? selectedCollections.filter((c) => c !== collId)
      : [...selectedCollections, collId];
    onCollectionChange(next);
  };

  return (
    <>
      {/* ── Filter + Sort bar ── */}
      <div className={`flex items-center justify-between gap-4 px-6 py-4 bg-surface border border-border flex-wrap ${filtersOpen ? "mb-0" : "mb-8"}`}>

        {/* Category pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {displayCategories.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`font-body text-[0.62rem] tracking-[0.15em] uppercase px-4 py-[0.45rem] rounded-[2px] border cursor-pointer transition-all duration-200 ${
                  isActive
                    ? "font-medium border-bronze bg-bronze text-white"
                    : "font-light border-border bg-transparent text-muted hover:border-bronze hover:text-bronze"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-5">
          {/* Result count */}
          <span className="font-body font-light text-[0.65rem] text-muted">
            {resultCount} results
          </span>

          <span className="block w-px h-4 bg-border" />

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => onSortChange(e.target.value)}
              className="font-body font-normal text-[0.62rem] tracking-[0.1em] text-ink bg-transparent border-none cursor-pointer outline-none appearance-none pr-5"
            >
              <option value="bestsellers">Sort: Best Sellers</option>
              <option value="newest">Sort: Newest First</option>
              <option value="price-asc">Sort: Price — Low to High</option>
              <option value="price-desc">Sort: Price — High to Low</option>
            </select>
            <svg
              className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-bronze"
              width="8" height="5" viewBox="0 0 10 6" fill="none"
            >
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <span className="block w-px h-4 bg-border" />

          {/* Filter toggle */}
          <button
            onClick={onFiltersToggle}
            className={`flex items-center gap-1.5 font-body font-normal text-[0.62rem] tracking-[0.12em] uppercase bg-none border-none cursor-pointer transition-colors duration-200 ${
              filtersOpen ? "text-bronze" : "text-muted hover:text-bronze"
            }`}
          >
            <svg width="13" height="11" viewBox="0 0 16 14" fill="none" stroke="currentColor" strokeWidth="1.4">
              <line x1="0" y1="2"  x2="16" y2="2"  />
              <line x1="0" y1="7"  x2="16" y2="7"  />
              <line x1="0" y1="12" x2="16" y2="12" />
              <circle cx="4"  cy="2"  r="1.5" fill="currentColor" stroke="none" />
              <circle cx="10" cy="7"  r="1.5" fill="currentColor" stroke="none" />
              <circle cx="6"  cy="12" r="1.5" fill="currentColor" stroke="none" />
            </svg>
            Filters
          </button>
        </div>
      </div>

      {/* Expandable Advanced Filter Drawer */}
      {filtersOpen && (
        <div className="px-8 py-7 bg-surface border border-border border-t-0 mb-8 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fadeIn">
          
          {/* Column 1: Spaces */}
          <div>
            <h4 className="font-body font-medium text-[0.68rem] tracking-wider uppercase text-ink mb-4 pb-1.5 border-b border-border/60">
              Filter by Space
            </h4>
            <div className="flex flex-col gap-2.5">
              {spacesOptions.map((opt) => (
                <label 
                  key={opt.id} 
                  className="flex items-center gap-2.5 font-body text-xs text-muted hover:text-ink cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={selectedSpaces.includes(opt.id)}
                    onChange={() => handleSpaceToggle(opt.id)}
                    className="accent-bronze"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Column 2: Collections */}
          <div>
            <h4 className="font-body font-medium text-[0.68rem] tracking-wider uppercase text-ink mb-4 pb-1.5 border-b border-border/60">
              Filter by Collection
            </h4>
            <div className="flex flex-col gap-2.5">
              {displayCollections.map((opt) => (
                <label 
                  key={opt.id} 
                  className="flex items-center gap-2.5 font-body text-xs text-muted hover:text-ink cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={selectedCollections.includes(opt.id)}
                    onChange={() => handleCollectionToggle(opt.id)}
                    className="accent-bronze"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Column 3: Price Slider & Reset */}
          <div>
            <h4 className="font-body font-medium text-[0.68rem] tracking-wider uppercase text-ink mb-4 pb-1.5 border-b border-border/60">
              Price Range
            </h4>
            <p className="font-body font-light text-[0.72rem] text-muted mb-4">
              ₹{priceRange[0].toLocaleString("en-IN")} to ₹{priceRange[1].toLocaleString("en-IN")}
            </p>
            <div className="flex items-center gap-4 mb-6">
              <input
                type="range"
                min={0}
                max={150000}
                step={2000}
                value={priceRange[1]}
                onChange={e => onPriceChange([priceRange[0], Number(e.target.value)])}
                className="flex-1 accent-bronze"
              />
            </div>
            
            <button
              onClick={onClearAll}
              className="w-full font-body font-medium text-[0.62rem] tracking-[0.18em] uppercase text-ink bg-transparent border border-ink py-2.5 cursor-pointer hover:bg-ink hover:text-background transition-all duration-300 rounded-[2px]"
            >
              Reset All Filters
            </button>
          </div>

        </div>
      )}
    </>
  );
}
