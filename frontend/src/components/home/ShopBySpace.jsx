import { Link } from "react-router-dom";

const spaces = [
  {
    id: "living-room",
    name: "Living Room",
    tagline: "The heart of every home",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=85",
  },
  {
    id: "bedroom",
    name: "Bedroom",
    tagline: "Rest in refined comfort",
    image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=900&q=85",
  },
  {
    id: "dining-room",
    name: "Dining Room",
    tagline: "Gather around beauty",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=900&q=85",
  },
];

export default function ShopBySpace() {
  return (
    <section className="bg-background py-16 md:py-20 border-t border-border">
      <div className="px-[clamp(1.5rem,5vw,4rem)]">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="block w-5 h-px bg-bronze" />
              <span className="font-body font-normal text-[0.55rem] tracking-[0.38em] uppercase text-bronze">
                Design by Room
              </span>
            </div>
            <h2 className="font-display font-light text-[clamp(1.8rem,3.5vw,2.8rem)] text-ink m-0 leading-[1.1]">
              Shop by{" "}
              <em className="text-bronze font-medium italic">Space</em>
            </h2>
          </div>
          <Link
            to="/spaces"
            className="no-underline flex items-center gap-2 font-body font-normal text-[0.65rem] tracking-[0.2em] uppercase text-muted hover:text-bronze transition-colors duration-200 self-start md:self-auto"
          >
            Explore All Spaces
            <svg width="14" height="6" viewBox="0 0 18 8" fill="none" className="text-bronze">
              <path d="M0 4H16M13 1L16 4L13 7" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {spaces.map((space) => (
            <Link
              key={space.id}
              to={`/spaces/${space.id}`}
              className="group relative overflow-hidden h-[280px] md:h-[360px] no-underline border border-border/40"
            >
              <img
                src={space.image}
                alt={space.name}
                className="absolute inset-0 w-full h-full object-cover brightness-[0.78] transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-deep/90 via-dark/30 to-transparent" />

              <div className="absolute top-0 left-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute top-0 left-0 w-full h-px bg-bronze" />
                <div className="absolute top-0 left-0 h-full w-px bg-bronze" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-display font-medium text-[clamp(1.4rem,2.5vw,1.9rem)] text-cream m-0 mb-1 leading-tight">
                  {space.name}
                </h3>
                <p className="font-body font-light text-[0.75rem] text-cream-muted/60 m-0 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                  {space.tagline}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
