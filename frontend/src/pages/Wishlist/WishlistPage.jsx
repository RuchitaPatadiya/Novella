import { Link } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import { products } from "../../utils/mockData";
import BrandStrip from "../../components/home/BrandStrip";

const WishlistPage = () => {
  const { wishlist, toggleWishlist, clearWishlist } = useWishlist();

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
              <div key={p.id} className="flex flex-col group animate-fadeIn">
                {/* Product Card Image Container */}
                <div className="relative overflow-hidden bg-surface border border-border aspect-[3/4] group-hover:border-bronze/35 transition-colors duration-300">
                  <Link to={`/product/${p.id}`}>
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-104"
                    />
                  </Link>

                  {/* Remove Button overlay */}
                  <button
                    onClick={() => toggleWishlist(p.id)}
                    aria-label={`Remove ${p.name} from wishlist`}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-background/95 border border-border flex items-center justify-center cursor-pointer hover:border-bronze hover:bg-bronze hover:text-background transition-all duration-250 text-bronze shadow-sm"
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>

                  {p.badge && (
                    <span className="absolute top-2.5 left-2.5 font-body font-medium text-[0.5rem] tracking-[0.18em] uppercase px-2.5 py-1 bg-ink text-gold">
                      {p.badge}
                    </span>
                  )}
                </div>

                {/* Card Bottom Description */}
                <div className="pt-3.5 flex flex-col flex-1">
                  <Link to={`/product/${p.id}`} className="no-underline">
                    <p className="font-display font-medium text-[1rem] text-ink m-0 mb-1.5 leading-tight hover:text-bronze transition-colors duration-200">
                      {p.name}
                    </p>
                  </Link>

                  {/* Rating Block */}
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="flex gap-0.5 text-bronze">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <svg
                          key={s}
                          width="9"
                          height="9"
                          viewBox="0 0 24 24"
                          fill={s <= Math.round(p.rating) ? "currentColor" : "none"}
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                        </svg>
                      ))}
                    </div>
                    <span className="font-body font-light text-[0.62rem] text-muted">
                      ({p.reviewsCount})
                    </span>
                  </div>

                  {/* Price Block */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-display font-semibold text-[1rem] text-ink">
                      ₹{p.price.toLocaleString("en-IN")}
                    </span>
                    {p.originalPrice && (
                      <span className="font-body font-light text-[0.75rem] text-muted line-through">
                        ₹{p.originalPrice.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>

                  {/* Remove text CTA and View details */}
                  <div className="flex items-center justify-between border-t border-border/60 pt-3 mt-auto">
                    <button
                      onClick={() => toggleWishlist(p.id)}
                      className="font-body font-normal text-[0.58rem] tracking-[0.15em] uppercase text-muted hover:text-red-700 bg-transparent border-0 cursor-pointer p-0 transition-colors duration-150"
                    >
                      Remove
                    </button>
                    <Link
                      to={`/product/${p.id}`}
                      className="no-underline font-body font-medium text-[0.58rem] tracking-[0.15em] uppercase text-bronze hover:brightness-90 transition-all duration-150"
                    >
                      View Details ➔
                    </Link>
                  </div>
                </div>
              </div>
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
