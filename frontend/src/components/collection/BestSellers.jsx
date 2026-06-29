import { products } from "../../utils/mockData";
import ShopProductGrid from "../shop/Shopproductgrid";

const BestSellers = () => {
  const filteredProducts = products.filter((p) => p.badge === "Bestseller");

  return (
    <div className="bg-background">
      {/* Collection Hero */}
      <section className="relative w-full h-[50vh] min-h-[350px] overflow-hidden flex items-center">
        <img
          src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1600&q=80"
          alt="Best Sellers Collection"
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
            Best <em className="text-gold italic font-medium">Sellers</em>
          </h1>
          <p className="font-body font-light text-[clamp(0.85rem,1.1vw,1rem)] leading-relaxed text-cream-muted/75 max-w-2xl">
            Our most loved curations. These home interior pieces are customer favorites, celebrated for their stunning aesthetics and timeless functionality.
          </p>
        </div>
      </section>

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
