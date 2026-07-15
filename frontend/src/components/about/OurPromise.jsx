import { Link } from "react-router-dom";

export default function OurPromise() {
  return (
    <section className="bg-background overflow-hidden border-b border-border">

      <div className="px-[clamp(1.5rem,5vw,4rem)] py-24">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-0 border border-border overflow-hidden">

          <div className="relative h-[320px] lg:h-auto lg:min-h-[520px] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=85"
              alt="Novella craft"
              className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.92] saturate-[0.95]"
            />
          </div>

          <div className="flex flex-col justify-center bg-surface px-8 md:px-12 py-12 lg:py-16 text-center lg:text-left">

            <div className="flex items-center justify-center lg:justify-start gap-3 mb-8">
              <span className="block w-8 h-px bg-bronze/50" />
              <span className="font-body font-light text-[0.55rem] tracking-[0.45em] uppercase text-bronze">
                Our Promise
              </span>
              <span className="block w-8 h-px bg-bronze/50" />
            </div>

            <h2 className="font-display font-light text-[clamp(2rem,4.5vw,3.2rem)] text-ink m-0 leading-[1.15] tracking-[-0.01em] mb-6">
              Every piece we make is one{" "}
              <em className="text-bronze font-medium italic">
                we'd put in our own home.
              </em>
            </h2>

            <div className="flex items-center justify-center lg:justify-start gap-4 my-8">
              <span className="block w-12 h-px bg-border" />
              <span className="block w-2 h-2 rounded-full border border-bronze/35" />
              <span className="block w-12 h-px bg-border" />
            </div>

            <p className="font-body font-light text-[0.9rem] text-muted leading-[1.9] tracking-[0.03em] m-0 mb-10 max-w-xl mx-auto lg:mx-0">
              No compromises on materials. No shortcuts on craft. No pieces that exist just to fill a catalogue. If it doesn't feel right in our hands, it won't find its way into yours.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-4 mb-10 text-left">
              {[
                {
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                  ),
                  title: "Designed In-House",
                  desc: "Every piece starts as a sketch in our Mumbai studio.",
                },
                {
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9 12L11 14L15 10" />
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  ),
                  title: "Quality Guaranteed",
                  desc: "30-day returns, no questions asked.",
                },
                {
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M3 9L12 2L21 9V20A1 1 0 0120 21H15V15H9V21H4A1 1 0 013 20V9Z" />
                    </svg>
                  ),
                  title: "Made to Last",
                  desc: "Built for years of real life, not just first impressions.",
                },
              ].map((point, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-3 p-5 border border-border bg-background hover:border-bronze/40 transition-all duration-300"
                >
                  <div className="text-bronze">{point.icon}</div>
                  <h4 className="font-display font-medium text-[0.95rem] text-ink m-0 leading-tight">
                    {point.title}
                  </h4>
                  <p className="font-body font-light text-[0.78rem] text-muted m-0 leading-relaxed">
                    {point.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-6 flex-wrap">
              <Link
                to="/shop"
                className="no-underline inline-flex items-center gap-3 font-body font-medium text-[0.63rem] tracking-[0.28em] uppercase text-cream-muted bg-ink px-10 py-4 transition-all duration-300 hover:bg-bronze"
              >
                Shop the Collection
                <svg width="16" height="7" viewBox="0 0 18 8" fill="none">
                  <path d="M0 4H16M13 1L16 4L13 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>

              <Link
                to="/collections"
                className="no-underline inline-flex items-center gap-2.5 font-body font-normal text-[0.63rem] tracking-[0.28em] uppercase text-muted hover:text-bronze transition-colors duration-300"
              >
                Browse Collections
                <svg width="14" height="6" viewBox="0 0 18 8" fill="none" className="text-bronze">
                  <path d="M0 4H16M13 1L16 4L13 7" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-8 py-5 border-t border-border flex-wrap px-6 bg-surface">
        {[
          "✦  Designed in Mumbai",
          "✦  Delivered Across India",
          "✦  30-Day Returns",
          "✦  Free Styling Advice",
        ].map((item, i) => (
          <span
            key={i}
            className="font-body font-light text-[0.58rem] tracking-[0.18em] uppercase text-muted"
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
