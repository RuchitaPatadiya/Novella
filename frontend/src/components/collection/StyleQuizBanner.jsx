import { Link } from "react-router-dom";

const styles = [
  { name: "Modern Minimalist", to: "/collections/modern-minimalist" },
  { name: "Luxury Living",     to: "/collections/luxury-living"     },
  { name: "Scandinavian",      to: "/collections/scandinavian"      },
  { name: "Boho Chic",         to: "/collections/boho-chic"         },
];

export default function StyleQuizBanner() {
  return (
    <section className="bg-background py-24 px-[clamp(1.5rem,5vw,4rem)] overflow-hidden">
      <div className="max-w-6xl mx-auto">

        <div className="grid lg:grid-cols-2 gap-0 border border-border overflow-hidden">

          <div className="relative h-[320px] lg:h-auto lg:min-h-[480px] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb3?w=1400&q=85"
              alt="Style Quiz"
              className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.92] saturate-[0.95]"
            />
          </div>

          <div className="flex flex-col justify-center bg-surface px-8 md:px-12 py-12 lg:py-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="block w-6 h-px bg-bronze" />
              <span className="font-body font-light text-[0.55rem] tracking-[0.45em] uppercase text-bronze">
                Coming Soon
              </span>
              <span className="block w-6 h-px bg-bronze" />
            </div>

            <h2 className="font-display font-light text-[clamp(2rem,4.5vw,3.2rem)] text-ink m-0 mb-4 leading-[1.05] tracking-[-0.01em]">
              Not sure which{" "}
              <em className="text-bronze font-medium italic">
                style is yours?
              </em>
            </h2>

            <p className="font-body font-light text-[0.88rem] text-muted leading-[1.85] tracking-[0.03em] mb-8 m-0 max-w-md">
              Answer 5 quick questions and we'll match you with the perfect Novella collection — and curate a room just for you.
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {styles.map(s => (
                <Link
                  key={s.name}
                  to={s.to}
                  className="no-underline font-body font-normal text-[0.58rem] tracking-[0.15em] uppercase px-3.5 py-1.5 border border-border text-muted bg-background hover:border-bronze/50 hover:text-bronze transition-all duration-200"
                >
                  {s.name}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex flex-col gap-2 mb-8">
              {[
                { label: "Clean & Calm",   tag: "Minimalist" },
                { label: "Rich & Opulent", tag: "Luxury"     },
                { label: "Warm & Free",    tag: "Boho"       },
              ].map((card, i) => (
                <div
                  key={i}
                  className="px-4 py-3 border border-border bg-background hover:border-bronze/40 transition-all duration-300"
                >
                  <p className="font-body font-normal text-[0.5rem] tracking-[0.3em] uppercase text-muted m-0 mb-1">
                    {card.tag}
                  </p>
                  <p className="font-display font-light text-[0.95rem] text-ink m-0 leading-tight">
                    {card.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-5 flex-wrap">
              <div className="relative group">
                <button
                  className="font-body font-medium text-[0.63rem] tracking-[0.28em] uppercase text-cream-muted bg-ink px-8 py-3.5 border-none cursor-not-allowed opacity-70 flex items-center gap-3 transition-all duration-300 group-hover:opacity-90"
                  disabled
                >
                  Take the Style Quiz
                  <svg width="16" height="7" viewBox="0 0 18 8" fill="none">
                    <path d="M0 4H16M13 1L16 4L13 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap px-3 py-1.5 bg-ink border border-border">
                  <span className="font-body font-light text-[0.55rem] tracking-[0.12em] text-cream-muted/70">
                    Launching soon ✦
                  </span>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-ink border-r border-b border-border" />
                </div>
              </div>

              <Link
                to="/collections"
                className="no-underline font-body font-normal text-[0.63rem] tracking-[0.28em] uppercase text-muted hover:text-bronze transition-colors duration-300 flex items-center gap-2"
              >
                Browse All
                <svg width="14" height="6" viewBox="0 0 18 8" fill="none" className="text-bronze">
                  <path d="M0 4H16M13 1L16 4L13 7" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-8 mt-8 flex-wrap">
          {[
            "✦  Free Styling Advice",
            "✦  Curated by Designers",
            "✦  Easy Returns",
          ].map((item, i) => (
            <span
              key={i}
              className="font-body font-light text-[0.6rem] tracking-[0.18em] uppercase text-muted"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
