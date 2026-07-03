import { Link } from "react-router-dom";

const featuredProducts = [
  {
    id: 1,
    name: "Nouveau Plaster Arc Pendant",
    price: "₹9,800",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80",
    to: "/product/2",
  },
  {
    id: 2,
    name: "Atelier Curved Bouclé Sofa",
    price: "₹68,000",
    image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=687&auto=format&fit=crop",
    to: "/product/1",
  },
  {
    id: 3,
    name: "Pillar Travertine Coffee Table",
    price: "₹32,000",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80",
    to: "/product/3",
  },
];

const ProductThumb = ({ product }) => (
  <Link
    to={product.to}
    className="no-underline flex items-center gap-4 group py-3 px-4 border border-border bg-surface hover:border-bronze/40 transition-all duration-300"
  >
    <div className="relative w-14 h-14 overflow-hidden flex-shrink-0 bg-background">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>

    <div className="flex-1 min-w-0">
      <p className="font-display font-medium text-[0.95rem] text-ink m-0 leading-tight truncate transition-colors duration-200 group-hover:text-bronze">
        {product.name}
      </p>
      <p className="font-display font-light text-[0.82rem] text-bronze m-0 mt-0.5">
        {product.price}
      </p>
    </div>

    <svg
      width="13" height="6" viewBox="0 0 18 8" fill="none"
      className="flex-shrink-0 text-muted transition-all duration-300 group-hover:translate-x-1 group-hover:text-bronze"
    >
      <path d="M0 4H16M13 1L16 4L13 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </Link>
);

export default function FeaturedCollection() {
  return (
    <section className="bg-background overflow-hidden border-b border-border">

      <div className="flex flex-col lg:flex-row min-h-[600px]">

        <div className="flex flex-col justify-center py-16 px-[clamp(2rem,8vw,6rem)] lg:w-[45%] flex-shrink-0 bg-background">
          <div className="flex items-center gap-3 mb-6">
            <span className="block w-6 h-px bg-bronze" />
            <span className="font-body font-normal text-[0.55rem] tracking-[0.42em] uppercase text-bronze">
              This Month's Edit
            </span>
          </div>

          <h2 className="font-display font-light text-[clamp(2.2rem,4.5vw,3.8rem)] text-ink leading-[1.05] tracking-[-0.01em] m-0 mb-2">
            Luxury{" "}
            <em className="text-bronze font-medium italic">Living</em>
          </h2>

          <div className="w-10 h-px bg-bronze/40 mb-6 mt-3" />

          <p className="font-body font-light text-[0.88rem] text-muted leading-[1.85] tracking-[0.03em] m-0 mb-8 max-w-sm">
            A collection born from the belief that true luxury is in the details. Every piece is chosen for its craft, its presence, and the quiet confidence it brings to a room.
          </p>

          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-border">
            {[
              { number: "124", label: "Pieces" },
              { number: "18",  label: "Brands"  },
              { number: "4.9", label: "Rating"  },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col">
                <span className="font-display font-semibold text-[clamp(1.3rem,2.5vw,1.8rem)] text-bronze leading-none mb-1">
                  {stat.number}
                </span>
                <span className="font-body font-light text-[0.55rem] tracking-[0.22em] uppercase text-muted">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 mb-8">
            <p className="font-body font-normal text-[0.55rem] tracking-[0.3em] uppercase text-bronze/70 mb-2">
              Featured Pieces
            </p>
            {featuredProducts.map(p => (
              <ProductThumb key={p.id} product={p} />
            ))}
          </div>

          <Link
            to="/collections/luxury-living"
            className="no-underline self-start inline-flex items-center gap-3 font-body font-medium text-[0.63rem] tracking-[0.28em] uppercase text-cream-muted bg-ink px-8 py-3.5 transition-all duration-300 hover:bg-bronze"
          >
            Explore Collection
            <svg width="16" height="7" viewBox="0 0 18 8" fill="none">
              <path d="M0 4H16M13 1L16 4L13 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <div className="relative flex-1 min-h-[440px] lg:min-h-0">
          <img
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=85"
            alt="Luxury Living Collection"
            className="absolute inset-0 w-full h-full object-cover brightness-[0.92] saturate-[0.95]"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-transparent" />

          <div className="absolute top-6 right-6 opacity-50">
            <div className="w-7 h-px bg-bronze ml-auto" />
            <div className="w-px h-7 bg-bronze ml-auto" />
          </div>

          <div className="absolute bottom-6 left-6 opacity-50">
            <div className="w-px h-7 bg-bronze" />
            <div className="w-7 h-px bg-bronze" />
          </div>

          <div className="absolute top-6 left-6">
            <span className="font-body font-normal text-[0.52rem] tracking-[0.3em] uppercase text-bronze px-3 py-1.5 border border-border bg-background/90">
              Luxury Living
            </span>
          </div>

          <div className="absolute bottom-8 right-8 px-5 py-4 hidden md:block bg-background/95 border border-border">
            <p className="font-body font-normal text-[0.5rem] tracking-[0.28em] uppercase text-muted m-0 mb-1">
              Starting from
            </p>
            <p className="font-display font-semibold text-[1.6rem] text-bronze m-0 leading-none">
              ₹2,200
            </p>
            <p className="font-body font-light text-[0.62rem] text-muted m-0 mt-1">
              Free styling consultation
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
