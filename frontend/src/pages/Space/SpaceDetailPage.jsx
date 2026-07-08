import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { spacesData } from "../../utils/spaceData";
import { useProducts } from "../../context/ProductContext";
import BrandStrip from "../../components/home/BrandStrip";
import ProductCard from "../../components/common/ProductCard";

const SpaceDetailPage = () => {
  const { spaceId } = useParams();
  const { products, loading } = useProducts();
  const space = spacesData.find((s) => s.id === spaceId);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, [spaceId]);
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 pt-20">
        <div className="font-body text-xs text-muted tracking-widest uppercase animate-pulse">
          Loading space details...
        </div>
      </div>
    );
  }

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
              <ProductCard key={p.id || p._id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Explore All Call to Action banner */}
      <section className="bg-surface text-ink py-16 md:py-20 text-center relative overflow-hidden border-t border-border">
        <div className="relative z-10 max-w-2xl mx-auto px-6">
          <p className="font-body text-[0.58rem] tracking-[0.38em] uppercase text-bronze mb-3.5 font-medium">
            Looking for something else?
          </p>
          <h2 className="font-display font-light text-[2rem] md:text-[2.6rem] m-0 mb-8 leading-snug text-ink">
            Discover our entire design catalog.
          </h2>
          <Link to="/shop" className="no-underline inline-block">
            <span className="block px-10 py-4 font-body font-medium text-xs tracking-widest uppercase bg-ink text-background rounded-lg transition-all duration-300 hover:bg-bronze hover:text-white cursor-pointer">
              Shop All Products
            </span>
          </Link>
        </div>
        {/* Subtle decorative background gradient */}
        <div className="absolute inset-0 bg-gradient-to-tr from-surface via-background to-surface opacity-30 pointer-events-none" />
      </section>

      <BrandStrip />
    </div>
  );
};

export default SpaceDetailPage;
