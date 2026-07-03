import { useState, useRef, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import ShopHero        from "../../components/shop/ShopHero";
import ShopCategories  from "../../components/shop/ShopCategories";
import ShopFilterBar   from "../../components/shop/ShopFilterBar";
import ShopProductGrid from "../../components/shop/Shopproductgrid";
import BrandStrip      from "../../components/home/BrandStrip";
import { useProducts } from "../../context/ProductContext";

// Helper to determine highly specialized product type by matching name keywords
const getProductType = (name) => {
  const n = name.toLowerCase();
  if (n.includes("sofa")) return "sofa";
  if (n.includes("coffee table")) return "coffee-table";
  if (n.includes("side table")) return "side-table";
  if (n.includes("credenza")) return "credenza";
  if (n.includes("table lamp")) return "table-lamp";
  if (n.includes("pendant")) return "pendant-light";
  if (n.includes("sconce")) return "wall-sconce";
  if (n.includes("urn") || n.includes("vase")) return "vase";
  if (n.includes("mirror")) return "mirror";
  if (n.includes("art") || n.includes("canvas")) return "art";
  if (n.includes("throw") || n.includes("rug")) return "textiles";
  if (n.includes("organizer") || n.includes("set")) return "organizer";
  return "other";
};

const ShopPage = () => {
  const { products: allProducts, loading } = useProducts();

  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category");
  const validCategories = ["all", "furniture", "lighting", "wall-decor", "textiles", "decor-accessories"];
  const initialCategory = validCategories.includes(categoryFromUrl) ? categoryFromUrl : "all";

  // Category and Type Filters
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeType, setActiveType] = useState("all");

  // Advanced filters
  const [selectedSpaces, setSelectedSpaces] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState([]);
  
  const [sortBy, setSortBy] = useState("bestsellers");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 80000]);
  const productRef = useRef(null);

  useEffect(() => {
    if (validCategories.includes(categoryFromUrl)) {
      setActiveCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  if (loading) {
    return (
      <div className="bg-background min-h-screen pt-32 flex items-center justify-center font-body text-[0.62rem] text-muted tracking-[0.2em] uppercase animate-pulse">
        Loading Atelier Catalog...
      </div>
    );
  }

  // Combined Filters Logic
  let filteredProducts = allProducts;

  // 1. Filter by general category
  if (activeCategory !== "all") {
    filteredProducts = filteredProducts.filter(p => p.category === activeCategory);
  }

  // 2. Filter by subcategory circle type
  if (activeType !== "all") {
    filteredProducts = filteredProducts.filter(p => getProductType(p.name) === activeType);
  }

  // 3. Filter by selected Spaces
  if (selectedSpaces.length > 0) {
    filteredProducts = filteredProducts.filter(p => 
      p.spaces && p.spaces.some(space => selectedSpaces.includes(space))
    );
  }

  // 4. Filter by selected Collections
  if (selectedCollections.length > 0) {
    filteredProducts = filteredProducts.filter(p => 
      p.collections && p.collections.some(coll => selectedCollections.includes(coll))
    );
  }

  // 5. Filter by Price Range
  filteredProducts = filteredProducts.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

  // 6. Sort results
  if (sortBy === "price-asc") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-desc") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === "newest") {
    filteredProducts = [...filteredProducts]
      .filter(p => p.badge === "New")
      .concat([...filteredProducts].filter(p => p.badge !== "New"));
  } else if (sortBy === "bestsellers") {
    filteredProducts = [...filteredProducts]
      .filter(p => p.badge === "Bestseller")
      .concat([...filteredProducts].filter(p => p.badge !== "Bestseller"));
  }

  const handleCategorySelect = (catId) => {
    setActiveCategory(catId);
    setActiveType("all"); // reset subcategory on general category changes
    setTimeout(() => productRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const handleTypeSelect = (typeId) => {
    setActiveType(typeId);
    setTimeout(() => productRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const handleClearFilters = () => {
    setActiveCategory("all");
    setActiveType("all");
    setSelectedSpaces([]);
    setSelectedCollections([]);
    setPriceRange([0, 80000]);
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

      {/* Dynamic Circle Type Horizontal Scroll selector */}
      <ShopCategories
        activeType={activeType}
        onSelect={handleTypeSelect}
      />

      <div ref={productRef} className="px-[clamp(1.5rem,5vw,4rem)] pt-12 pb-16 bg-background">
        
        {/* Advanced Filters Panel */}
        <ShopFilterBar
          activeCategory={activeCategory}
          onCategoryChange={handleCategorySelect}
          sortBy={sortBy}
          onSortChange={setSortBy}
          filtersOpen={filtersOpen}
          onFiltersToggle={() => setFiltersOpen(f => !f)}
          priceRange={priceRange}
          onPriceChange={setPriceRange}
          selectedSpaces={selectedSpaces}
          onSpaceChange={setSelectedSpaces}
          selectedCollections={selectedCollections}
          onCollectionChange={setSelectedCollections}
          resultCount={filteredProducts.length}
          onClearAll={handleClearFilters}
        />

        <ShopProductGrid
          products={filteredProducts}
          onClearFilters={handleClearFilters}
        />
      </div>

      <BrandStrip />
    </div>
  );
};

export default ShopPage;