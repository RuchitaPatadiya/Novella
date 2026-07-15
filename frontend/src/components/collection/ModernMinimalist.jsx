import { useProducts } from "../../context/ProductContext";
import ShopProductGrid from "../shop/Shopproductgrid";
import AtelierHero from "../common/AtelierHero";

const ModernMinimalist = () => {
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
    (p) => p.collections && p.collections.includes("modern-minimalist")
  );

  return (
    <div className="bg-background">
      {/* Collection Hero */}
      <AtelierHero 
        eyebrow="Curated Collection"
        title="Modern Minimalist"
        subtitle="Clean lines, calm spaces, and sculptural shapes. The Modern Minimalist collection celebrates the art of subtraction, bringing focus to authentic materials and refined proportions."
        bottomText="↓ Discover Collection ↓"
        images={[
          "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&q=80",
          "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&q=80",
          "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=400&q=80"
        ]}
      />

      {/* Philosophy Callout */}
      <section className="px-[clamp(1.5rem,5vw,4rem)] py-12 md:py-16 bg-surface border-b border-border">
        <div className="max-w-3xl">
          <h2 className="font-display font-light text-2xl text-ink mb-4">The Art of Less</h2>
          <p className="font-body font-light text-sm leading-[1.8] text-muted m-0">
            A minimalist home is not empty; it is intentional. We curate pieces that carry weight through design presence rather than clutter, choosing objects that stand alone as beautiful forms while offering deep functional comfort.
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

export default ModernMinimalist;
