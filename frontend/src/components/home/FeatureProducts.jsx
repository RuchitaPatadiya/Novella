import { useRef, useState } from "react";
import { Link } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "Arco Floor Lamp",
    category: "Lighting",
    price: 4200,
    originalPrice: 5100,
    rating: 4.8,
    reviews: 124,
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80",
  },
  {
    id: 2,
    name: "Linen Cloud Sofa",
    category: "Living Room",
    price: 38000,
    originalPrice: null,
    rating: 4.9,
    reviews: 87,
    badge: "New",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
  },
  {
    id: 3,
    name: "Travertine Side Table",
    category: "Tables",
    price: 8900,
    originalPrice: 11000,
    rating: 4.7,
    reviews: 56,
    badge: "Sale",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&q=80",
  },
  {
    id: 4,
    name: "Boucle Accent Chair",
    category: "Seating",
    price: 15500,
    originalPrice: null,
    rating: 4.6,
    reviews: 43,
    badge: null,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80",
  },
  {
    id: 5,
    name: "Rattan Wall Mirror",
    category: "Decor",
    price: 3800,
    originalPrice: 4500,
    rating: 4.9,
    reviews: 201,
    badge: "Trending",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&q=80",
  },
  {
    id: 6,
    name: "Ceramic Vase Set",
    category: "Decor",
    price: 2200,
    originalPrice: null,
    rating: 4.5,
    reviews: 38,
    badge: "New",
    image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=600&q=80",
  },
];

// ── Design tokens ──
const CREAM   = "#FAF7F2";   // page background
const WARM    = "#F2EDE6";   // card background
const GOLD    = "#B8934A";   // primary accent (deeper, richer gold)
const GOLD_LT = "#C8A97E";   // light gold for subtle touches
const INK     = "#2C2416";   // headings
const MUTED   = "#8C7B6B";   // body / meta text
const BORDER  = "#E8E0D5";   // dividers

const badgeStyles = {
  Bestseller: { background: "#B8934A",     color: "#FAF7F2" },
  New:        { background: "#2C2416",     color: "#C8A97E" },
  Sale:       { background: "#8B3A2F",     color: "#FAF7F2" },
  Trending:   { background: "transparent", color: "#B8934A", border: `1px solid #B8934A` },
};

const StarRating = ({ rating }) => (
    
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <svg key={s} width="9" height="9" viewBox="0 0 24 24"
        fill={s <= Math.round(rating) ? GOLD : "none"}
        stroke={GOLD} strokeWidth="1.8">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
      </svg>
    ))}
  </div>
);

const ProductCard = ({ product }) => {
  const [wishlisted, setWishlisted]   = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleCart = (e) => {
    e.preventDefault();
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1800);
  };

  return (
    <div
      className="group relative flex-shrink-0 overflow-hidden"
      style={{
        width: "290px",
        background: WARM,
        border: `1px solid ${BORDER}`,
      }}
    >
      {/* ── Image ── */}
      <div className="relative overflow-hidden" style={{ height: "320px" }}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Badge */}
        {product.badge && (
          <span
            className="absolute top-3 left-3 px-2.5 py-[5px] text-[0.55rem] font-semibold tracking-[0.18em] uppercase"
            style={{ fontFamily: "'Jost', sans-serif", ...badgeStyles[product.badge] }}
          >
            {product.badge}
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); setWishlisted((w) => !w); }}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center transition-all duration-200"
          style={{
            background: wishlisted ? GOLD : "rgba(250,247,242,0.9)",
            border: `1px solid ${wishlisted ? GOLD : BORDER}`,
          }}
          aria-label="Wishlist"
        >
          <svg width="13" height="13" viewBox="0 0 24 24"
            fill={wishlisted ? "#FAF7F2" : "none"}
            stroke={wishlisted ? "#FAF7F2" : GOLD} strokeWidth="1.8">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Quick Add — slides up on hover */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleCart}
            className="w-full py-3.5 flex items-center justify-center gap-2 border-0 cursor-pointer transition-all duration-300"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontWeight: 500,
              fontSize: "0.62rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              background: addedToCart ? "#4a7a42" : INK,
              color: addedToCart ? "#fff" : GOLD_LT,
            }}
          >
            {addedToCart ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Added to Cart
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                Quick Add
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Card body ── */}
      <div className="px-4 pt-4 pb-5">
        {/* Category */}
        <span
          className="tracking-[0.25em] uppercase block mb-1.5"
          style={{ fontFamily: "'Jost', sans-serif", fontWeight: 400, fontSize: "0.54rem", color: GOLD }}
        >
          {product.category}
        </span>

        {/* Name */}
        <Link to={`/product/${product.id}`} className="no-underline">
          <h3
            className="m-0 leading-snug transition-colors duration-200"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 500,
              fontSize: "1.18rem",
              color: INK,
            }}
            onMouseEnter={e => e.currentTarget.style.color = GOLD}
            onMouseLeave={e => e.currentTarget.style.color = INK}
          >
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-2">
          <StarRating rating={product.rating} />
          <span style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: "0.62rem", color: MUTED }}>
            {product.rating} ({product.reviews})
          </span>
        </div>

        {/* Divider */}
        <div className="mt-3.5 mb-3 h-px" style={{ background: BORDER }} />

        {/* Price */}
        <div className="flex items-center gap-2.5">
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: "1.18rem", color: INK }}>
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          {product.originalPrice && (
            <span className="line-through" style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: "0.78rem", color: MUTED }}>
              ₹{product.originalPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Main Section ──
const FeaturedProducts = () => {
  const scrollRef = useRef(null);
  const [canScrollLeft,  setCanScrollLeft]  = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (dir) =>
    scrollRef.current?.scrollBy({ left: dir === "left" ? -310 : 310, behavior: "smooth" });

  return (
    <section className="py-20 overflow-hidden" style={{ background: CREAM }}>

      {/* ── Header ── */}
      <div className="px-8 md:px-16 lg:px-24 mb-12">
        <div className="flex items-end justify-between">
          <div>
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-4">
              <span className="block w-7 h-px" style={{ background: GOLD }} />
              <span
                className="tracking-[0.42em] uppercase"
                style={{ fontFamily: "'Jost', sans-serif", fontWeight: 400, fontSize: "0.57rem", color: GOLD }}
              >
                Handpicked For You
              </span>
            </div>

            {/* Heading */}
            <h2 className="m-0 leading-[1.1]"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(2rem, 4vw, 3.2rem)", color: INK }}
            >
              Featured{" "}
              <em style={{ fontWeight: 500, fontStyle: "italic", color: GOLD }}>Pieces</em>
            </h2>
          </div>

          {/* Desktop controls */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/shop" className="no-underline flex items-center gap-2 group mr-3">
              <span
                className="transition-colors duration-200 pb-px"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontWeight: 400,
                  fontSize: "0.65rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: MUTED,
                  borderBottom: `1px solid ${GOLD_LT}`,
                }}
              >
                View All
              </span>
              <svg width="16" height="7" viewBox="0 0 18 8" fill="none"
                className="transition-transform duration-300 group-hover:translate-x-1"
                style={{ color: GOLD }}>
                <path d="M0 4H16M13 1L16 4L13 7" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

            {[
              { dir: "left",  disabled: !canScrollLeft,  path: "M15 4H2M5 7L2 4L5 1" },
              { dir: "right", disabled: !canScrollRight, path: "M2 4H15M12 1L15 4L12 7" },
            ].map(({ dir, disabled, path }) => (
              <button key={dir} onClick={() => scroll(dir)} disabled={disabled}
                className="w-10 h-10 flex items-center justify-center transition-all duration-200"
                style={{
                  background: disabled ? "transparent" : INK,
                  border: `1px solid ${disabled ? BORDER : INK}`,
                  cursor: disabled ? "not-allowed" : "pointer",
                  opacity: disabled ? 0.4 : 1,
                }}
              >
                <svg width="15" height="7" viewBox="0 0 18 8" fill="none"
                  style={{ color: disabled ? MUTED : GOLD_LT }}>
                  <path d={path} stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Gold rule */}
        <div className="mt-8 h-px" style={{ background: `linear-gradient(to right, ${GOLD}, transparent)` }} />
      </div>

      {/* ── Carousel ── */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-4 overflow-x-auto pl-8 md:pl-16 lg:pl-24 pr-8"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", scrollSnapType: "x mandatory" }}
      >
        {products.map((p) => (
          <div key={p.id} style={{ scrollSnapAlign: "start" }}>
            <ProductCard product={p} />
          </div>
        ))}
        <div className="flex-shrink-0 w-8 md:w-16" />
      </div>

      <style>{`div::-webkit-scrollbar { display: none; }`}</style>

      {/* Mobile arrows */}
      <div className="flex items-center justify-center gap-3 mt-8 md:hidden">
        {[
          { dir: "left",  path: "M15 4H2M5 7L2 4L5 1" },
          { dir: "right", path: "M2 4H15M12 1L15 4L12 7" },
        ].map(({ dir, path }) => (
          <button key={dir} onClick={() => scroll(dir)}
            className="w-10 h-10 flex items-center justify-center"
            style={{ background: "transparent", border: `1px solid ${BORDER}`, cursor: "pointer" }}
          >
            <svg width="15" height="7" viewBox="0 0 18 8" fill="none" style={{ color: GOLD }}>
              <path d={path} stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;