import { useProducts } from "../../context/ProductContext";
import ShopProductGrid from "../shop/Shopproductgrid";
import AtelierHero from "../common/AtelierHero";

const NewArrivals = () => {
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
    (p) => p.badge === "New" || (p.collections && p.collections.includes("new-arrivals"))
  );

  return (
    <div className="bg-background">
      {/* Collection Hero */}
      <AtelierHero 
        eyebrow="Fresh Additions"
        title="New Arrivals"
        subtitle="Just landed this season. Explore our latest curations of premium furniture, lighting, and textiles crafted for modern wabi-sabi interiors."
        bottomText="↓ Discover New Arrivals ↓"
        images={[
          "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&q=80",
          "https://images.unsplash.com/photo-1618220179428-22790b461013?w=400&q=80",
          "https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?w=400&q=80"
        ]}
      />

      {/* Philosophy Callout */}
      <section className="px-[clamp(1.5rem,5vw,4rem)] py-12 md:py-16 bg-surface border-b border-border">
        <div className="max-w-3xl">
          <h2 className="font-display font-light text-2xl text-ink mb-4">Fresh Inspirations</h2>
          <p className="font-body font-light text-sm leading-[1.8] text-muted m-0">
            Each season we partner with artisan workshops to release targeted, small-batch runs of luxury items. Explore the newest shapes, materials, and palettes to enter the Novella catalog.
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

export default NewArrivals;
