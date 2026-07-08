import { Link } from "react-router-dom";
import { useProducts } from "../../context/ProductContext";

const categoriesTemplate = [
  {
    id: "furniture",
    label: "Furniture",
    image: "https://images.unsplash.com/photo-1581428982868-e410dd047a90?w=400&q=80",
  },
  {
    id: "lighting",
    label: "Lighting",
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&q=80",
  },
  {
    id: "textiles",
    label: "Textiles",
    image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400&q=80",
  },
  {
    id: "wall-decor",
    label: "Wall Decor",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&q=80",
  },
  {
    id: "decor-accessories",
    label: "Decor",
    image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=400&q=80",
  },
];

export default function ShopByCategory() {
  const { products } = useProducts();

  const categories = categoriesTemplate.map((cat) => {
    const count = products.filter((p) => p.category === cat.id).length;
    return {
      ...cat,
      count: `${count} item${count !== 1 ? "s" : ""}`,
    };
  });

  return (
    <section className="bg-background py-16 md:py-20 border-b border-border/40">
      <div className="px-[clamp(1.5rem,5vw,4rem)]">

        {/* Section Header - Styled Consistently with Homepage Grid Layouts */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-3.5">
              <span className="block w-5 h-px bg-bronze" />
              <span className="font-body font-normal text-[0.55rem] tracking-[0.38em] uppercase text-bronze">
                Browse
              </span>
            </div>
            <h2 className="font-display font-light text-[clamp(1.8rem,3.5vw,2.8rem)] text-ink m-0 leading-[1.1]">
              Shop by{" "}
              <em className="text-bronze font-medium not-italic">Category</em>
            </h2>
          </div>
          <Link
            to="/shop"
            className="no-underline font-body font-normal text-[0.65rem] tracking-[0.2em] uppercase text-muted border-b border-gold pb-1 hover:text-bronze transition-all duration-200 self-start md:self-auto"
          >
            View All Products
          </Link>
        </div>

        {/* Clean Minimalist Rounded Card Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop/${cat.id}`}
              className="group flex flex-col items-center justify-center bg-surface/35 hover:bg-surface border border-border/50 hover:border-bronze/35 rounded-[20px] py-8 px-4 transition-all duration-400 no-underline hover:shadow-[0_12px_28px_rgba(176,125,58,0.05)]"
            >
              {/* Round Image Mask */}
              <div className="w-24 h-24 rounded-full overflow-hidden border border-border bg-background flex items-center justify-center transition-all duration-500 group-hover:scale-105 group-hover:border-bronze/35 shadow-inner shrink-0 mb-4">
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-108 brightness-[0.98]"
                />
              </div>

              {/* Title & Item Counter */}
              <div className="text-center">
                <h3 className="font-display font-medium text-[1.08rem] text-ink m-0 mb-1 group-hover:text-bronze transition-colors duration-200">
                  {cat.label}
                </h3>
                <span className="font-body font-normal text-[0.58rem] text-muted tracking-widest uppercase">
                  {cat.count}
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
