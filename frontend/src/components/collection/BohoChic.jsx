import { useProducts } from "../../context/ProductContext";
import ShopProductGrid from "../shop/Shopproductgrid";
import AtelierHero from "../common/AtelierHero";

const BohoChic = () => {
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

  const collectionIds = [5, 6, 7, 9]; // Rattan Mirror, Ceramic Vases, Linen Throw, Jute Rug
  const filteredProducts = products.filter(
    (p) => collectionIds.includes(p.id) || (p.collections && p.collections.includes("boho-chic"))
  );

  return (
    <div className="bg-background">
      {/* Collection Hero */}
      <AtelierHero 
        eyebrow="Eclectic Craft"
        title="Boho Chic"
        subtitle="Free-spirited layers and organic structures. The Boho Chic collection captures relaxed artistic beauty, layering hand-woven rattan mirrors, textured jute rugs, and raw ceramics."
        bottomText="↓ Discover Collection ↓"
        images={[
          "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&q=80",
          "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400&q=80",
          "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=400&q=80"
        ]}
      />

      {/* Philosophy Callout */}
      <section className="px-[clamp(1.5rem,5vw,4rem)] py-12 md:py-16 bg-surface border-b border-border">
        <div className="max-w-3xl">
          <h2 className="font-display font-light text-2xl text-ink mb-4">Textured Harmony</h2>
          <p className="font-body font-light text-sm leading-[1.8] text-muted m-0">
            A beautiful home feels organic and alive. By introducing hand-woven details, sustainable natural fibers, and soft clay slip textures, this collection infuses clean modern layouts with layered, free-spirited warmth.
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

export default BohoChic;
