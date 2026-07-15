import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";

const defaultCollections = [
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
      className="no-underline flex flex-col h-full overflow-hidden rounded-[24px] border border-border bg-background shadow-xs group hover:border-bronze/40 hover:shadow-md transition-all duration-500"
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
          className={`absolute top-4 left-4 font-body font-normal text-[0.52rem] tracking-[0.22em] uppercase text-bronze px-3 py-1 border border-border/80 bg-background/95 rounded-full transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}
        >
          {col.count}
        </span>

        <span
          className={`absolute top-4 right-5 font-display font-light italic text-ink/20 text-[clamp(1.5rem,3vw,2.5rem)] leading-none transition-opacity duration-300 ${hovered ? "opacity-0" : "opacity-100"}`}
        >
          {String(col.id).padStart(2, "0")}
        </span>
      </div>

      <div className="shrink-0 p-5 border-t border-border bg-background flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p
            className={`font-body font-light text-[0.7rem] text-muted m-0 mb-1.5 tracking-[0.04em] transition-all duration-300 ${hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}
          >
            {col.tagline}
          </p>
          <h3 className="font-display font-medium text-[clamp(1.05rem,2vw,1.45rem)] text-ink m-0 leading-tight group-hover:text-bronze transition-colors duration-200">
            {col.name}
          </h3>
        </div>

        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${
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
  const [dbCollections, setDbCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCollections = async () => {
      try {
        const res = await API.get("/collections");
        setDbCollections(res.data);
      } catch (err) {
        console.error("Failed to load grid collections:", err);
      } finally {
        setLoading(false);
      }
    };
    getCollections();
  }, []);

  const displayCollections = dbCollections.length > 0
    ? dbCollections.map((col, idx) => ({
        id: idx + 1,
        name: col.name,
        tagline: col.tagline || "",
        count: "View Collection",
        to: `/collections/${col.slug}`,
        image: col.image || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=85",
      }))
    : defaultCollections;

  if (loading) {
    return (
      <div className="bg-surface py-20 px-[clamp(1.5rem,5vw,4rem)] text-center font-body text-xs text-muted tracking-widest uppercase animate-pulse">
        Loading Curated Worlds...
      </div>
    );
  }

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
            {displayCollections.length} Curated{" "}
            <em className="text-bronze font-medium italic">Worlds</em>
          </h2>
        </div>

        <p className="font-body font-light text-[0.82rem] text-muted max-w-xs leading-relaxed hidden md:block tracking-[0.03em]">
          Each collection is a distinct aesthetic — find the one that feels like home.
        </p>
      </div>

      <div className="h-px mb-10 bg-gradient-to-r from-bronze/40 to-transparent" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayCollections.map((col) => (
          <div key={col.id} className="relative h-[320px] sm:h-[350px] md:h-[380px] lg:h-[400px]">
            <CollectionCard col={col} />
          </div>
        ))}
      </div>
    </section>
  );
}
