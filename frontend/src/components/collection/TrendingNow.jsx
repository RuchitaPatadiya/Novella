import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../../context/ProductContext";
import ProductCard from "../common/ProductCard";

export default function TrendingNow() {
  const { products: allProducts, loading } = useProducts();
  const [activeFilter, setActiveFilter] = useState("top-rated");

  const filters = [
    { id: "top-rated", label: "Top Rated" },
    { id: "most-reviewed", label: "Most Reviewed" },
    { id: "new-in", label: "New In" },
  ];

  const trending = useMemo(() => {
    if (!allProducts?.length) return [];

    let sorted;
    switch (activeFilter) {
      case "most-reviewed":
        sorted = [...allProducts].sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
        break;
      case "new-in":
        sorted = [...allProducts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "top-rated":
      default:
        sorted = [...allProducts].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }

    return sorted.slice(0, 8);
  }, [allProducts, activeFilter]);

  if (loading || !trending.length) return null;

  return (
    <section className="bg-background py-20 px-[clamp(1.5rem,5vw,4rem)] border-b border-border">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <span className="block w-5 h-px bg-bronze" />
            <span className="font-body font-normal text-[0.55rem] tracking-[0.4em] uppercase text-bronze">
              What's Hot
            </span>
          </div>
          <h2 className="font-display font-light text-[clamp(2rem,4vw,3.2rem)] text-ink m-0 leading-[1.1]">
            Trending{" "}
            <em className="text-bronze font-medium italic">Now</em>
          </h2>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`font-body font-normal text-[0.58rem] tracking-[0.15em] uppercase px-4 py-2 border cursor-pointer transition-all duration-300 ${
                activeFilter === f.id
                  ? "bg-ink text-cream-muted border-ink"
                  : "bg-background text-muted border-border hover:border-bronze/50 hover:text-bronze"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px mb-10 bg-gradient-to-r from-bronze/40 to-transparent" />

      {/* Grid container with uniform card designs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fadeIn">
        {trending.map((product) => (
          <ProductCard key={product.id || product._id} product={product} />
        ))}
      </div>

      {/* Bottom bar */}
      <div className="mt-10 pt-6 border-t border-border flex items-center justify-between flex-wrap gap-3">
        <p className="font-body font-light text-[0.6rem] tracking-[0.18em] uppercase text-muted m-0">
          Updated in real-time from our catalog
        </p>
        <Link
          to="/shop"
          className="no-underline flex items-center gap-2.5 font-body font-medium text-[0.63rem] tracking-[0.22em] uppercase text-ink hover:text-bronze transition-colors duration-200"
        >
          Browse Full Catalog
          <svg width="16" height="7" viewBox="0 0 18 8" fill="none" className="text-bronze">
            <path d="M0 4H16M13 1L16 4L13 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
