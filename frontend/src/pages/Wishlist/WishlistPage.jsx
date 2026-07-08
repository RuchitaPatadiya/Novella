import { Link } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import { useProducts } from "../../context/ProductContext";
import BrandStrip from "../../components/home/BrandStrip";
import ProductCard from "../../components/common/ProductCard";

const WishlistPage = () => {
  const { wishlist, toggleWishlist, clearWishlist } = useWishlist();
  const { products, loading } = useProducts();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 pt-20">
        <div className="font-body text-xs text-muted tracking-widest uppercase animate-pulse">
          Loading wishlist...
        </div>
      </div>
    );
  }

  // Get wishlisted products
  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="bg-background min-h-screen pt-[76px]">
      {/* Breadcrumbs Row */}
      <div className="px-[clamp(1.5rem,5vw,4rem)] py-5 border-b border-border bg-background">
        <div className="flex items-center gap-2 font-body text-[0.68rem] tracking-[0.18em] uppercase text-muted">
          <Link to="/" className="hover:text-bronze transition-colors duration-200 no-underline text-current">
            Home
          </Link>
          <span>/</span>
          <span className="text-ink font-normal">Wishlist</span>
        </div>
      </div>

      <div className="px-[clamp(1.5rem,5vw,4rem)] py-12 md:py-16 bg-background">
        {/* Header Block */}
        <div className="flex items-end justify-between border-b border-border pb-6 mb-10 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="block w-5 h-px bg-bronze" />
              <span className="font-body font-normal text-[0.55rem] tracking-[0.38em] uppercase text-bronze">
                My Favorites
              </span>
            </div>
            <h1 className="font-display font-light text-[clamp(2.2rem,4vw,3.2rem)] text-ink m-0 leading-none">
              Your <em className="text-bronze italic font-medium">Wishlist</em>
            </h1>
          </div>
          {wishlistedProducts.length > 0 && (
            <button
              onClick={clearWishlist}
              className="font-body font-light text-[0.65rem] tracking-[0.18em] uppercase text-muted hover:text-bronze bg-transparent border-0 cursor-pointer p-0 underline transition-colors duration-200"
            >
              Clear All Favorites
            </button>
          )}
        </div>

        {/* Empty State */}
        {wishlistedProducts.length === 0 ? (
          <div className="text-center py-20 bg-surface border border-border px-6 max-w-xl mx-auto rounded-[3px] animate-fadeIn">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              className="text-muted/65 mb-6 mx-auto"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <h2 className="font-display font-light text-2xl text-ink mb-3.5">Your Wishlist is Empty</h2>
            <p className="font-body font-light text-[0.85rem] leading-[1.8] text-muted max-w-sm mx-auto mb-8">
              Explore our curation of timeless, high-end pieces and save your favorite designs to buy them later.
            </p>
            <Link to="/shop" className="no-underline">
              <span className="px-8 py-3.5 bg-bronze text-background font-body font-medium text-xs tracking-widest uppercase hover:brightness-110 transition-all duration-200">
                Explore Products
              </span>
            </Link>
          </div>
        ) : (
          /* Active Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-12">
            {wishlistedProducts.map((p) => (
              <ProductCard key={p.id || p._id} product={p} />
            ))}
          </div>
        )}
      </div>

      <BrandStrip />

      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.35s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default WishlistPage;
