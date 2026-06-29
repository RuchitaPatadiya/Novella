import { Link } from "react-router-dom";

const featuredProducts = [
  { id: 1, name: "Arco Floor Lamp",      price: "₹4,200",  to: "/shop?category=lighting" },
  { id: 2, name: "Linen Cloud Sofa",     price: "₹38,000", to: "/shop?category=furniture" },
  { id: 3, name: "Travertine Table",     price: "₹8,900",  to: "/shop?category=furniture" },
  { id: 4, name: "Boucle Accent Chair",  price: "₹15,500", to: "/shop?category=furniture" },
];

const stats = [
  { number: "24",       label: "Key Pieces"     },
  { number: "Curated",  label: "by Novella"     },
  { number: "Free",     label: "Styling Advice" },
];

export default function FeaturedSpace() {
  return (
    <section className="bg-background border-b border-border overflow-hidden">

      <div className="flex flex-col lg:flex-row min-h-[580px]">

        <div className="flex flex-col justify-center bg-background px-[clamp(2rem,8vw,6rem)] py-16 lg:py-20 lg:w-[42%] shrink-0">

          <div className="flex items-center gap-3 mb-7">
            <span className="block w-6 h-px bg-bronze" />
            <span className="font-body font-normal text-[0.55rem] tracking-[0.42em] uppercase text-bronze">
              Featured Space
            </span>
          </div>

          <h2 className="font-display font-light text-[clamp(2.5rem,5vw,4.2rem)] text-ink leading-[1.05] tracking-[-0.01em] m-0 mb-3">
            The{" "}
            <em className="text-bronze font-medium italic">
              Living Room
            </em>
          </h2>

          <div className="w-12 h-px bg-bronze/40 mb-6" />

          <p className="font-body font-light text-[0.9rem] text-muted leading-[1.85] tracking-[0.03em] m-0 mb-8 max-w-sm">
            Where conversations flow and memories are made. A thoughtfully curated space that holds warmth, intention, and beauty — all at once.
          </p>

          <div className="flex flex-col gap-2.5 mb-9">
            {featuredProducts.map((p, i) => (
              <Link
                key={p.id}
                to={p.to}
                className="no-underline flex items-center justify-between group py-3 px-4 border border-border bg-surface hover:border-bronze/40 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <span className="font-display font-light italic text-[0.7rem] text-bronze/50 w-5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-body font-light text-[0.82rem] tracking-[0.06em] text-muted group-hover:text-ink transition-colors duration-200">
                    {p.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-display font-medium text-[0.9rem] text-bronze">
                    {p.price}
                  </span>
                  <svg
                    width="12" height="6" viewBox="0 0 18 8" fill="none"
                    className="text-bronze/40 group-hover:text-bronze transition-all duration-200 group-hover:translate-x-1"
                  >
                    <path d="M0 4H16M13 1L16 4L13 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          <Link
            to="/shop"
            className="no-underline self-start inline-flex items-center gap-3 font-body font-medium text-[0.63rem] tracking-[0.28em] uppercase bg-ink text-cream-muted px-8 py-3.5 transition-all duration-300 hover:bg-bronze hover:text-white"
          >
            Shop This Space
            <svg width="16" height="7" viewBox="0 0 18 8" fill="none">
              <path d="M0 4H16M13 1L16 4L13 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <div className="relative flex-1 min-h-[420px] lg:min-h-0 bg-surface border-t lg:border-t-0 lg:border-l border-border">
          <img
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=85"
            alt="Featured Living Room"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute top-6 left-6">
            <span className="font-body font-normal text-[0.52rem] tracking-[0.3em] uppercase text-bronze px-3 py-1.5 border border-border bg-background/90 backdrop-blur-sm">
              Living Room
            </span>
          </div>

          <div className="absolute bottom-8 right-8 w-[200px] p-4 flex flex-col gap-3 bg-background/95 backdrop-blur-sm border border-border">
            <img
              src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=80"
              alt="Linen Cloud Sofa"
              className="w-full h-28 object-cover border border-border"
            />
            <div>
              <p className="font-body font-normal text-[0.5rem] tracking-[0.28em] uppercase text-muted m-0 mb-1">
                Spotlight Piece
              </p>
              <p className="font-display font-medium text-[0.95rem] text-ink m-0 mb-0.5 leading-tight">
                Linen Cloud Sofa
              </p>
              <p className="font-display font-light text-[0.85rem] text-bronze m-0">
                ₹38,000
              </p>
            </div>
            <Link
              to="/shop?category=furniture"
              className="no-underline w-full text-center font-body font-medium text-[0.55rem] tracking-[0.2em] uppercase text-cream-muted bg-ink py-2 transition-colors duration-200 hover:bg-bronze"
            >
              View Product
            </Link>
          </div>
        </div>
      </div>

      <div className="flex border-t border-border bg-surface">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="flex-1 flex flex-col items-center justify-center py-5 border-r border-border last:border-r-0"
          >
            <span className="font-display font-semibold text-[clamp(1rem,2vw,1.4rem)] text-bronze leading-none mb-1">
              {stat.number}
            </span>
            <span className="font-body font-light text-[0.54rem] tracking-[0.22em] uppercase text-muted">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
