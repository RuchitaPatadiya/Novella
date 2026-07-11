import { useProducts } from "../../context/ProductContext";
import ShopProductGrid from "../shop/Shopproductgrid";
import AtelierHero from "../common/AtelierHero";

const BestSellers = () => {
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
    (p) => p.badge === "Bestseller" || (p.collections && p.collections.includes("best-sellers"))
  );

  return (
    <div className="bg-background">
      {/* Collection Hero */}
      <AtelierHero 
        eyebrow="Popular Curation"
        title="Best Sellers"
        subtitle="Our most loved curations. These home interior pieces are customer favorites, celebrated for their stunning wabi-sabi aesthetics and timeless functionality."
        bottomText="↓ Discover Best Sellers ↓"
        images={[
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80",
          "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=400&q=80",
          "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400&q=80"
        ]}
      />

      {/* Philosophy Callout */}
      <section className="px-[clamp(1.5rem,5vw,4rem)] py-12 md:py-16 bg-surface border-b border-border">
        <div className="max-w-3xl">
          <h2 className="font-display font-light text-2xl text-ink mb-4">Tried and True</h2>
          <p className="font-body font-light text-sm leading-[1.8] text-muted m-0">
            From the sculptural lines of the Arco Floor Lamp to the organic textures of our hand-braided Jute rug, these high-end statement items have defined warm luxury for homes across the country.
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

export default BestSellers;
