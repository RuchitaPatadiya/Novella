import { Link } from "react-router-dom";

export default function EditorialBreak() {
  return (
    <section className="bg-surface py-16 md:py-20 border-y border-border">
      <div className="px-[clamp(1.5rem,5vw,4rem)]">
        <div className="grid lg:grid-cols-2 gap-0 border border-border overflow-hidden">

          <div className="relative h-[320px] lg:h-auto lg:min-h-[440px] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1600&q=85"
              alt="Refined interior by Novella"
              className="absolute inset-0 w-full h-full object-cover object-[center_40%] brightness-[0.92] saturate-[0.95]"
            />
          </div>

          <div className="flex flex-col justify-center bg-background px-8 md:px-12 py-12 lg:py-16">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="block w-5 h-px bg-bronze" />
              <span className="font-body font-normal text-[0.55rem] tracking-[0.38em] uppercase text-bronze">
                The Novella Philosophy
              </span>
            </div>

            <h2 className="font-display font-light text-[clamp(2rem,4vw,3.2rem)] text-ink m-0 leading-[1.08] tracking-[-0.01em]">
              Designed for how you{" "}
              <em className="text-bronze font-medium italic">actually live.</em>
            </h2>

            <p className="font-body font-light text-[0.9rem] text-muted mt-5 mb-8 max-w-md leading-[1.85] tracking-[0.03em] m-0">
              Not showroom perfection — spaces that feel warm, considered, and entirely yours.
            </p>

            <Link
              to="/collections"
              className="no-underline inline-flex items-center gap-3 self-start group"
            >
              <span className="font-body font-medium text-[0.62rem] tracking-[0.22em] uppercase bg-ink text-cream-muted px-7 py-3.5 transition-colors duration-300 group-hover:bg-gold group-hover:text-dark">
                See the Spring Edit
              </span>
              <svg
                width="18" height="8" viewBox="0 0 18 8" fill="none"
                className="text-bronze transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="M0 4H16M13 1L16 4L13 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
