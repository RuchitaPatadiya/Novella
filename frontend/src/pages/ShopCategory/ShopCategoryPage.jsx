import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { categoriesData } from "../../utils/categoryData";
import { useProducts } from "../../context/ProductContext";
import ShopProductGrid from "../../components/shop/Shopproductgrid";
import BrandStrip from "../../components/home/BrandStrip";
import { ProductCardSkeleton } from "../../components/common/Skeleton";

const ShopCategoryPage = () => {
  const { categoryId } = useParams();
  const { products, loading } = useProducts();
  const categoryInfo = categoriesData.find((c) => c.id === categoryId);

  // States for filter and sort
  const [sortBy, setSortBy] = useState("bestsellers");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 60000]);
  const productRef = useRef(null);

  // Reset filter states when category changes
  useEffect(() => {
    window.scrollTo(0, 0);
    setSortBy("bestsellers");
    setFiltersOpen(false);
    setPriceRange([0, 60000]);
  }, [categoryId]);


  if (!categoryInfo) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 pt-20">
        <h2 className="font-display font-light text-4xl text-ink mb-4">Category Not Found</h2>
        <p className="font-body text-muted mb-8 text-center max-w-md">
          The category you are looking for does not exist in our catalog.
        </p>
        <Link to="/shop" className="no-underline">
          <span className="px-8 py-3.5 bg-bronze text-background font-body font-medium text-xs tracking-widest uppercase hover:brightness-110 transition-all duration-200">
            Back to Shop
          </span>
        </Link>
      </div>
    );
  }

  // Filter products by category
  let filteredProducts = products.filter((p) => p.category === categoryId);

  // Sort
  if (sortBy === "price-asc") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-desc") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === "newest") {
    filteredProducts = [...filteredProducts]
      .filter((p) => p.badge === "New")
      .concat([...filteredProducts].filter((p) => p.badge !== "New"));
  } else if (sortBy === "bestsellers") {
    filteredProducts = [...filteredProducts]
      .filter((p) => p.badge === "Bestseller")
      .concat([...filteredProducts].filter((p) => p.badge !== "Bestseller"));
  }

  // Filter by price range
  filteredProducts = filteredProducts.filter(
    (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
  );

  const handleClearFilters = () => {
    setPriceRange([0, 60000]);
  };

  return (
    <div className="bg-background min-h-screen pt-[76px]">
      {/* Breadcrumbs Row */}
      <div className="px-[clamp(1.5rem,5vw,4rem)] py-5 border-b border-border">
        <div className="flex items-center gap-2 font-body text-[0.68rem] tracking-[0.18em] uppercase text-muted">
          <Link to="/" className="hover:text-bronze transition-colors duration-200 no-underline text-current">
            Home
          </Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-bronze transition-colors duration-200 no-underline text-current">
            Shop
          </Link>
          <span>/</span>
          <span className="text-ink font-normal">{categoryInfo.name}</span>
        </div>
      </div>

      {/* Category Hero */}
      <section className="relative w-full h-[40vh] min-h-[300px] overflow-hidden flex items-center">
        <img
          src={categoryInfo.heroImage}
          alt={categoryInfo.name}
          className="absolute inset-0 w-full h-full object-cover object-[center_35%]"
        />
        <div className="absolute inset-0 bg-dark/75" />

        <div className="relative z-10 w-full px-[clamp(1.5rem,5vw,4rem)] text-left max-w-3xl">
          <div className="flex items-center gap-2.5 mb-3.5">
            <span className="block w-5 h-px bg-gold" />
            <span className="font-body font-normal text-[0.58rem] text-gold tracking-[0.4em] uppercase">
              Shop / Category
            </span>
          </div>
          <h1 className="font-display font-light text-[clamp(2.2rem,4vw,3.8rem)] text-cream m-0 mb-3.5">
            {categoryInfo.name}
          </h1>
          <p className="font-body font-light text-[clamp(0.85rem,1.1vw,0.95rem)] leading-relaxed text-cream-muted/75 max-w-xl">
            {categoryInfo.description}
          </p>
        </div>
      </section>

      <div ref={productRef} className="px-[clamp(1.5rem,5vw,4rem)] py-12 bg-background">
        {/* Category Filter Bar */}
        <div className={`flex items-center justify-between gap-4 px-6 py-4 bg-surface border border-border flex-wrap ${filtersOpen ? "mb-0" : "mb-8"}`}>
          {/* Left: Category Label */}
          <div className="flex items-center gap-2">
            <span className="font-display font-normal italic text-lg text-ink">
              Curated {categoryInfo.name}
            </span>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-5">
            <span className="font-body font-light text-[0.65rem] text-muted">
              {filteredProducts.length} results
            </span>

            <span className="block w-px h-4 bg-border" />

            {/* Sort Select */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="font-body font-normal text-[0.62rem] tracking-[0.15em] uppercase text-ink bg-transparent border-none cursor-pointer outline-none appearance-none pr-5"
              >
                <option value="bestsellers">Sort: Bestsellers</option>
                <option value="newest">Sort: Newest</option>
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

            {/* Price Filter Toggle */}
            <button
              onClick={() => setFiltersOpen((o) => !o)}
              className={`flex items-center gap-1.5 font-body font-normal text-[0.62rem] tracking-[0.12em] uppercase bg-none border-none cursor-pointer transition-colors duration-200 ${
                filtersOpen ? "text-bronze" : "text-muted hover:text-bronze"
              }`}
            >
              <svg width="13" height="11" viewBox="0 0 16 14" fill="none" stroke="currentColor" strokeWidth="1.4">
                <line x1="0" y1="2" x2="16" y2="2" />
                <line x1="0" y1="7" x2="16" y2="7" />
                <line x1="0" y1="12" x2="16" y2="12" />
                <circle cx="4" cy="2" r="1.5" fill="currentColor" stroke="none" />
                <circle cx="10" cy="7" r="1.5" fill="currentColor" stroke="none" />
                <circle cx="6" cy="12" r="1.5" fill="currentColor" stroke="none" />
              </svg>
              Price Limit
            </button>
          </div>
        </div>

        {/* Collapsible Price Range Slider */}
        {filtersOpen && (
          <div className="px-6 py-5 bg-surface border border-border border-t-0 mb-8 animate-slideDown">
            <p className="font-body font-normal text-[0.62rem] tracking-[0.18em] uppercase text-muted mb-4">
              Maximum Price — Up to ₹{priceRange[1].toLocaleString("en-IN")}
            </p>
            <div className="flex items-center gap-4 max-w-md">
              <input
                type="range"
                min={0}
                max={60000}
                step={500}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="flex-1 accent-bronze"
              />
              <button
                onClick={handleClearFilters}
                className="font-body font-normal text-[0.58rem] tracking-[0.12em] uppercase text-muted bg-transparent border border-border px-3 py-1.5 cursor-pointer hover:border-bronze hover:text-bronze transition-colors duration-200"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {[...Array(8)].map((_, idx) => (
              <ProductCardSkeleton key={idx} />
            ))}
          </div>
        ) : (
          <ShopProductGrid
            products={filteredProducts}
            onClearFilters={handleClearFilters}
          />
        )}
      </div>

      <BrandStrip />

      <style>{`
        .animate-slideDown {
          animation: slideDown 0.25s ease-out forwards;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ShopCategoryPage;
