import { useProducts } from "../../context/ProductContext";
import ShopProductGrid from "../shop/Shopproductgrid";

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

  const collectionIds = [2, 3, 4, 7, 11]; // Sofa, Travertine Table, Boucle Chair, Linen Throw, Oakwood Dining Table
  const filteredProducts = products.filter(
    (p) => collectionIds.includes(p.id) || (p.collections && p.collections.includes("scandinavian"))
  );

  return (
    <div className="bg-background">
      {/* Collection Hero */}
      <section className="relative w-full h-[50vh] min-h-[350px] overflow-hidden flex items-center">
        <img
          src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600&q=80"
          alt="Scandinavian Collection"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-dark/70" />
        <div className="relative z-10 w-full px-[clamp(1.5rem,5vw,4rem)] text-left max-w-4xl">
          <div className="flex items-center gap-2.5 mb-3.5">
            <span className="block w-5 h-px bg-gold" />
            <span className="font-body font-normal text-[0.58rem] text-gold tracking-[0.4em] uppercase">
              Curated Collection
            </span>
          </div>
          <h1 className="font-display font-light text-[clamp(2.2rem,4.5vw,4rem)] text-cream m-0 mb-3.5">
            Scandinavian <em className="text-gold italic font-medium">Warmth</em>
          </h1>
          <p className="font-body font-light text-[clamp(0.85rem,1.1vw,1rem)] leading-relaxed text-cream-muted/75 max-w-2xl">
            Cozy simplicity. The Scandinavian collection embraces the concept of hygge, centering on warm light wood grains, functional designs, and soft organic textures to anchor a home in peace.
          </p>
        </div>
      </section>

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
