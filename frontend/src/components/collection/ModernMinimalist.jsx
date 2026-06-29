import { products } from "../../utils/mockData";
import ShopProductGrid from "../shop/Shopproductgrid";

const ModernMinimalist = () => {
  const collectionIds = [1, 2, 3, 6, 12]; // Arco Lamp, Cloud Sofa, Travertine Table, Ceramic Vases, Abstract Canvas
  const filteredProducts = products.filter((p) => collectionIds.includes(p.id));

  return (
    <div className="bg-background">
      {/* Collection Hero */}
      <section className="relative w-full h-[50vh] min-h-[350px] overflow-hidden flex items-center">
        <img
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&q=80"
          alt="Modern Minimalist Collection"
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
            Modern <em className="text-gold italic font-medium">Minimalist</em>
          </h1>
          <p className="font-body font-light text-[clamp(0.85rem,1.1vw,1rem)] leading-relaxed text-cream-muted/75 max-w-2xl">
            Clean lines, calm spaces, and sculptural shapes. The Modern Minimalist collection celebrates the art of subtraction, bringing focus to authentic materials and refined proportions.
          </p>
        </div>
      </section>

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
