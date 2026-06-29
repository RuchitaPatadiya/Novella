const values = [
  {
    number: "01",
    name: "Intentional Design",
    description:
      "Every curve, proportion, and finish is a deliberate decision. We never add details for the sake of it — only what serves the piece and the space it lives in.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3">
        <circle cx="16" cy="16" r="12" />
        <circle cx="16" cy="16" r="4" />
        <line x1="16" y1="2"  x2="16" y2="7"  />
        <line x1="16" y1="25" x2="16" y2="30" />
        <line x1="2"  y1="16" x2="7"  y2="16" />
        <line x1="25" y1="16" x2="30" y2="16" />
      </svg>
    ),
  },
  {
    number: "02",
    name: "Honest Craft",
    description:
      "We believe in materials that are true to themselves — wood that shows its grain, ceramic that bears the mark of hands. No veneers, no pretence, no shortcuts.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M4 28L16 4L28 28" />
        <line x1="8" y1="20" x2="24" y2="20" />
      </svg>
    ),
  },
  {
    number: "03",
    name: "Timeless over Trendy",
    description:
      "Trends fade. We design for the long view — pieces that feel as right in ten years as they do today. Our goal is furniture that becomes part of your story, not a chapter you outgrow.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3">
        <circle cx="16" cy="16" r="12" />
        <polyline points="16,8 16,16 21,21" />
      </svg>
    ),
  },
  {
    number: "04",
    name: "Spaces That Feel Like You",
    description:
      "We don't design for showrooms or Instagram. We design for real life — for the morning light in your bedroom, the conversations in your living room, the quiet of your home office.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M6 16L16 6L26 16V27H20V20H12V27H6V16Z" />
      </svg>
    ),
  },
];

export default function OurValues() {
  return (
    <section className="bg-surface py-20 px-[clamp(2rem,8vw,6rem)] overflow-hidden border-y border-border">

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
        <div>
          <div className="flex items-center gap-2.5 mb-5">
            <span className="block w-5 h-px bg-bronze" />
            <span className="font-body font-normal text-[0.55rem] tracking-[0.4em] uppercase text-bronze">
              What We Stand For
            </span>
          </div>
          <h2 className="font-display font-light text-[clamp(2rem,4vw,3.2rem)] text-ink m-0 leading-[1.1]">
            Our{" "}
            <em className="text-bronze font-medium italic">Values</em>
          </h2>
        </div>

        <p className="font-body font-light text-[0.85rem] text-muted max-w-xs leading-relaxed hidden md:block tracking-[0.03em]">
          Four principles that guide every design decision we make — without exception.
        </p>
      </div>

      <div className="h-px mb-14 bg-gradient-to-r from-bronze/40 to-transparent" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 max-w-6xl border border-border">
        {values.map((v, i) => (
          <div
            key={v.number}
            className={`group relative flex flex-col gap-5 p-8 bg-background transition-all duration-300 hover:bg-surface ${
              i % 2 === 0 ? "md:border-r border-border" : ""
            } ${i < 2 ? "border-b border-border" : ""}`}
          >
            <span
              className="absolute top-6 right-7 font-display font-light italic text-bronze/10 select-none transition-all duration-300 group-hover:text-bronze/20 text-[clamp(3rem,5vw,4.5rem)] leading-none"
            >
              {v.number}
            </span>

            <div className="w-12 h-12 flex items-center justify-center border border-border text-bronze transition-all duration-300 group-hover:border-bronze/40">
              {v.icon}
            </div>

            <div className="h-px w-6 bg-bronze transition-all duration-500 group-hover:w-10" />

            <h3 className="font-display font-medium text-[clamp(1.1rem,1.8vw,1.35rem)] text-ink m-0 leading-snug">
              {v.name}
            </h3>

            <p className="font-body font-light text-[0.85rem] text-muted leading-[1.85] tracking-[0.03em] m-0 max-w-sm">
              {v.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-16 pt-12 border-t border-border text-center max-w-2xl mx-auto">
        <p className="font-display font-light italic text-[clamp(1.1rem,2vw,1.55rem)] text-ink/60 leading-[1.5] m-0">
          "We will always design with intention, build with honesty, and stand behind every piece that carries the Novella name."
        </p>
        <div className="flex items-center justify-center gap-3 mt-5">
          <span className="block w-6 h-px bg-bronze/30" />
          <span className="font-body font-normal text-[0.55rem] tracking-[0.3em] uppercase text-muted">
            The Novella Team
          </span>
          <span className="block w-6 h-px bg-bronze/30" />
        </div>
      </div>
    </section>
  );
}
