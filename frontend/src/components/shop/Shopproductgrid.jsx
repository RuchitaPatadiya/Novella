import ProductCard from "../common/ProductCard";

export default function ShopProductGrid({ products, onClearFilters }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 bg-surface border border-border px-6">
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10 animate-fadeIn">
      {products.map((product) => (
        <ProductCard key={product.id || product._id} product={product} />
      ))}
    </div>
  );
}
