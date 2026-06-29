import { useState, useRef, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import ShopHero        from "../../components/shop/ShopHero";
import ShopCategories  from "../../components/shop/ShopCategories";
import ShopFilterBar   from "../../components/shop/ShopFilterBar";
import ShopProductGrid from "../../components/shop/Shopproductgrid";
import BrandStrip      from "../../components/home/BrandStrip";
import { products as allProducts } from "../../utils/mockData";

const ShopPage = () => {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category");
  const validCategories = ["all", "furniture", "lighting", "wall-decor", "textiles", "decor-accessories"];
  const initialCategory = validCategories.includes(categoryFromUrl) ? categoryFromUrl : "all";

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sortBy,         setSortBy]         = useState("bestsellers");
  const [filtersOpen,    setFiltersOpen]     = useState(false);
  const [priceRange,     setPriceRange]      = useState([0, 60000]);
  const productRef = useRef(null);

  useEffect(() => {
    if (validCategories.includes(categoryFromUrl)) {
      setActiveCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  // Filter by category
  let products = activeCategory === "all"
    ? allProducts
    : allProducts.filter(p => p.category === activeCategory);

  // Sort
  if (sortBy === "price-asc")   products = [...products].sort((a, b) => a.price - b.price);
  if (sortBy === "price-desc")  products = [...products].sort((a, b) => b.price - a.price);
  if (sortBy === "newest")      products = [...products].filter(p => p.badge === "New").concat([...products].filter(p => p.badge !== "New"));
  if (sortBy === "bestsellers") products = [...products].filter(p => p.badge === "Bestseller").concat([...products].filter(p => p.badge !== "Bestseller"));

  // Price range
  products = products.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

  const handleCategorySelect = (catId) => {
    setActiveCategory(catId);
    setTimeout(() => productRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const handleClearFilters = () => {
    setActiveCategory("all");
    setPriceRange([0, 60000]);
  };

  return (
    <div className="bg-background pt-[76px] min-h-screen">
      {/* Breadcrumbs Row */}
      <div className="px-[clamp(1.5rem,5vw,4rem)] py-5 border-b border-border bg-background animate-fadeIn">
        <div className="flex items-center gap-2 font-body text-[0.68rem] tracking-[0.18em] uppercase text-muted">
          <Link to="/" className="hover:text-bronze transition-colors duration-200 no-underline text-current">
            Home
          </Link>
          <span>/</span>
          <span className="text-ink font-normal">Shop</span>
        </div>
      </div>

      <ShopHero totalProducts={allProducts.length} />

      <ShopCategories
        activeCategory={activeCategory}
        onSelect={handleCategorySelect}
      />

      <div ref={productRef} className="px-[clamp(1.5rem,5vw,4rem)] pt-12 pb-16 bg-background">
        <ShopFilterBar
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          filtersOpen={filtersOpen}
          onFiltersToggle={() => setFiltersOpen(f => !f)}
          priceRange={priceRange}
          onPriceChange={setPriceRange}
          resultCount={products.length}
        />

        <ShopProductGrid
          products={products}
          onClearFilters={handleClearFilters}
        />
      </div>

      <BrandStrip />
    </div>
  );
};

export default ShopPage;