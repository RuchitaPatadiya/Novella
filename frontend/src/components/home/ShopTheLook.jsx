import { useState } from "react";
import { Link } from "react-router-dom";

const hotspots = [
  {
    id: 1,
    name: "Linen Cloud Sofa",
    price: "₹38,000",
    to: "/shop?category=furniture",
    top: "52%",
    left: "28%",
  },
  {
    id: 2,
    name: "Arco Floor Lamp",
    price: "₹4,200",
    to: "/shop?category=lighting",
    top: "28%",
    left: "68%",
  },
  {
    id: 3,
    name: "Woven Jute Rug",
    price: "₹9,200",
    to: "/shop?category=textiles",
    top: "78%",
    left: "48%",
  },
  {
    id: 4,
    name: "Ceramic Vase Set",
    price: "₹2,200",
    to: "/shop?category=decor-accessories",
    top: "42%",
    left: "52%",
  },
];

export default function ShopTheLook() {
  const [active, setActive] = useState(null);

  return (
    <section className="bg-background py-16 md:py-20">
      <div className="px-[clamp(1.5rem,5vw,4rem)]">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="block w-5 h-px bg-bronze" />
              <span className="font-body font-normal text-[0.55rem] tracking-[0.38em] uppercase text-bronze">
                Get the Look
              </span>
            </div>
            <h2 className="font-display font-light text-[clamp(1.8rem,3.5vw,2.8rem)] text-ink m-0 leading-[1.1]">
              Shop the{" "}
              <em className="text-bronze font-medium italic">Look</em>
            </h2>
          </div>
          <p className="font-body font-light text-[0.85rem] text-muted m-0 max-w-xs leading-relaxed">
            Tap a dot to discover the pieces behind this curated living room.
          </p>
        </div>

        <div
          className="relative aspect-[16/9] md:aspect-[21/9] max-h-[560px] overflow-hidden border border-border"
          onMouseLeave={() => setActive(null)}
        >
          <img
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600&q=85"
            alt="Curated living room by Novella"
            className="absolute inset-0 w-full h-full object-cover brightness-[0.88] saturate-[0.92]"
          />

          {hotspots.map((spot) => {
            const isActive = active === spot.id;
            return (
              <div
                key={spot.id}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                style={{ top: spot.top, left: spot.left }}
              >
                <button
                  type="button"
                  aria-label={`View ${spot.name}`}
                  onClick={() => setActive(isActive ? null : spot.id)}
                  onMouseEnter={() => setActive(spot.id)}
                  className={`relative w-5 h-5 rounded-full border-2 cursor-pointer transition-all duration-300 ${
                    isActive
                      ? "bg-bronze border-bronze scale-125"
                      : "bg-background border-bronze hover:scale-110"
                  }`}
                >
                  <span
                    className={`absolute inset-0 rounded-full border border-bronze animate-ping opacity-40 ${
                      isActive ? "block" : "hidden"
                    }`}
                  />
                </button>

                {isActive && (
                  <div className="absolute top-7 left-1/2 -translate-x-1/2 w-[200px] bg-background border border-border p-3.5 shadow-lg">
                    <p className="font-display font-medium text-[0.95rem] text-ink m-0 mb-0.5 leading-tight">
                      {spot.name}
                    </p>
                    <p className="font-body font-light text-[0.75rem] text-bronze m-0 mb-2.5">
                      {spot.price}
                    </p>
                    <Link
                      to={spot.to}
                      className="font-body font-medium text-[0.55rem] tracking-[0.18em] uppercase text-muted no-underline hover:text-bronze transition-colors duration-200 flex items-center gap-1.5"
                    >
                      View Product
                      <svg width="12" height="5" viewBox="0 0 18 8" fill="none">
                        <path d="M0 4H16M13 1L16 4L13 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-3 mt-6">
          {hotspots.map((spot) => (
            <button
              key={spot.id}
              type="button"
              onClick={() => setActive(spot.id)}
              className={`font-body text-[0.58rem] tracking-[0.12em] uppercase px-3.5 py-1.5 border cursor-pointer transition-all duration-200 ${
                active === spot.id
                  ? "border-bronze bg-bronze/10 text-bronze"
                  : "border-border bg-surface text-muted hover:border-bronze/40 hover:text-ink"
              }`}
            >
              {spot.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
