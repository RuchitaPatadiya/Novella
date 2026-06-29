import { useState } from "react";
import { Link } from "react-router-dom";

const collections = [
  {
    id: 1,
    name: "Luxury Living",
    label: "Signature Collection",
    to: "/collections/luxury-living",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=85",
    height: "520px",
  },
  {
    id: 2,
    name: "New Arrivals",
    label: "Just Landed",
    to: "/collections/new-arrivals",
    image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=85",
    height: "340px",
  },
  {
    id: 3,
    name: "Modern Minimalist",
    label: "Clean & Calm",
    to: "/collections/modern-minimalist",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=85",
    height: "420px",
  },
  {
    id: 4,
    name: "Boho Chic",
    label: "Free-Spirited",
    to: "/collections/boho-chic",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=85",
    height: "460px",
  },
  {
    id: 5,
    name: "Scandinavian",
    label: "Nordic Warmth",
    to: "/collections/scandinavian",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=85",
    height: "340px",
  },
  {
    id: 6,
    name: "Best Sellers",
    label: "Most Loved",
    to: "/collections/best-sellers",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=85",
    height: "380px",
  },
];

const col1 = [collections[0], collections[3]];
const col2 = [collections[1], collections[4]];
const col3 = [collections[2], collections[5]];

const CollectionCard = ({ col }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={col.to}
      className="block no-underline relative overflow-hidden rounded-[10px] cursor-pointer"
      style={{ height: col.height }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={col.image}
        alt={col.name}
        className={`absolute inset-0 w-full h-full object-cover brightness-75 saturate-[0.85] transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${hovered ? "scale-[1.06]" : "scale-100"}`}
      />

      <div className={`absolute inset-0 bg-dark-deep/30 mix-blend-multiply transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-0"}`} />

      <div className="absolute inset-0 bg-gradient-to-t from-dark-deep/88 via-dark-deep/20 to-transparent" />

      <div className={`absolute top-3.5 left-3.5 transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}>
        <div className="w-[18px] h-px bg-gold/30" />
        <div className="w-px h-[18px] bg-gold/30 -mt-px" />
      </div>

      <div className={`absolute bottom-[70px] right-3.5 transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}>
        <div className="w-px h-[18px] bg-gold/30 ml-auto" />
        <div className="w-[18px] h-px bg-gold/30" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between gap-3">
        <div>
          <p className={`font-body font-normal text-[0.52rem] tracking-[0.3em] uppercase text-gold m-0 mb-1 transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-70"}`}>
            {col.label}
          </p>
          <h3 className="font-display font-medium italic text-[clamp(1.2rem,2vw,1.55rem)] text-cream m-0 leading-tight transition-colors duration-300">
            {col.name}
          </h3>
        </div>

        <div className={`w-[38px] h-[38px] rounded-full flex items-center justify-center shrink-0 backdrop-blur-sm transition-all duration-300 ${hovered ? "border-gold bg-gold scale-[1.08]" : "border-cream-muted/25 bg-cream-muted/10 scale-100"}`}>
          <svg width="13" height="6" viewBox="0 0 18 8" fill="none" className={hovered ? "text-background" : "text-cream"}>
            <path d="M0 4H16M13 1L16 4L13 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </Link>
  );
};

const CollectionsSection = () => (
  <section className="bg-background py-20">
    <div className="px-[clamp(1.5rem,5vw,4rem)]">

      <div className="flex items-end justify-between mb-10 gap-6 flex-wrap">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <span className="block w-6 h-px bg-gold" />
            <span className="font-body font-normal text-[0.56rem] tracking-[0.42em] uppercase text-gold">
              Curated for You
            </span>
          </div>
          <h2 className="font-display font-light text-[clamp(2.5rem,5vw,4.2rem)] text-ink m-0 leading-[1.05] tracking-[-0.01em]">
            Shop by{" "}
            <em className="text-gold italic font-medium">Collection</em>
          </h2>
        </div>

        <Link
          to="/collections"
          className="font-body font-normal text-[0.65rem] tracking-[0.2em] uppercase no-underline text-muted border-b border-gold/30 pb-0.5 flex items-center gap-2 transition-colors duration-200 hover:text-gold"
        >
          View All
          <svg width="16" height="7" viewBox="0 0 18 8" fill="none" className="text-gold">
            <path d="M0 4H16M13 1L16 4L13 7" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      <div className="h-px mb-6 bg-gradient-to-r from-gold to-transparent" />

      <div className="grid grid-cols-3 gap-4 items-start collections-grid">
        <div className="flex flex-col gap-4">
          {col1.map(c => <CollectionCard key={c.id} col={c} />)}
        </div>

        <div className="flex flex-col gap-4 mt-12 collections-col-offset">
          {col2.map(c => <CollectionCard key={c.id} col={c} />)}
        </div>

        <div className="flex flex-col gap-4 mt-5 collections-col-offset-sm">
          {col3.map(c => <CollectionCard key={c.id} col={c} />)}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .collections-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .collections-col-offset,
          .collections-col-offset-sm {
            margin-top: 0 !important;
          }
        }
        @media (max-width: 480px) {
          .collections-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  </section>
);

export default CollectionsSection;
