import { useState, useEffect } from "react";
import ProductCard from "../common/ProductCard";

const ITEMS_PER_PAGE = 8;

export default function ShopProductGrid({ products, onClearFilters }) {
  const [visibleLimit, setVisibleLimit] = useState(ITEMS_PER_PAGE);

  // Reset pagination limit whenever the input products list changes (e.g. on new filter clicks)
  useEffect(() => {
    setVisibleLimit(ITEMS_PER_PAGE);
  }, [products]);

  if (products.length === 0) {
    return (
      <div className="text-center py-16 bg-surface border border-border px-6 rounded-[24px]">
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

  const paginatedProducts = products.slice(0, visibleLimit);
  const hasMore = products.length > visibleLimit;

  return (
    <div className="space-y-12">
      {/* Product Grid / Horizontal Scroll Row on Mobile */}
      <div className="flex overflow-x-auto pb-4 gap-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-x-5 sm:gap-y-10 sm:pb-0 sm:overflow-x-visible animate-fadeIn">
        {paginatedProducts.map((product) => (
          <div key={product.id || product._id} className="w-[260px] shrink-0 snap-start sm:w-auto sm:shrink-1 sm:snap-none">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center pt-4 animate-fadeIn">
          <button
            type="button"
            onClick={() => setVisibleLimit((prev) => prev + ITEMS_PER_PAGE)}
            className="px-8 py-3.5 bg-transparent border border-border text-ink hover:bg-surface font-body font-medium text-xs tracking-widest uppercase rounded-[2px] transition-all duration-300 hover:border-bronze hover:text-bronze cursor-pointer"
          >
            Load More Pieces
          </button>
        </div>
      )}
    </div>
  );
}
