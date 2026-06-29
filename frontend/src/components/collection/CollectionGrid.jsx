import { useState } from "react";
import { Link } from "react-router-dom";

const collections = [
  {
    id: 1,
    name: "Modern Minimalist",
    tagline: "Clean lines, calm spaces",
    count: "86 pieces",
    to: "/collections/modern-minimalist",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=85",
    size: "large",
  },
  {
    id: 2,
    name: "Luxury Living",
    tagline: "Opulence, refined",
    count: "124 pieces",
    to: "/collections/luxury-living",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=85",
    size: "small",
  },
  {
    id: 3,
    name: "Scandinavian",
    tagline: "Nordic warmth & simplicity",
    count: "72 pieces",
    to: "/collections/scandinavian",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=900&q=85",
    size: "small",
  },
  {
    id: 4,
    name: "Boho Chic",
    tagline: "Layered, free-spirited",
    count: "98 pieces",
    to: "/collections/boho-chic",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=900&q=85",
    size: "wide",
  },
  {
    id: 5,
    name: "New Arrivals",
    tagline: "Just landed this season",
    count: "48 pieces",
    to: "/collections/new-arrivals",
    image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=900&q=85",
    size: "small",
  },
  {
    id: 6,
    name: "Best Sellers",
    tagline: "Our most loved pieces",
    count: "60 pieces",
    to: "/collections/best-sellers",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=85",
    size: "small",
  },
];

const CollectionCard = ({ col }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={col.to}
      className="no-underline flex flex-col h-full overflow-hidden border border-border bg-background group hover:border-bronze/40 transition-colors duration-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative flex-1 min-h-0 overflow-hidden bg-surface">
        <img
          src={col.image}
          alt={col.name}
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${hovered ? "scale-105" : "scale-100"}`}
        />

        <span
          className={`absolute top-3 left-3 font-body font-normal text-[0.5rem] tracking-[0.22em] uppercase text-bronze px-2.5 py-1 border border-border bg-background/90 transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}
        >
          {col.count}
        </span>

        <span
          className={`absolute top-3 right-4 font-display font-light italic text-ink/20 text-[clamp(1.5rem,3vw,2.5rem)] leading-none transition-opacity duration-300 ${hovered ? "opacity-0" : "opacity-100"}`}
        >
          {String(col.id).padStart(2, "0")}
        </span>
      </div>

      <div className="shrink-0 p-4 border-t border-border bg-background flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p
            className={`font-body font-light text-[0.72rem] text-muted m-0 mb-1 tracking-[0.04em] transition-all duration-300 ${hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}
          >
            {col.tagline}
          </p>
          <h3 className="font-display font-medium text-[clamp(1.05rem,2vw,1.45rem)] text-ink m-0 leading-tight group-hover:text-bronze transition-colors duration-200">
            {col.name}
          </h3>
        </div>

        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${
            hovered ? "bg-bronze border-bronze" : "bg-surface border-border"
          }`}
        >
          <svg
            width="11" height="5" viewBox="0 0 18 8" fill="none"
            className={hovered ? "text-background" : "text-bronze"}
          >
            <path d="M0 4H16M13 1L16 4L13 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </Link>
  );
};

export default function CollectionsGrid() {
  return (
    <section
      id="collections-grid"
      className="bg-surface py-20 px-[clamp(1.5rem,5vw,4rem)] border-b border-border"
    >
      <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <span className="block w-5 h-px bg-bronze" />
            <span className="font-body font-normal text-[0.55rem] tracking-[0.4em] uppercase text-bronze">
              All Collections
            </span>
          </div>
          <h2 className="font-display font-light text-[clamp(2rem,4vw,3.2rem)] text-ink m-0 leading-[1.1]">
            Six Curated{" "}
            <em className="text-bronze font-medium italic">Worlds</em>
          </h2>
        </div>

        <p className="font-body font-light text-[0.82rem] text-muted max-w-xs leading-relaxed hidden md:block tracking-[0.03em]">
          Each collection is a distinct aesthetic — find the one that feels like home.
        </p>
      </div>

      <div className="h-px mb-10 bg-gradient-to-r from-bronze/40 to-transparent" />

      <div className="hidden lg:block">
        <div className="flex gap-3">
          <div className="relative flex-shrink-0" style={{ width: "33%", height: "680px" }}>
            <CollectionCard col={collections[0]} />
          </div>

          <div className="flex flex-col gap-3 flex-1">
            <div className="flex gap-3" style={{ height: "320px" }}>
              <div className="relative flex-1">
                <CollectionCard col={collections[1]} />
              </div>
              <div className="relative flex-1">
                <CollectionCard col={collections[2]} />
              </div>
            </div>

            <div className="flex gap-3" style={{ height: "348px" }}>
              <div className="relative" style={{ width: "55%" }}>
                <CollectionCard col={collections[3]} />
              </div>
              <div className="flex flex-col gap-3 flex-1">
                <div className="relative flex-1">
                  <CollectionCard col={collections[4]} />
                </div>
                <div className="relative flex-1">
                  <CollectionCard col={collections[5]} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3">
        {collections.map(col => (
          <div key={col.id} className="relative" style={{ height: "320px" }}>
            <CollectionCard col={col} />
          </div>
        ))}
      </div>
    </section>
  );
}
