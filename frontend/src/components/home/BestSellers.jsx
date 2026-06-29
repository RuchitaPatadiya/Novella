import { useRef } from "react";
import { Link } from "react-router-dom";
import { products as allProducts } from "../../utils/mockData";
import { useWishlist } from "../../context/WishlistContext";

const products = allProducts.slice(0, 5);

const BestSellers = () => {
  const { toggleWishlist, isInWishlist } = useWishlist();

  const scrollRef = useRef(null);

  const scroll = (dir) =>
    scrollRef.current?.scrollBy({ left: dir === "left" ? -340 : 340, behavior: "smooth" });

  return (
    <section className="bg-surface py-16 md:py-20 border-y border-border">
      <div className="px-[clamp(1.5rem,5vw,4rem)]">

        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="block w-5 h-px bg-bronze" />
              <span className="font-body font-normal text-[0.55rem] tracking-[0.38em] uppercase text-bronze">
                Most Loved
              </span>
            </div>
            <h2 className="font-display font-light text-[clamp(2rem,4vw,3.2rem)] text-ink m-0 leading-[1.1] tracking-[-0.01em]">
              Best{" "}
              <em className="text-bronze italic font-medium">Sellers</em>
            </h2>
          </div>

          <Link
            to="/shop"
            className="flex items-center no-underline shrink-0 mt-2 border border-border rounded-full overflow-hidden hover:border-bronze transition-colors duration-200"
          >
            <span className="font-body font-medium text-[0.62rem] tracking-[0.18em] uppercase text-ink px-[1.4rem] py-[0.7rem] bg-background">
              Shop All
            </span>
            <span className="w-10 h-10 bg-bronze flex items-center justify-center shrink-0">
              <svg width="14" height="7" viewBox="0 0 18 8" fill="none" className="text-background">
                <path d="M0 4H16M13 1L16 4L13 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link>
        </div>

        <div className="flex gap-5 items-stretch">

          <div className="shrink-0 w-[clamp(200px,22vw,280px)] border border-border bg-background flex flex-col justify-between p-7 min-h-[420px]">
            <div>
              <p className="font-display font-normal text-[1.3rem] text-ink m-0 mb-2.5 leading-snug">
                Explore<br />Collections
              </p>
              <p className="font-body font-light text-[0.75rem] text-muted m-0 tracking-[0.06em]">
                {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit" })}
              </p>
            </div>

            <div>
              <p className="font-body font-normal text-[0.65rem] tracking-[0.25em] uppercase text-bronze m-0 mb-2.5">
                New 2025
              </p>
              <p className="font-body font-light text-[0.8rem] leading-[1.75] text-muted m-0 mb-6">
                Our collection of timeless, curated home décor is designed to add warmth, comfort and beauty to every corner of your home.
              </p>

              <div className="flex gap-2">
                {[
                  { dir: "left",  path: "M16 4H2M5 7L2 4L5 1",  filled: false },
                  { dir: "right", path: "M2 4H16M13 1L16 4L13 7", filled: true  },
                ].map(({ dir, path, filled }) => (
                  <button
                    key={dir}
                    onClick={() => scroll(dir)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 border ${
                      filled
                        ? "border-bronze bg-bronze text-background hover:bg-bronze hover:border-bronze"
                        : "border-border bg-background text-bronze hover:border-bronze hover:bg-bronze hover:text-background"
                    }`}
                  >
                    <svg width="13" height="6" viewBox="0 0 18 8" fill="none">
                      <path d={path} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto flex-1 [scrollbar-width:none] [-ms-overflow-style:none] [scroll-snap-type:x_mandatory] [&::-webkit-scrollbar]:hidden"
          >
            {products.map(p => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="shrink-0 w-[clamp(220px,25vw,280px)] block no-underline scroll-snap-start group"
              >
                <div className="relative overflow-hidden bg-surface border border-border aspect-[3/4] group-hover:border-bronze/40 transition-colors duration-300">
                  <img
                    src={p.images?.[0] || p.image}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(p.id);
                    }}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-background/95 border border-border flex items-center justify-center cursor-pointer hover:border-bronze transition-colors duration-200 z-10"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" className="text-bronze"
                      fill={isInWishlist(p.id) ? "currentColor" : "none"}
                      stroke="currentColor" strokeWidth="1.8">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                </div>
                <div className="pt-3.5">
                  <p className="font-display font-medium text-[1rem] text-ink m-0 mb-1 leading-tight group-hover:text-bronze transition-colors duration-200">
                    {p.name}
                  </p>
                  <p className="font-display font-semibold text-[1rem] text-ink m-0">
                    ₹{p.price.toLocaleString("en-IN")}
                  </p>
                </div>
              </Link>
            ))}

            <div className="shrink-0 w-4" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
