const stats = [
  {
    number: "2,400+",
    label: "Original Designs",
    desc: "Every piece conceived in-house",
  },
  {
    number: "12k+",
    label: "Happy Homes",
    desc: "Across India and beyond",
  },
  {
    number: "4.9★",
    label: "Average Rating",
    desc: "From our verified customers",
  },
  {
    number: "100%",
    label: "In-House Design",
    desc: "No outsourcing, ever",
  },
];

export default function TheNumbers() {
  return (
    <section className="bg-background py-20 px-[clamp(2rem,8vw,6rem)] border-t border-border">
      <div className="max-w-6xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <span className="block w-5 h-px bg-bronze" />
              <span className="font-body font-normal text-[0.55rem] tracking-[0.4em] uppercase text-bronze">
                By The Numbers
              </span>
            </div>
            <h2 className="font-display font-light text-[clamp(2rem,4vw,3.2rem)] text-ink m-0 leading-[1.1]">
              Novella{" "}
              <em className="text-bronze font-medium italic">in Numbers</em>
            </h2>
          </div>

          <p className="font-body font-light text-[0.85rem] text-muted max-w-xs leading-relaxed hidden md:block tracking-[0.03em]">
            A small team. A clear vision. And thousands of homes that feel a little more like themselves because of it.
          </p>
        </div>

        <div className="h-px mb-14 bg-gradient-to-r from-bronze/40 to-transparent" />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 border border-border">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`group flex flex-col gap-3 py-8 px-6 bg-surface transition-all duration-300 hover:bg-background ${
                i < stats.length - 1 ? "border-r border-border" : ""
              }`}
            >
              <span
                className="font-display font-semibold text-bronze leading-none transition-all duration-300 group-hover:text-ink text-[clamp(2.2rem,4.5vw,3.5rem)] tracking-tight"
              >
                {stat.number}
              </span>

              <div className="h-px w-7 bg-bronze/30 transition-all duration-500 group-hover:bg-bronze" />

              <h4 className="font-display font-medium text-[1rem] text-ink m-0 leading-tight">
                {stat.label}
              </h4>

              <p className="font-body font-light text-[0.78rem] text-muted m-0 leading-relaxed">
                {stat.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid grid-cols-3 gap-3 h-[220px]">
          {[
            "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=700&q=80",
            "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=700&q=80",
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700&q=80",
          ].map((src, i) => (
            <div key={i} className="relative overflow-hidden border border-border bg-surface">
              <img
                src={src}
                alt="Novella home"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105 brightness-[0.92] saturate-[0.95]"
              />
            </div>
          ))}
        </div>

        <p className="font-body font-light text-[0.6rem] tracking-[0.18em] uppercase text-muted text-center mt-4">
          Real Novella homes · Photographed by our customers
        </p>
      </div>
    </section>
  );
}
