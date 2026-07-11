import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";

const fallbackSpaces = [
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
  const [spaces, setSpaces] = useState(fallbackSpaces);

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const res = await API.get("/cms/home_spaces");
        if (res.data && Array.isArray(res.data)) {
          setSpaces(res.data);
        }
      } catch (err) {
        console.error("Failed to load CMS spaces settings:", err);
      }
    };
    fetchSpaces();
  }, []);

  return (
    <section className="bg-background py-20 md:py-24 border-t border-border">
      <div className="px-[clamp(1.5rem,5vw,4rem)]">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-3.5">
              <span className="block w-5 h-px bg-bronze" />
              <span className="font-body font-normal text-[0.55rem] tracking-[0.38em] uppercase text-bronze">
                Design by Room
              </span>
            </div>
            <h2 className="font-display font-light text-[clamp(1.8rem,3.5vw,2.8rem)] text-ink m-0 leading-[1.1]">
              Shop by <em className="text-bronze font-medium italic">Space</em>
            </h2>
          </div>
          
          <Link
            to="/spaces"
            className="no-underline flex items-center gap-2 font-body font-normal text-[0.65rem] tracking-[0.2em] uppercase text-muted hover:text-bronze transition-colors duration-200 self-start md:self-auto"
          >
            <span>Explore All Spaces</span>
            <svg width="14" height="6" viewBox="0 0 18 8" fill="none" className="text-bronze">
              <path d="M0 4H16M13 1L16 4L13 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* Bento Asymmetrical Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {spaces.map((space) => (
            <Link
              key={space.id}
              to={`/spaces/${space.id}`}
              className={`group relative overflow-hidden h-[360px] md:h-[400px] no-underline rounded-[24px] border border-border/50 shadow-sm hover:shadow-md transition-all duration-500 ${
                space.id === "living-room" ? "md:col-span-2" : "md:col-span-1"
              }`}
            >
              {/* Zoom image backdrop */}
              <img
                src={space.image}
                alt={space.name}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-[800ms] group-hover:scale-105 group-hover:brightness-[0.9]"
              />
              <div className="absolute inset-0 bg-dark/10 group-hover:bg-dark/20 transition-all duration-500" />

              {/* Floating Glassmorphic Panel */}
              <div className="absolute bottom-5 left-5 right-5 p-5 bg-background/90 backdrop-blur-md border border-border/40 rounded-[18px] transition-all duration-500 group-hover:bg-ink group-hover:border-ink/80 flex items-center justify-between shadow-sm">
                <div>
                  <h3 className="font-display font-medium text-[1.12rem] text-ink m-0 leading-tight group-hover:text-cream transition-colors duration-300">
                    {space.name}
                  </h3>
                  <span className="font-body font-light text-[0.68rem] text-muted tracking-wide mt-1 block group-hover:text-gold transition-colors duration-300">
                    {space.tagline}
                  </span>
                </div>
                
                {/* Clean Circular Arrow */}
                <div className="w-8 h-8 rounded-full border border-border bg-background flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-bronze group-hover:border-bronze group-hover:text-white">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-bronze group-hover:text-white transition-colors duration-300">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
