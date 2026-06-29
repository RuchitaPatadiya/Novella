import { Link } from "react-router-dom";

export default function CollectionsHero() {
  return (
    <div className="relative h-[58vh] min-h-[420px] bg-dark-deep flex items-center justify-center overflow-hidden">

      {/* Background image */}
      <img
        src="https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=1600&q=85"
        alt="Collections"
        className="absolute inset-0 w-full h-full object-cover object-[center_40%]"
        style={{ filter: "brightness(0.42) saturate(0.85)" }}
      />

      {/* Warm amber multiply overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(40,18,2,0.35)", mixBlendMode: "multiply" }}
      />

      {/* Bottom gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark-deep/80 via-dark-deep/15 to-transparent" />

      {/* Left gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-dark-deep/30 via-transparent to-transparent" />

      {/* Decorative left vertical line */}
      <div
        className="absolute left-10 top-[18%] bottom-[18%] w-px hidden md:block"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(201,168,76,0.3), transparent)" }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl">

        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-3 mb-5">
          <span className="block w-8 h-px bg-gold" />
          <span className="font-body font-light text-[0.57rem] tracking-[0.45em] uppercase text-gold">
            Novella Edit
          </span>
          <span className="block w-8 h-px bg-gold" />
        </div>

        {/* Heading */}
        <h1 className="font-display font-light text-[clamp(2.8rem,6.5vw,5.5rem)] text-cream m-0 leading-[1.05] tracking-[-0.01em]">
          Find Your{" "}
          <em className="text-gold font-medium italic">Aesthetic</em>
        </h1>

        {/* Subtext */}
        <p className="font-body font-light text-[0.88rem] text-cream-muted/50 mt-4 mb-8 tracking-[0.04em] leading-relaxed max-w-md mx-auto">
          Six curated worlds. One home. Discover the collection that speaks to you.
        </p>

        {/* CTAs */}
        <div className="flex items-center justify-center gap-5 flex-wrap">
          <Link
            to="#collections-grid"
            className="no-underline inline-flex items-center gap-3 font-body font-medium text-[0.63rem] tracking-[0.28em] uppercase text-dark-deep bg-gold px-8 py-3.5 transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_40px_rgba(201,168,76,0.3)]"
          >
            Browse Collections
            <svg width="16" height="7" viewBox="0 0 18 8" fill="none">
              <path d="M0 4H16M13 1L16 4L13 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>

          <Link
            to="/shop"
            className="no-underline inline-flex items-center gap-2.5 font-body font-normal text-[0.63rem] tracking-[0.28em] uppercase text-cream-muted/55 hover:text-cream transition-colors duration-300"
          >
            Shop All
            <svg width="16" height="7" viewBox="0 0 18 8" fill="none" className="text-gold">
              <path d="M0 4H16M13 1L16 4L13 7" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>


      {/* Collection count — bottom right */}
      {/* <div className="absolute bottom-5 right-[clamp(1.5rem,5vw,4rem)] hidden md:flex items-center gap-2.5">
        <span
          className="font-display font-light italic text-[clamp(1.2rem,2vw,1.6rem)] text-gold/40"
        >
          06
        </span>
        <span className="font-body font-light text-[0.55rem] tracking-[0.25em] uppercase text-cream-muted/30">
          Collections
        </span>
      </div> */}

      {/* Scroll indicator */}
      <div className="absolute bottom-5 left-15/16 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 opacity-35">
        <div className="w-px h-10 bg-cream-muted/20 relative overflow-hidden">
          <div
            className="absolute top-0 left-0 w-full bg-gold"
            style={{ height: "45%", animation: "scrollDrop 2s ease-in-out infinite" }}
          />
        </div>
        <span
          className="font-body font-light text-[0.47rem] tracking-[0.3em] uppercase text-cream"
          style={{ writingMode: "vertical-rl" }}
        >
          Scroll
        </span>
      </div>

      <style>{`
        @keyframes scrollDrop {
          0%   { transform: translateY(-100%); opacity: 0; }
          20%  { opacity: 1; }
          100% { transform: translateY(300%); opacity: 0; }
        }
      `}</style>
    </div>
  );
}