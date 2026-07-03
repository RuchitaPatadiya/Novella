import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { spacesData } from "../../utils/spaceData";
import { products } from "../../utils/mockData";
import BrandStrip from "../../components/home/BrandStrip";
import { useWishlist } from "../../context/WishlistContext";

const SpaceDetailPage = () => {
  const { spaceId } = useParams();
  const space = spacesData.find((s) => s.id === spaceId);

  const [visible, setVisible] = useState(false);
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    window.scrollTo(0, 0);
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, [spaceId]);

  if (!space) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 pt-20">
        <h2 className="font-display font-light text-4xl text-ink mb-4">Space Not Found</h2>
        <p className="font-body text-muted mb-8 text-center max-w-md">
          The inspiration space you are searching for is currently offline or under development.
        </p>
        <Link to="/spaces" className="no-underline">
          <span className="px-8 py-3.5 bg-bronze text-background font-body font-medium text-xs tracking-widest uppercase hover:brightness-110 transition-all duration-200">
            View All Spaces
          </span>
        </Link>
      </div>
    );
  }

  // Filter products that match the productIds list for this space or belong to the spaceId dynamically
  const curatedProducts = products.filter(
    (p) => space.productIds.includes(p.id) || (p.spaces && p.spaces.includes(spaceId))
  );

  const fadeUp = (delay) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 800ms ease, transform 800ms ease`,
    transitionDelay: delay,
  });

  return (
    <div className="bg-background min-h-screen pt-[76px]">
      {/* Breadcrumbs Row */}
      <div className="px-[clamp(1.5rem,5vw,4rem)] py-5 border-b border-border bg-background">
        <div className="flex items-center gap-2 font-body text-[0.68rem] tracking-[0.18em] uppercase text-muted">
          <Link to="/" className="hover:text-bronze transition-colors duration-200 no-underline text-current">
            Home
          </Link>
          <span>/</span>
          <Link to="/spaces" className="hover:text-bronze transition-colors duration-200 no-underline text-current">
            Spaces
          </Link>
          <span>/</span>
          <span className="text-ink font-normal">{space.name}</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[400px] overflow-hidden flex items-center">
        {/* Background Image with Scale Transition */}
        <img
          src={space.heroImage}
          alt={`Curated ${space.name} design`}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            transform: visible ? "scale(1.0)" : "scale(1.04)",
            transition: "transform 8000ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            willChange: "transform",
          }}
        />
        
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/40 to-dark/20" />

        {/* Hero Content */}
        <div className="relative z-10 w-full px-[clamp(1.5rem,5vw,4rem)] text-left max-w-4xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-2.5 mb-4" style={fadeUp("150ms")}>
            <span className="block w-5 h-px bg-gold" />
            <span className="font-body font-normal text-[0.58rem] text-gold tracking-[0.4em] uppercase">
              Spaces / Inspiration
            </span>
          </div>

          {/* Title */}
          <h1
            className="font-display font-light text-[clamp(2.5rem,5vw,4.5rem)] text-cream m-0 leading-tight mb-2"
            style={fadeUp("300ms")}
          >
            Styling Your <em className="text-gold italic font-medium">{space.name}</em>
          </h1>

          {/* Tagline */}
          <p
            className="font-display font-normal text-[clamp(1rem,1.5vw,1.3rem)] italic text-gold/80 m-0 tracking-wide"
            style={fadeUp("450ms")}
          >
            {space.tagline}
          </p>
        </div>
      </section>

      {/* Narrative Intro Section */}
      <section className="border-b border-border bg-background">
        {/* Narrative Intro */}
        <div className="px-[clamp(1.5rem,5vw,4rem)] py-12 md:py-16 max-w-4xl">
          <h2 className="font-display font-light text-[clamp(1.8rem,3vw,2.4rem)] text-ink m-0 mb-6 leading-snug">
            Design Philosophy
          </h2>
          <p className="font-body font-light text-[clamp(0.92rem,1.2vw,1.05rem)] leading-[1.85] text-muted m-0">
            {space.description}
          </p>
        </div>
      </section>

      {/* Stylist Design Tips (Style Guide) */}
      <section className="bg-surface py-16 md:py-20 border-b border-border">
        <div className="px-[clamp(1.5rem,5vw,4rem)]">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="block w-5 h-px bg-bronze" />
            <span className="font-body font-normal text-[0.55rem] tracking-[0.38em] uppercase text-bronze">
              Stylist Guide
            </span>
          </div>
          <h2 className="font-display font-light text-[clamp(1.8rem,3vw,2.5rem)] text-ink m-0 mb-12">
            Design Tips &amp; Rules
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {space.tips.map((tip, idx) => (
              <div
                key={idx}
                className="flex flex-col p-8 border border-border bg-background transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:border-bronze/35 group"
              >
                {/* Index Number */}
                <span className="font-display font-light text-bronze text-4xl leading-none mb-5 block">
                  0{idx + 1}
                </span>
                
                {/* Title */}
                <h3 className="font-display font-medium text-[1.25rem] text-ink m-0 mb-3 group-hover:text-bronze transition-colors duration-200">
                  {tip.title}
                </h3>

                {/* Divider */}
                <div className="w-8 h-px bg-bronze/40 mb-4 transition-all duration-300 group-hover:w-16" />

                {/* Description */}
                <p className="font-body font-light text-[0.82rem] leading-[1.75] text-muted m-0">
                  {tip.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curated Collection */}
      <section className="py-16 md:py-24 bg-background">
        <div className="px-[clamp(1.5rem,5vw,4rem)]">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="block w-5 h-px bg-bronze" />
            <span className="font-body font-normal text-[0.55rem] tracking-[0.38em] uppercase text-bronze">
              Selected Pieces
            </span>
          </div>
          <h2 className="font-display font-light text-[clamp(1.8rem,3vw,2.5rem)] text-ink m-0 mb-12">
            Shop the Look
          </h2>

          {/* Grid Layout matching ShopProductGrid styling */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10">
            {curatedProducts.map((p) => (
              <div key={p.id} className="flex flex-col group">
                {/* Card Top */}
                <div className="relative overflow-hidden bg-surface border border-border aspect-[3/4] group-hover:border-bronze/30 transition-colors duration-300">
                  <Link to={`/product/${p.id}`}>
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-104"
                    />
                  </Link>
                  {p.badge && (
                    <span className="absolute top-2.5 left-2.5 font-body font-medium text-[0.5rem] tracking-[0.18em] uppercase px-2.5 py-1 bg-ink text-gold">
                      {p.badge}
                    </span>
                  )}

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(p.id)}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-background/95 border border-border flex items-center justify-center cursor-pointer hover:border-bronze transition-colors duration-200"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" className="text-bronze"
                      fill={isInWishlist(p.id) ? "currentColor" : "none"}
                      stroke="currentColor" strokeWidth="1.8">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                </div>

                {/* Card Bottom */}
                <div className="pt-3.5">
                  <Link to={`/product/${p.id}`} className="no-underline">
                    <p className="font-display font-medium text-[1rem] text-ink m-0 mb-1.5 leading-tight hover:text-bronze transition-colors duration-200">
                      {p.name}
                    </p>
                  </Link>

                  {/* Star Rating Row */}
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <div className="flex gap-0.5 text-bronze">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <svg
                          key={s}
                          width="9"
                          height="9"
                          viewBox="0 0 24 24"
                          fill={s <= Math.round(p.rating) ? "currentColor" : "none"}
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                        </svg>
                      ))}
                    </div>
                    <span className="font-body font-light text-[0.62rem] text-muted">
                      ({p.reviewsCount})
                    </span>
                  </div>

                  {/* Prices */}
                  <div className="flex items-center gap-2.5">
                    <span className="font-display font-semibold text-[1rem] text-ink">
                      ₹{p.price.toLocaleString("en-IN")}
                    </span>
                    {p.originalPrice && (
                      <span className="font-body font-light text-[0.75rem] text-muted line-through">
                        ₹{p.originalPrice.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore All Call to Action banner */}
      <section className="bg-dark text-cream py-16 md:py-20 text-center relative overflow-hidden border-t border-gold/15">
        <div className="relative z-10 max-w-2xl mx-auto px-6">
          <p className="font-body text-[0.58rem] tracking-[0.38em] uppercase text-gold mb-3.5">
            Looking for something else?
          </p>
          <h2 className="font-display font-light text-[2rem] md:text-[2.6rem] m-0 mb-8 leading-snug">
            Discover our entire design catalog.
          </h2>
          <Link to="/shop" className="no-underline inline-block">
            <span className="block px-10 py-4 font-body font-medium text-xs tracking-widest uppercase bg-gold text-dark transition-all duration-300 hover:brightness-110">
              Shop All Products
            </span>
          </Link>
        </div>
        {/* Subtle decorative background gradient */}
        <div className="absolute inset-0 bg-gradient-to-tr from-dark-deep via-dark to-dark-deep opacity-80" />
      </section>

      <BrandStrip />
    </div>
  );
};

export default SpaceDetailPage;
