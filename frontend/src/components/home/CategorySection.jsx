import { Link } from "react-router-dom";

const categories = [
  {
    id: 1,
    name: "Living Room",
    tagline: "The heart of every home",
    count: "320+ pieces",
    to: "/shop?category=living-room",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=85",
    size: "large",
  },
  {
    id: 2,
    name: "Bedroom",
    tagline: "Rest in refined comfort",
    count: "210+ pieces",
    to: "/shop?category=bedroom",
    image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=700&q=85",
    size: "medium",
  },
  {
    id: 3,
    name: "Lighting",
    tagline: "Set the perfect mood",
    count: "180+ pieces",
    to: "/shop?category=lighting",
    image: "https://plus.unsplash.com/premium_photo-1764698611271-0244f7b85469?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    size: "medium",
  },
  {
    id: 4,
    name: "Dining",
    tagline: "Gather around beauty",
    count: "140+ pieces",
    to: "/shop?category=dining",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=700&q=85",
    size: "medium",
  },
  {
    id: 5,
    name: "Decor & Accents",
    tagline: "Details that define a space",
    count: "400+ pieces",
    to: "/shop?category=decor",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=700&q=85",
    size: "large-wide",
  },
];

const CategoryTile = ({ cat, className = "", style = {} }) => (
  <Link
    to={cat.to}
    className={`group relative overflow-hidden block no-underline ${className}`}
    style={{ ...style }}
  >
    <img
      src={cat.image}
      alt={cat.name}
      className="absolute inset-0 w-full h-full object-cover brightness-[0.82] transition-transform duration-700 group-hover:scale-105"
    />

    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-bronze/25 mix-blend-multiply" />

    <div className="absolute inset-0 bg-gradient-to-t from-dark/82 via-dark/25 to-transparent" />

    <div className="absolute top-0 left-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <div className="absolute top-0 left-0 w-full h-px bg-gold" />
      <div className="absolute top-0 left-0 h-full w-px bg-gold" />
    </div>
    <div className="absolute bottom-0 right-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <div className="absolute bottom-0 right-0 w-full h-px bg-gold" />
      <div className="absolute bottom-0 right-0 h-full w-px bg-gold" />
    </div>

    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-7">
      <span className="inline-block mb-3 px-2.5 py-1 font-body font-normal text-[0.55rem] tracking-[0.22em] uppercase text-gold border border-gold/35 bg-dark/40 backdrop-blur-sm">
        {cat.count}
      </span>

      <h3 className="m-0 leading-tight mb-1.5 font-display font-medium text-[clamp(1.4rem,2.5vw,2rem)] text-cream transition-colors duration-300">
        {cat.name}
      </h3>

      <p className="m-0 font-body font-light text-[0.75rem] tracking-[0.06em] text-cream-muted/65 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
        {cat.tagline}
      </p>

      <div className="flex items-center gap-2 mt-3 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 [transition-delay:60ms]">
        <span className="font-body font-medium text-[0.6rem] tracking-[0.22em] uppercase text-gold">
          Explore
        </span>
        <svg width="16" height="7" viewBox="0 0 18 8" fill="none" className="text-gold">
          <path d="M0 4H16M13 1L16 4L13 7" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  </Link>
);

const CategorySection = () => (
  <section className="py-20 bg-background">
    <div className="px-8 md:px-16 lg:px-24">

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="block w-7 h-px bg-bronze" />
            <span className="font-body font-normal text-[0.57rem] tracking-[0.42em] uppercase text-bronze">
              Browse by Space
            </span>
          </div>
          <h2 className="m-0 leading-[1.1] font-display font-light text-[clamp(2rem,4vw,3.2rem)] text-ink">
            Shop by{" "}
            <em className="font-medium italic text-bronze">Spaces</em>
          </h2>
        </div>

        <Link to="/shop" className="no-underline flex items-center gap-2 group mt-4 md:mt-0">
          <span className="font-body font-normal text-[0.65rem] tracking-[0.2em] uppercase text-muted border-b border-gold pb-0.5 transition-colors duration-200 group-hover:text-bronze">
            All Categories
          </span>
          <svg
            width="16" height="7" viewBox="0 0 18 8" fill="none"
            className="text-bronze transition-transform duration-300 group-hover:translate-x-1"
          >
            <path d="M0 4H16M13 1L16 4L13 7" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      <div className="mb-8 h-px bg-gradient-to-r from-bronze to-transparent" />

      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "320px 260px",
        }}
      >
        <CategoryTile cat={categories[0]} style={{ gridColumn: "1", gridRow: "1 / 3" }} />
        <CategoryTile cat={categories[1]} style={{ gridColumn: "2", gridRow: "1" }} />
        <CategoryTile cat={categories[2]} style={{ gridColumn: "3", gridRow: "1 / 3" }} />
        <CategoryTile cat={categories[3]} style={{ gridColumn: "2", gridRow: "2" }} />
      </div>

      <div className="mt-3">
        <CategoryTile cat={categories[4]} style={{ height: "220px", width: "100%" }} />
      </div>

      <style>{`
        @media (max-width: 768px) {
          .cat-grid {
            display: flex !important;
            flex-direction: column;
            gap: 12px;
          }
          .cat-grid > * {
            grid-column: unset !important;
            grid-row: unset !important;
            height: 240px !important;
          }
        }
      `}</style>
    </div>
  </section>
);

export default CategorySection;
