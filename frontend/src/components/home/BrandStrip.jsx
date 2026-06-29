const perks = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    title: "Curated in India",
    desc: "Every piece designed by our in-house team",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    title: "Free Styling Advice",
    desc: "Complimentary consultations on orders above ₹25,000",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <polyline points="23 4 23 10 17 10" />
        <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
      </svg>
    ),
    title: "30-Day Returns",
    desc: "Hassle-free returns on every order",
  },
];

export default function BrandStrip() {
  return (
    <section className="bg-surface border-t border-border">
      <div className="px-[clamp(1.5rem,5vw,4rem)] py-12 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 max-w-5xl mx-auto">
          {perks.map(({ icon, title, desc }) => (
            <div key={title} className="flex items-start gap-4">
              <div className="shrink-0 w-11 h-11 flex items-center justify-center border border-border bg-background text-bronze">
                {icon}
              </div>
              <div>
                <p className="font-body font-medium text-[0.68rem] tracking-[0.18em] uppercase text-ink m-0 mb-1.5">
                  {title}
                </p>
                <p className="font-body font-light text-[0.8rem] text-muted m-0 leading-relaxed">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
