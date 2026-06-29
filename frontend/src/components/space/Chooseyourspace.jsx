import { useState } from "react";
import { Link } from "react-router-dom";

const spaces = [
  {
    id: "living-room",
    name: "Living Room",
    number: "01",
    to: "/spaces/living-room",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=85",
  },
  {
    id: "bedroom",
    name: "Bedroom",
    number: "02",
    to: "/spaces/bedroom",
    image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=85",
  },
  {
    id: "dining-room",
    name: "Dining Room",
    number: "03",
    to: "/spaces/dining-room",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1200&q=85",
  },
  {
    id: "home-office",
    name: "Home Office",
    number: "04",
    to: "/spaces/home-office",
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1200&q=85",
  },
  {
    id: "outdoor",
    name: "Outdoor",
    number: "05",
    to: "/spaces/outdoor",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=85",
  },
];

export default function ChooseYourSpace() {
  const [active, setActive] = useState(0);

  return (
    <section className="bg-surface border-b border-border py-16 md:py-20">
      <div className="px-[clamp(1.5rem,5vw,4rem)] mb-10">

        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="block w-5 h-px bg-bronze" />
              <span className="font-body font-normal text-[0.55rem] tracking-[0.4em] uppercase text-bronze">
                Browse by Room
              </span>
            </div>
            <h2 className="font-display font-light text-[clamp(2rem,4vw,3.2rem)] text-ink m-0 leading-[1.1]">
              Choose Your{" "}
              <em className="text-bronze font-medium italic">Space</em>
            </h2>
          </div>
          <Link
            to="/shop"
            className="no-underline hidden md:flex items-center gap-2 font-body font-normal text-[0.65rem] tracking-[0.2em] uppercase text-muted border-b border-bronze/40 pb-0.5 hover:text-bronze transition-colors duration-200"
          >
            Browse All
            <svg width="14" height="6" viewBox="0 0 18 8" fill="none" className="text-bronze">
              <path d="M0 4H16M13 1L16 4L13 7" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="mx-[clamp(1.5rem,5vw,4rem)] flex flex-col lg:flex-row lg:h-[520px] border border-border bg-background overflow-hidden">

        <div
          className="flex flex-col justify-center bg-background shrink-0 border-b lg:border-b-0 lg:border-r border-border w-full lg:w-[clamp(200px,25vw,320px)] px-[clamp(1.5rem,4vw,3.5rem)] py-8 lg:py-0"
        >
          {spaces.map((space, i) => {
            const isActive = i === active;
            return (
              <button
                key={space.id}
                onClick={() => setActive(i)}
                className="text-left border-none bg-transparent cursor-pointer py-4 border-b border-border last:border-b-0 flex items-center gap-4 transition-all duration-300"
              >
                <span
                  className={`font-display font-light italic text-[0.78rem] shrink-0 transition-all duration-300 ${
                    isActive ? "text-bronze" : "text-border"
                  }`}
                >
                  {space.number}
                </span>

                <span
                  className={`block shrink-0 h-px bg-bronze transition-all duration-300 ${
                    isActive ? "w-6" : "w-0"
                  }`}
                />

                <span
                  className={`font-display transition-all duration-300 tracking-[-0.01em] ${
                    isActive
                      ? "font-medium text-[clamp(1.2rem,2vw,1.55rem)] text-ink"
                      : "font-light text-[clamp(1rem,1.6vw,1.25rem)] text-muted"
                  }`}
                >
                  {space.name}
                </span>
              </button>
            );
          })}

          <Link
            to={spaces[active].to}
            className="no-underline mt-6 inline-flex items-center gap-2 font-body font-medium text-[0.6rem] tracking-[0.22em] uppercase text-bronze transition-colors duration-200 hover:text-ink"
          >
            Shop {spaces[active].name}
            <svg width="14" height="6" viewBox="0 0 18 8" fill="none">
              <path d="M0 4H16M13 1L16 4L13 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <div className="relative flex-1 min-h-[320px] lg:min-h-0 bg-surface">
          {spaces.map((space, i) => (
            <div
              key={space.id}
              className={`absolute inset-0 transition-all duration-700 ${
                i === active ? "opacity-100 scale-100 z-10" : "opacity-0 scale-[1.03] z-0"
              }`}
            >
              <img
                src={space.image}
                alt={space.name}
                className="w-full h-full object-cover"
              />

              <div className="absolute bottom-0 left-0 right-0 bg-background/90 backdrop-blur-sm border-t border-border px-6 py-4 flex items-center justify-between">
                <p className="font-display font-medium text-[1.1rem] text-ink m-0">
                  {space.name}
                </p>
                <span className="font-body font-light text-[0.62rem] tracking-[0.15em] uppercase text-muted">
                  {space.number} / 05
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
