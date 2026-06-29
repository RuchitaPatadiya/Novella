import { Link } from "react-router-dom";

export default function FeaturedCollectionBanner() {
  return (
    <section className="bg-surface overflow-hidden">
      <div className="flex flex-col lg:flex-row min-h-[480px]">

        {/* Image — full bleed on mobile, half on desktop */}
        <div className="relative lg:w-[55%] h-[320px] lg:h-auto min-h-[480px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1400&q=85"
            alt="Luxury Living Collection"
            className="absolute inset-0 w-full h-full object-cover brightness-[0.88] saturate-[0.9]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-surface/20 lg:to-surface" />
          <div className="absolute top-6 left-6">
            <span className="inline-block font-body font-medium text-[0.52rem] tracking-[0.28em] uppercase text-bronze bg-background/90 backdrop-blur-sm px-3 py-1.5 border border-border">
              Spring Edit 2025
            </span>
          </div>
        </div>

        {/* Copy */}
        <div className="flex flex-col justify-center px-[clamp(1.5rem,5vw,4rem)] py-12 lg:py-16 lg:w-[45%]">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="block w-5 h-px bg-gold" />
            <span className="font-body font-normal text-[0.55rem] tracking-[0.38em] uppercase text-gold">
              Featured Collection
            </span>
          </div>

          <h2 className="font-display font-light text-[clamp(2rem,4vw,3.2rem)] text-ink m-0 leading-[1.08] mb-4">
            Luxury{" "}
            <em className="text-gold font-medium italic">Living</em>
          </h2>

          <p className="font-body font-light text-[0.9rem] text-muted leading-[1.85] tracking-[0.03em] m-0 mb-8 max-w-md">
            Opulent textures, warm neutrals, and statement pieces — a curated edit for spaces that feel refined without trying too hard.
          </p>

          <div className="flex flex-wrap gap-2 mb-8">
            {["Linen", "Travertine", "Brass", "Boucle"].map((tag) => (
              <span
                key={tag}
                className="font-body font-light text-[0.58rem] tracking-[0.12em] uppercase text-muted border border-border px-3 py-1"
              >
                {tag}
              </span>
            ))}
          </div>

          <Link
            to="/collections"
            className="inline-flex items-center gap-3 no-underline self-start group"
          >
            <span className="font-body font-medium text-[0.62rem] tracking-[0.22em] uppercase bg-ink text-cream-muted px-7 py-3.5 transition-colors duration-300 group-hover:bg-gold group-hover:text-dark">
              Explore the Edit
            </span>
            <span className="w-10 h-10 border border-gold/30 flex items-center justify-center transition-all duration-300 group-hover:bg-gold group-hover:border-gold">
              <svg width="14" height="6" viewBox="0 0 18 8" fill="none" className="text-gold group-hover:text-dark transition-colors duration-300">
                <path d="M0 4H16M13 1L16 4L13 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
