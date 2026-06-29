const milestones = [
  { year: "2024", event: "Novella Founded",        desc: "A design studio built on the belief that beauty belongs in every home."     },
  { year: "2024", event: "First Collection",       desc: "Our debut edit of 100 original pieces — each designed in-house."            },
  { year: "2025", event: "12,000+ Happy Homes",    desc: "Our designs found their way into homes across India and beyond."            },
  { year: "2025", event: "2,400+ Original Pieces", desc: "Every single one conceived, designed, and crafted by Novella."             },
];

export default function OurStory() {
  return (
    <section id="our-story" className="bg-background">

      <div className="px-[clamp(2rem,8vw,6rem)] py-20 border-t border-border">
        <div className="flex flex-col lg:flex-row gap-16 max-w-6xl">

          <div className="lg:w-[38%] flex-shrink-0">
            <div className="flex items-center gap-2.5 mb-5">
              <span className="block w-5 h-px bg-bronze" />
              <span className="font-body font-normal text-[0.55rem] tracking-[0.4em] uppercase text-bronze">
                Who We Are
              </span>
            </div>

            <h2 className="font-display font-light text-[clamp(2rem,4vw,3.2rem)] text-ink m-0 leading-[1.1] mb-6">
              The Story{" "}
              <em className="text-bronze font-medium italic">Behind</em>
              {" "}Novella
            </h2>

            <div className="relative mt-8 hidden lg:block h-[320px] overflow-hidden border border-border">
              <img
                src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=700&q=85"
                alt="Novella Design Studio"
                className="absolute inset-0 w-full h-full object-cover brightness-[0.92] saturate-[0.95]"
              />
              <div className="absolute bottom-4 right-4 opacity-50">
                <div className="w-px h-6 bg-bronze ml-auto" />
                <div className="w-6 h-px bg-bronze" />
              </div>
              <div className="absolute bottom-4 left-4 px-3 py-1.5 border border-border bg-background/90">
                <span className="font-body font-light text-[0.52rem] tracking-[0.28em] uppercase text-bronze">
                  Novella Design Studio · Est. 2024
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center gap-6 pt-2">
            {[
              {
                heading: "It started with a feeling.",
                body: "Novella was founded in 2024 by a team of designers who believed home décor had lost its soul. Everything felt mass-produced, generic, and forgettable. We wanted to create something different — pieces with character, intention, and a story of their own.",
              },
              {
                heading: "We design everything ourselves.",
                body: "Every single piece in the Novella collection is conceived, designed, and crafted by our in-house design team. From the curve of a chair leg to the glaze on a ceramic vase — every detail is a deliberate choice. There are no middlemen, no outside brands. Just Novella.",
              },
              {
                heading: "Craft over quantity, always.",
                body: "We don't chase trends. We don't drop hundreds of products a season. Each new piece goes through months of design iteration before it earns a place in our collection. The result is a home that feels timeless, not temporary.",
              },
              {
                heading: "Your home, our life's work.",
                body: "More than 12,000 homes now carry a Novella piece. Each one is a reminder that a single well-designed object — a lamp, a chair, a vase — can completely transform how a space feels and how a day begins. That is what we wake up for.",
              },
            ].map((block, i) => (
              <div key={i} className="flex gap-5">
                <div className="flex flex-col items-center pt-1.5 flex-shrink-0">
                  <div className="w-px flex-1 bg-border min-h-[60px]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-bronze my-1 flex-shrink-0" />
                  <div className="w-px flex-1 bg-border min-h-[20px]" />
                </div>

                <div className="pb-2">
                  <h3 className="font-display font-medium text-[1.05rem] text-ink m-0 mb-2 leading-snug">
                    {block.heading}
                  </h3>
                  <p className="font-body font-light text-[0.88rem] text-muted leading-[1.85] tracking-[0.03em] m-0">
                    {block.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-surface px-[clamp(2rem,8vw,6rem)] py-14 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <span className="block w-5 h-px bg-bronze" />
            <span className="font-body font-normal text-[0.55rem] tracking-[0.4em] uppercase text-bronze">
              Our Journey
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
            {milestones.map((m, i) => (
              <div
                key={i}
                className="relative flex flex-col py-6 pr-8 border-l border-border"
              >
                <div className="absolute -left-[5px] top-[30px] w-2.5 h-2.5 rounded-full bg-bronze border-2 border-surface" />

                <span className="font-display font-light italic text-[clamp(1.8rem,3vw,2.4rem)] text-bronze/25 leading-none mb-3 pl-5">
                  {m.year}
                </span>
                <h4 className="font-display font-medium text-[1rem] text-ink m-0 mb-1.5 pl-5 leading-tight">
                  {m.event}
                </h4>
                <p className="font-body font-light text-[0.8rem] text-muted leading-relaxed m-0 pl-5">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
