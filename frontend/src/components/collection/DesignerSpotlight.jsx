import { useState } from "react";
import { Link } from "react-router-dom";

const designers = [
  {
    name: "Ananya Kapoor",
    title: "Lead Interior Architect",
    specialty: "Modern Minimalist",
    quote:
      "True luxury isn't about excess — it's the discipline of choosing only what brings meaning to a space.",
    image:
      "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=600&q=80",
    roomImage:
      "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=900&q=85",
    palette: ["#f5f0e8", "#2c2416", "#b07d3a", "#e8e0d5"],
    collection: "modern-minimalist",
    stats: { projects: "240+", awards: "12", years: "8" },
  },
  {
    name: "Vikram Mehta",
    title: "Sustainable Design Director",
    specialty: "Scandinavian",
    quote:
      "Good design is invisible. A home should feel like it grew naturally around you, not like it was assembled.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    roomImage:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=85",
    palette: ["#fdfaf6", "#8a7d6b", "#c9a84c", "#f0e6d3"],
    collection: "scandinavian",
    stats: { projects: "180+", awards: "9", years: "11" },
  },
  {
    name: "Priya Sharma",
    title: "Creative Director, Spaces",
    specialty: "Boho Chic",
    quote:
      "Every room should tell a story. I design spaces that feel collected over a lifetime, not purchased in a day.",
    image:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80",
    roomImage:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?w=900&q=85",
    palette: ["#e8e0d5", "#b07d3a", "#2c2416", "#faf0e0"],
    collection: "boho-chic",
    stats: { projects: "320+", awards: "18", years: "14" },
  },
];

export default function DesignerSpotlight() {
  const [active, setActive] = useState(0);
  const d = designers[active];

  return (
    <section className="bg-background py-0 border-b border-border overflow-hidden">
      <div className="flex flex-col lg:flex-row min-h-[640px]">
        {/* Left — Designer Profile */}
        <div className="flex flex-col justify-center py-16 lg:py-20 px-[clamp(2rem,8vw,6rem)] lg:w-[42%] flex-shrink-0 bg-surface relative border-r border-border">
          {/* Decorative corner marks */}
          <div className="absolute top-8 left-8 opacity-45">
            <div className="w-px h-7 bg-bronze" />
            <div className="w-7 h-px bg-bronze" />
          </div>
          <div className="absolute bottom-8 right-8 opacity-45">
            <div className="w-7 h-px bg-bronze ml-auto" />
            <div className="w-px h-7 bg-bronze ml-auto" />
          </div>

          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6">
            <span className="block w-6 h-px bg-bronze" />
            <span className="font-body font-light text-[0.55rem] tracking-[0.42em] uppercase text-bronze">
              Designer Spotlight
            </span>
          </div>

          {/* Designer name */}
          <h2 className="font-display font-light text-[clamp(2rem,4.5vw,3.2rem)] text-ink leading-[1.05] tracking-[-0.01em] m-0 mb-1.5 animate-fadeIn">
            {d.name}
          </h2>

          <p className="font-body font-normal text-[0.6rem] tracking-[0.25em] uppercase text-bronze m-0 mb-6">
            {d.title}
          </p>

          <div className="w-10 h-px bg-border mb-6" />

          {/* Quote */}
          <blockquote className="font-display font-light italic text-[clamp(1rem,2vw,1.3rem)] text-ink leading-[1.8] tracking-[0.01em] m-0 mb-8 pl-5 border-l-2 border-bronze/40">
            "{d.quote}"
          </blockquote>

          {/* Stats */}
          <div className="flex items-center gap-8 mb-8 pb-8 border-b border-border">
            {[
              { number: d.stats.projects, label: "Projects" },
              { number: d.stats.awards, label: "Awards" },
              { number: d.stats.years, label: "Years" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col">
                <span className="font-display font-semibold text-[clamp(1.2rem,2.5vw,1.6rem)] text-bronze leading-none mb-1">
                  {stat.number}
                </span>
                <span className="font-body font-light text-[0.5rem] tracking-[0.22em] uppercase text-muted">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Palette */}
          <div className="flex items-center gap-3 mb-8">
            <span className="font-body font-normal text-[0.5rem] tracking-[0.2em] uppercase text-muted mr-1">
              Palette
            </span>
            {d.palette.map((color, i) => (
              <div
                key={i}
                className="w-5 h-5 rounded-full border border-border"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          {/* CTA */}
          <Link
            to={`/collections/${d.collection}`}
            className="no-underline self-start inline-flex items-center gap-3 font-body font-medium text-[0.63rem] tracking-[0.28em] uppercase text-background bg-ink px-8 py-3.5 transition-all duration-300 hover:bg-bronze hover:text-white"
          >
            Shop {d.specialty}
            <svg width="16" height="7" viewBox="0 0 18 8" fill="none">
              <path
                d="M0 4H16M13 1L16 4L13 7"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          {/* Designer selector dots */}
          <div className="flex items-center gap-4 mt-10">
            {designers.map((designer, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`relative w-10 h-10 rounded-full overflow-hidden border-2 cursor-pointer transition-all duration-300 ${
                  active === i
                    ? "border-bronze scale-110"
                    : "border-border opacity-60 hover:opacity-100"
                }`}
                aria-label={`View ${designer.name}`}
              >
                <img
                  src={designer.image}
                  alt={designer.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right — Room Image */}
        <div className="relative flex-1 min-h-[440px] lg:min-h-0 overflow-hidden">
          {designers.map((designer, i) => (
            <img
              key={i}
              src={designer.roomImage}
              alt={`${designer.specialty} room`}
              className={`absolute inset-0 w-full h-full object-cover brightness-[0.95] saturate-[0.9] transition-opacity duration-700 ${
                active === i ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}

          {/* Subtle gradient overlay from left */}
          <div className="absolute inset-0 bg-gradient-to-r from-surface/50 via-transparent to-transparent pointer-events-none" />

          {/* Tag */}
          <div className="absolute top-6 right-6">
            <span className="font-body font-normal text-[0.52rem] tracking-[0.3em] uppercase text-bronze px-3 py-1.5 border border-border bg-background/90 rounded-sm">
              {d.specialty}
            </span>
          </div>

          {/* Big quote mark */}
          <div className="absolute bottom-8 right-8 font-display text-[8rem] leading-none text-bronze/10 select-none hidden lg:block">
            "
          </div>

          {/* Designer portrait (floating) */}
          <div className="absolute bottom-8 left-8 hidden lg:block">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-bronze/40 shadow-md">
              <img
                src={d.image}
                alt={d.name}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="font-body font-medium text-[0.55rem] tracking-[0.15em] uppercase text-ink mt-2">
              {d.name}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
