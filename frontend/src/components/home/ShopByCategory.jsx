import { Link } from "react-router-dom";

const categories = [
  {
    id: "furniture",
    label: "Furniture",
    count: "320+ pieces",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700&q=85",
  },
  {
    id: "lighting",
    label: "Lighting",
    count: "180+ pieces",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=700&q=85",
  },
  {
    id: "textiles",
    label: "Textiles",
    count: "200+ pieces",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=700&q=85",
  },
  {
    id: "wall-decor",
    label: "Wall Decor",
    count: "140+ pieces",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=700&q=85",
  },
  {
    id: "decor-accessories",
    label: "Decor",
    count: "400+ pieces",
    image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=700&q=85",
  },
];

export default function ShopByCategory() {
  return (
    <section className="bg-background py-16 md:py-20">
      <div className="px-[clamp(1.5rem,5vw,4rem)]">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
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
            className="no-underline font-body font-normal text-[0.65rem] tracking-[0.2em] uppercase text-muted border-b border-gold pb-0.5 hover:text-bronze transition-colors duration-200 self-start md:self-auto"
          >
            View All Products
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.id}`}
              className="group relative overflow-hidden aspect-[3/4] border border-border hover:border-gold transition-colors duration-300 no-underline"
            >
              <img
                src={cat.image}
                alt={cat.label}
                className="absolute inset-0 w-full h-full object-cover brightness-[0.75] saturate-[0.85] transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-deep/90 via-dark/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="font-display font-medium text-[1.05rem] text-cream m-0 mb-0.5 leading-tight">
                  {cat.label}
                </p>
                <p className="font-body font-light text-[0.58rem] text-gold/70 m-0 tracking-[0.1em]">
                  {cat.count}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
