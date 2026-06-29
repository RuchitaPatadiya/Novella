import { useState } from "react";
import { Link } from "react-router-dom";

const images = [
  {
    id: 1,
    space: "Living Room",
    style: "Modern Minimalist",
    to: "/spaces/living-room",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=85",
  },
  {
    id: 2,
    space: "Bedroom",
    style: "Luxury Living",
    to: "/spaces/bedroom",
    image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=900&q=85",
  },
  {
    id: 3,
    space: "Home Office",
    style: "Scandinavian",
    to: "/spaces/home-office",
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=900&q=85",
  },
  {
    id: 4,
    space: "Dining Room",
    style: "Boho Chic",
    to: "/spaces/dining-room",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=900&q=85",
  },
  {
    id: 5,
    space: "Outdoor",
    style: "Modern Minimalist",
    to: "/spaces/outdoor",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=900&q=85",
  },
  {
    id: 6,
    space: "Living Room",
    style: "Luxury Living",
    to: "/spaces/living-room",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=85",
  },
];

const GalleryCard = ({ item }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={item.to}
      className="flex flex-col h-full overflow-hidden border border-border bg-background no-underline group hover:border-bronze/40 transition-colors duration-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative flex-1 min-h-[180px] overflow-hidden bg-surface">
        <img
          src={item.image}
          alt={item.space}
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${hovered ? "scale-105" : "scale-100"}`}
        />
      </div>

      <div className="shrink-0 p-4 border-t border-border bg-background flex items-end justify-between gap-3">
        <div>
          <p className="font-body font-normal text-[0.5rem] tracking-[0.28em] uppercase text-muted m-0 mb-1">
            {item.style}
          </p>
          <h3 className="font-display font-medium text-[1.05rem] text-ink m-0 leading-tight group-hover:text-bronze transition-colors duration-200">
            {item.space}
          </h3>
        </div>

        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
          hovered ? "bg-bronze border-bronze" : "bg-surface border-border"
        } border`}>
          <svg width="11" height="5" viewBox="0 0 18 8" fill="none"
            className={hovered ? "text-background" : "text-bronze"}>
            <path d="M0 4H16M13 1L16 4L13 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </Link>
  );
};

export default function InspirationGallery() {
  return (
    <section className="bg-surface py-16 md:py-20 px-[clamp(1.5rem,5vw,4rem)] border-b border-border">

      <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <span className="block w-5 h-px bg-bronze" />
            <span className="font-body font-normal text-[0.55rem] tracking-[0.4em] uppercase text-bronze">
              Get Inspired
            </span>
          </div>
          <h2 className="font-display font-light text-[clamp(2rem,4vw,3.2rem)] text-ink m-0 leading-[1.1]">
            Spaces that{" "}
            <em className="text-bronze font-medium italic">inspire</em>
          </h2>
        </div>

        <Link
          to="/collections"
          className="no-underline hidden md:flex items-center gap-2 font-body font-normal text-[0.65rem] tracking-[0.2em] uppercase text-muted border-b border-bronze/40 pb-0.5 hover:text-bronze transition-colors duration-200"
        >
          View All Collections
          <svg width="14" height="6" viewBox="0 0 18 8" fill="none" className="text-bronze">
            <path d="M0 4H16M13 1L16 4L13 7" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      <div className="h-px mb-8 bg-gradient-to-r from-bronze to-transparent" />

      <div className="hidden lg:block">
        <div className="flex gap-3 mb-3 h-[340px]">
          <div className="relative shrink-0 w-[33%] h-full">
            <GalleryCard item={images[0]} />
          </div>
          <div className="relative flex-1 h-full">
            <GalleryCard item={images[1]} />
          </div>
          <div className="relative flex-1 h-full">
            <GalleryCard item={images[2]} />
          </div>
        </div>

        <div className="flex gap-3 h-[280px]">
          <div className="relative flex-1 h-full">
            <GalleryCard item={images[3]} />
          </div>
          <div className="relative w-[58%] h-full">
            <GalleryCard item={images[4]} />
          </div>
        </div>
      </div>

      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3">
        {images.map(item => (
          <div key={item.id} className="relative h-[260px]">
            <GalleryCard item={item} />
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <p className="font-body font-light text-[0.82rem] text-muted mb-5 tracking-[0.04em]">
          Find your aesthetic and shop the look
        </p>
        <Link
          to="/collections"
          className="no-underline inline-flex items-center gap-3 font-body font-medium text-[0.63rem] tracking-[0.28em] uppercase bg-ink text-cream-muted px-8 py-3.5 transition-all duration-300 hover:bg-bronze hover:text-white"
        >
          Explore Collections
          <svg width="16" height="7" viewBox="0 0 18 8" fill="none">
            <path d="M0 4H16M13 1L16 4L13 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
