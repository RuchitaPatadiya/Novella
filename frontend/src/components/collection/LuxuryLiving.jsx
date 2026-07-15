import { useProducts } from "../../context/ProductContext";
import ShopProductGrid from "../shop/Shopproductgrid";
import AtelierHero from "../common/AtelierHero";

const LuxuryLiving = () => {
  const { products, loading } = useProducts();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 pt-20">
        <div className="font-body text-xs text-muted tracking-widest uppercase animate-pulse">
          Loading Collection...
        </div>
      </div>
    );
  }

  const filteredProducts = products.filter(
    (p) => p.collections && p.collections.includes("luxury-living")
  );

  return (
    <div className="bg-background">
      {/* Collection Hero */}
      <AtelierHero 
        eyebrow="Premium Craftsmanship"
        title="Luxury Living"
        subtitle="Opulence, refined. The Luxury Living collection brings home the prestige of top-tier craftsmanship, pairing Nero Marquina marble, rich oak wood, and solid brass detailing to command admiration."
        bottomText="↓ Discover Collection ↓"
        images={[
          "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=400&q=80",
          "https://images.unsplash.com/photo-1618219944342-824e40a13285?w=400&q=80",
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80"
        ]}
      />

      {/* Philosophy Callout */}
      <section className="px-[clamp(1.5rem,5vw,4rem)] py-12 md:py-16 bg-surface border-b border-border">
        <div className="max-w-3xl">
          <h2 className="font-display font-light text-2xl text-ink mb-4">Craftsmanship Without Compromise</h2>
          <p className="font-body font-light text-sm leading-[1.8] text-muted m-0">
            True luxury lies in the details. From hand-finished European oak grains to hand-cut stone elements, these pieces are selected for clients who value quality, durability, and a classic statement of style.
          </p>
        </div>
      </section>

      {/* Product Grid */}
      <section className="px-[clamp(1.5rem,5vw,4rem)] py-16">
        <ShopProductGrid products={filteredProducts} onClearFilters={() => {}} />
      </section>
    </div>
  );
};

export default LuxuryLiving;
