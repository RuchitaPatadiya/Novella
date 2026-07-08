import { useRef } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../../context/ProductContext";
import ProductCard from "../common/ProductCard";

const BestSellers = () => {
  const { products: allProducts, loading } = useProducts();

  const scrollRef = useRef(null);

  if (loading) {
    return null;
  }

  // Filter items matching Bestseller tag, fallback to first 5 products
  const bestSellersList = allProducts.filter(
    (p) => p.badge === "Bestseller" || (p.collections && p.collections.includes("best-sellers"))
  );
  const products = bestSellersList.length > 0 ? bestSellersList.slice(0, 6) : allProducts.slice(0, 5);

  const scroll = (dir) =>
    scrollRef.current?.scrollBy({ left: dir === "left" ? -340 : 340, behavior: "smooth" });

  return (
    <section className="bg-surface py-20 md:py-24 border-y border-border/40">
      <div className="px-[clamp(1.5rem,5vw,4rem)]">

        {/* Section Header */}
        <div className="flex items-start justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-3.5">
              <span className="block w-5 h-px bg-bronze" />
              <span className="font-body font-normal text-[0.55rem] tracking-[0.38em] uppercase text-bronze">
                Most Loved
              </span>
            </div>
            <h2 className="font-display font-light text-[clamp(2rem,4vw,3.2rem)] text-ink m-0 leading-[1.1] tracking-[-0.01em]">
              Best <em className="text-bronze italic font-medium">Sellers</em>
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

        {/* Side-by-Side Flex Layout */}
        <div className="flex flex-col md:flex-row gap-8 items-stretch">

          {/* Editorial Accent Sidebar Card */}
          <div className="shrink-0 w-full md:w-[clamp(240px,24vw,300px)] border border-border/60 bg-background flex flex-col justify-between p-8 rounded-[24px] shadow-sm hover:shadow-md transition-shadow duration-300 min-h-[420px]">
            <div>
              <p className="font-display font-medium text-[1.45rem] text-ink m-0 mb-2 leading-snug tracking-tight">
                Explore<br />Timeless Pieces
              </p>
              <p className="font-body font-normal text-[0.65rem] text-muted tracking-widest uppercase m-0">
                {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>

            <div>
              <p className="font-body font-semibold text-[0.62rem] tracking-[0.25em] uppercase text-bronze m-0 mb-3">
                Selected Curations
              </p>
              <p className="font-body font-light text-[0.8rem] leading-[1.8] text-muted m-0 mb-8">
                A selection of our most celebrated, dynamic designs, crafted with precision from organic elements to anchor your home in refinement.
              </p>

              {/* Slider Controls */}
              <div className="flex gap-2.5">
                {[
                  { dir: "left",  path: "M16 4H2M5 7L2 4L5 1",  filled: false },
                  { dir: "right", path: "M2 4H16M13 1L16 4L13 7", filled: true  },
                ].map(({ dir, path, filled }) => (
                  <button
                    key={dir}
                    onClick={() => scroll(dir)}
                    aria-label={`Scroll ${dir}`}
                    className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 border ${
                      filled
                        ? "border-bronze bg-bronze text-background hover:brightness-110"
                        : "border-border bg-background text-bronze hover:border-bronze/70"
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

          {/* Horizontal Scroll Products List */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto flex-1 [scrollbar-width:none] [-ms-overflow-style:none] [scroll-snap-type:x_mandatory] [&::-webkit-scrollbar]:hidden py-2"
          >
            {products.map((p) => (
              <div
                key={p.id}
                className="shrink-0 w-[clamp(220px,25vw,270px)] scroll-snap-start flex flex-col items-stretch"
              >
                <ProductCard product={p} />
              </div>
            ))}

            <div className="shrink-0 w-4" />
          </div>

        </div>
      </div>
    </section>
  );
};

export default BestSellers;
