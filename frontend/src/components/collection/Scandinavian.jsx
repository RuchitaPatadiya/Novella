import { useProducts } from "../../context/ProductContext";
import ShopProductGrid from "../shop/Shopproductgrid";
import AtelierHero from "../common/AtelierHero";

const Scandinavian = () => {
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
    (p) => p.collections && p.collections.includes("scandinavian")
  );

  return (
    <div className="bg-background">
      {/* Collection Hero */}
      <AtelierHero 
        eyebrow="Hyggelig Sanctuary"
        title="Scandinavian"
        subtitle="Cozy simplicity. The Scandinavian collection embraces the concept of hygge, centering on warm light wood grains, functional designs, and soft organic textures to anchor a home in peace."
        bottomText="↓ Discover Collection ↓"
        images={[
          "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=400&q=80",
          "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&q=80",
          "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&q=80"
        ]}
      />

      {/* Philosophy Callout */}
      <section className="px-[clamp(1.5rem,5vw,4rem)] py-12 md:py-16 bg-surface border-b border-border">
        <div className="max-w-3xl">
          <h2 className="font-display font-light text-2xl text-ink mb-4">Hygge &amp; Harmony</h2>
          <p className="font-body font-light text-sm leading-[1.8] text-muted m-0">
            A beautiful home starts with comfort. By blending pale woods like European white oak with organic textiles and stone textures, our Nordic-inspired pieces invite you to slow down, relax, and enjoy simple moments.
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

export default Scandinavian;
