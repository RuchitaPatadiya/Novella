import { useState, useRef, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import AtelierHero      from "../../components/common/AtelierHero";
import ShopCategories  from "../../components/shop/ShopCategories";
import ShopFilterBar   from "../../components/shop/ShopFilterBar";
import ShopProductGrid from "../../components/shop/Shopproductgrid";
import BrandStrip      from "../../components/home/BrandStrip";
import { useProducts } from "../../context/ProductContext";
import API from "../../services/api";



const ShopPage = () => {
  const { products: allProducts, loading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const aiSearch = searchParams.get("aiSearch");
  const aiMaxPrice = searchParams.get("aiMaxPrice");
  const aiCategory = searchParams.get("aiCategory");
  const aiSpace = searchParams.get("aiSpace");
  const aiExcludeColor = searchParams.get("aiExcludeColor");

  const aiFilters = (aiSearch || aiMaxPrice || aiCategory || aiSpace || aiExcludeColor) ? {
    searchQuery: aiSearch || "",
    maxPrice: aiMaxPrice ? parseFloat(aiMaxPrice) : null,
    category: aiCategory || null,
    space: aiSpace || null,
    excludeColor: aiExcludeColor || null
  } : null;
  const categoryFromUrl = searchParams.get("category");

  // Category and Type Filters
  const [activeCategory, setActiveCategory] = useState(categoryFromUrl || "all");
  const [activeType, setActiveType] = useState("all");

  // Advanced filters
  const [selectedSpaces, setSelectedSpaces] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  
  const [sortBy, setSortBy] = useState("bestsellers");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 150000]);
  const productRef = useRef(null);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [catRes, collRes] = await Promise.all([
          API.get("/categories"),
          API.get("/collections")
        ]);
        setCategories(catRes.data);
        setCollections(collRes.data);
      } catch (err) {
        console.error("Failed to load shop categories/collections:", err);
      }
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    setActiveCategory(categoryFromUrl || "all");
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
    filteredProducts = filteredProducts.filter(p => p.subcategory === activeType);
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

  // 5b. Filter by AI Curator extracts
  if (aiFilters) {
    if (aiFilters.searchQuery) {
      const keywords = aiFilters.searchQuery.toLowerCase().split(/[\s,;]+/).filter(w => w.length > 2);
      if (keywords.length > 0) {
        filteredProducts = filteredProducts.filter(p => {
          const name = p.name.toLowerCase();
          const desc = (p.description || "").toLowerCase();
          const cat = (p.category || "").toLowerCase();
          return keywords.some(word => name.includes(word) || desc.includes(word) || cat.includes(word));
        });
      }
    }
    if (aiFilters.maxPrice) {
      filteredProducts = filteredProducts.filter(p => p.price <= aiFilters.maxPrice);
    }
    if (aiFilters.category) {
      const targetCat = aiFilters.category.toLowerCase().replace(/[^a-z0-9]/g, "");
      filteredProducts = filteredProducts.filter(p => {
        const cat = (p.category || "").toLowerCase().replace(/[^a-z0-9]/g, "");
        return cat.includes(targetCat) || targetCat.includes(cat);
      });
    }
    if (aiFilters.space) {
      const targetSpace = aiFilters.space.toLowerCase().replace(/[^a-z0-9]/g, "");
      filteredProducts = filteredProducts.filter(p => 
        p.spaces && p.spaces.some(s => s.toLowerCase().replace(/[^a-z0-9]/g, "") === targetSpace)
      );
    }
    if (aiFilters.excludeColor) {
      filteredProducts = filteredProducts.filter(p => {
        const colorString = (p.color || p.description || p.name || "").toLowerCase();
        return !colorString.includes(aiFilters.excludeColor.toLowerCase());
      });
    }
  }

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
    setPriceRange([0, 150000]);
    setSearchParams({});
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

      <AtelierHero 
        eyebrow="The Atelier Edit"
        title="Decor Carnival Sale"
        subtitle="Flat 40% Off + Extra 5% Off on Prepaid Orders. Discover a curated collection of luxury wabi-sabi home decor pieces."
        bottomText="↓ Discover Catalog ↓"
        images={[
          "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&q=80",
          "https://images.unsplash.com/photo-1618220179428-22790b461013?w=400&q=80",
          "https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?w=400&q=80"
        ]}
      />

      {/* Dynamic Circle Type Horizontal Scroll selector */}
      <ShopCategories
        activeCategory={activeCategory}
        activeType={activeType}
        onSelect={handleTypeSelect}
      />

      <div ref={productRef} className="px-[clamp(1.5rem,5vw,4rem)] pt-12 pb-16 bg-background">
        
        {/* Advanced Filters Panel */}
        <ShopFilterBar
          categories={categories}
          collections={collections}
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