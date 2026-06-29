import { useRef, useState } from "react";
import { Link } from "react-router-dom";

const newArrivals = [
  {
    id: 1,
    name: "Oakwood Dining Table",
    collection: "Luxury Living",
    price: "₹52,000",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&q=85",
    to: "/product/11",
  },
  {
    id: 2,
    name: "Marble Pendant Light",
    collection: "Modern Minimalist",
    price: "₹6,500",
    image: "https://images.unsplash.com/photo-1513506003901-1e6a35086e84?w=600&q=85",
    to: "/product/8",
  },
  {
    id: 3,
    name: "Linen Cloud Sofa",
    collection: "Scandinavian",
    price: "₹38,000",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=85",
    to: "/product/2",
  },
  {
    id: 4,
    name: "Ceramic Vase Set",
    collection: "Boho Chic",
    price: "₹2,200",
    image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=600&q=85",
    to: "/product/6",
  },
  {
    id: 5,
    name: "Boucle Accent Chair",
    collection: "Luxury Living",
    price: "₹15,500",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=85",
    to: "/product/4",
  },
  {
    id: 6,
    name: "Rattan Wall Mirror",
    collection: "Boho Chic",
    price: "₹3,800",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&q=85",
    to: "/product/5",
  },
];

const ProductCard = ({ product }) => {
  const [wished, setWished] = useState(false);

  return (
    <div
      className="shrink-0 flex flex-col"
      style={{ width: "clamp(200px, 22vw, 260px)" }}
    >
      <div className="relative overflow-hidden bg-surface border border-border aspect-[3/4] group hover:border-bronze/40 transition-colors duration-300">
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <span className="absolute top-3 left-3 font-body font-medium text-[0.5rem] tracking-[0.2em] uppercase px-2.5 py-1 bg-bronze text-background">
          New
        </span>

        <button
          onClick={() => setWished(w => !w)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center border border-border bg-background/90 transition-all duration-200 hover:border-bronze"
          aria-label="Add to wishlist"
        >
          <svg
            width="13" height="13" viewBox="0 0 24 24"
            fill={wished ? "currentColor" : "none"}
            stroke="currentColor" strokeWidth="1.8"
            className="text-bronze"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      <div className="pt-3.5 px-0.5">
        <span className="font-body font-normal text-[0.52rem] tracking-[0.25em] uppercase text-bronze block mb-1">
          {product.collection}
        </span>

        <Link to={product.to} className="no-underline">
          <p className="font-display font-medium text-[1rem] text-ink m-0 mb-1.5 leading-tight transition-colors duration-200 hover:text-bronze">
            {product.name}
          </p>
        </Link>

        <p className="font-display font-semibold text-[1rem] text-ink m-0">
          {product.price}
        </p>
      </div>
    </div>
  );
};

export default function NewArrivalsStrip() {
  const scrollRef = useRef(null);

  const scroll = (dir) =>
    scrollRef.current?.scrollBy({ left: dir === "left" ? -280 : 280, behavior: "smooth" });

  return (
    <section className="bg-surface py-20 overflow-hidden border-b border-border">
      <div className="px-[clamp(1.5rem,5vw,4rem)]">

        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="block w-5 h-px bg-bronze" />
              <span className="font-body font-normal text-[0.55rem] tracking-[0.4em] uppercase text-bronze">
                Fresh In
              </span>
            </div>
            <h2 className="font-display font-light text-[clamp(2rem,4vw,3.2rem)] text-ink m-0 leading-[1.1]">
              New{" "}
              <em className="text-bronze font-medium italic">Arrivals</em>
            </h2>
          </div>

          <div className="flex items-end gap-6">
            <Link
              to="/collections/new-arrivals"
              className="no-underline hidden md:flex items-center gap-2 font-body font-normal text-[0.65rem] tracking-[0.2em] uppercase text-muted border-b border-border pb-0.5 hover:text-bronze hover:border-bronze/40 transition-colors duration-200"
            >
              View All
              <svg width="14" height="6" viewBox="0 0 18 8" fill="none" className="text-bronze">
                <path d="M0 4H16M13 1L16 4L13 7" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

            <div className="flex gap-2">
              {[
                { dir: "left",  path: "M16 4H2M5 7L2 4L5 1"  },
                { dir: "right", path: "M2 4H16M13 1L16 4L13 7" },
              ].map(({ dir, path }) => (
                <button
                  key={dir}
                  onClick={() => scroll(dir)}
                  className="w-10 h-10 rounded-full flex items-center justify-center border border-border bg-background cursor-pointer transition-all duration-250 hover:bg-bronze hover:border-bronze group"
                  aria-label={`Scroll ${dir}`}
                >
                  <svg
                    width="13" height="6" viewBox="0 0 18 8" fill="none"
                    className="text-bronze group-hover:text-background transition-colors duration-250"
                  >
                    <path d={path} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="h-px mb-10 bg-gradient-to-r from-bronze/40 to-transparent" />
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pl-[clamp(1.5rem,5vw,4rem)] pr-[clamp(1.5rem,5vw,4rem)] [scrollbar-width:none] [-ms-overflow-style:none] [scroll-snap-type:x_mandatory] [&::-webkit-scrollbar]:hidden"
      >
        {newArrivals.map(p => (
          <div key={p.id} className="scroll-snap-start">
            <ProductCard product={p} />
          </div>
        ))}
      </div>

      <div className="px-[clamp(1.5rem,5vw,4rem)] mt-12 pt-6 border-t border-border flex items-center justify-between flex-wrap gap-3">
        <p className="font-body font-light text-[0.6rem] tracking-[0.18em] uppercase text-muted m-0">
          Last updated · June 2025
        </p>
        <Link
          to="/collections/new-arrivals"
          className="no-underline font-body font-medium text-[0.6rem] tracking-[0.2em] uppercase text-bronze/70 hover:text-bronze transition-colors duration-200"
        >
          See all new arrivals →
        </Link>
      </div>
    </section>
  );
}
