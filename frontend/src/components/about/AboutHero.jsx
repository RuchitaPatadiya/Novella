import { Link } from "react-router-dom";

export default function AboutHero() {
  return (
    <div className="relative bg-background overflow-hidden">

      {/* ── Top dark image strip ── */}
      <div className="relative h-[65vh] min-h-[480px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=1600&q=85"
          alt="About Novella"
          className="absolute inset-0 w-full h-full object-cover object-[center_35%]"
          style={{ filter: "brightness(0.5) saturate(0.82)" }}
        />

        {/* Warm amber overlay */}
        <div
          className="absolute inset-0"
          style={{ background: "rgba(40,18,2,0.32)", mixBlendMode: "multiply" }}
        />

        {/* Bottom fade into cream */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />

        {/* Left vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-dark-deep/30 via-transparent to-transparent" />

        {/* Decorative vertical line */}
        <div
          className="absolute left-10 top-[15%] bottom-[15%] w-px hidden md:block"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(201,168,76,0.25), transparent)" }}
        />

        {/* Content — bottom left aligned like shop page */}
        <div className="absolute bottom-0 left-0 right-0 pb-16 px-[clamp(2rem,8vw,6rem)]">

          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-5">
            <span className="block w-7 h-px bg-gold" />
            <span className="font-body font-light text-[0.57rem] tracking-[0.45em] uppercase text-gold">
              Our Story
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-display font-light text-[clamp(2.5rem,6vw,5.2rem)] text-cream m-0 leading-[1.05] tracking-[-0.01em] max-w-3xl">
            Home is the most{" "}
            <em className="text-gold font-medium italic">
              personal form
            </em>{" "}
            of self‑expression.
          </h1>
        </div>
      </div>

      {/* ── Below hero — cream intro strip ── */}
      <div className="bg-background px-[clamp(2rem,8vw,6rem)] py-14">
        <div className="flex flex-col md:flex-row items-start gap-12 max-w-5xl">

          {/* Left — big pull quote */}
          <div className="md:w-[45%] flex-shrink-0">
            <p
              className="font-display font-light italic text-[clamp(1.3rem,2.5vw,1.9rem)] text-ink leading-[1.4] m-0"
              style={{ letterSpacing: "-0.01em" }}
            >
              "Every home deserves to feel curated, intentional, and unmistakably{" "}
              <em className="text-bronze not-italic font-medium">yours.</em>"
            </p>
            <div className="flex items-center gap-3 mt-5">
              <div className="w-8 h-px bg-bronze" />
              <span className="font-body font-normal text-[0.58rem] tracking-[0.25em] uppercase text-muted">
                Novella, Founded 2024
              </span>
            </div>
          </div>

          {/* Right — short intro text */}
          <div className="flex-1">
            <p className="font-body font-light text-[0.9rem] text-muted leading-[1.85] tracking-[0.03em] m-0 mb-4">
              Novella was born from a simple belief — that the spaces we live in shape the lives we lead. We curate furniture and décor that isn't just beautiful, but meaningful.
            </p>
            <p className="font-body font-light text-[0.9rem] text-muted leading-[1.85] tracking-[0.03em] m-0">
              Every piece in our edit is chosen with intention — for its craft, its story, and the quiet confidence it brings to a room.
            </p>

            <Link
              to="#our-story"
              className="no-underline inline-flex items-center gap-2.5 mt-7 font-body font-medium text-[0.63rem] tracking-[0.25em] uppercase text-bronze border-b border-bronze/40 pb-0.5 hover:text-ink hover:border-ink transition-colors duration-200"
            >
              Read Our Story
              <svg width="14" height="6" viewBox="0 0 18 8" fill="none" className="text-bronze">
                <path d="M0 4H16M13 1L16 4L13 7" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}