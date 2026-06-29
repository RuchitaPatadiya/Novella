const categoryCards = [
  { id: "furniture",         label: "Furniture",         count: "320+ pieces", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80"  },
  { id: "lighting",          label: "Lighting",          count: "180+ pieces", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80" },
  { id: "wall-decor",        label: "Wall Decor",        count: "140+ pieces", image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&q=80" },
  { id: "textiles",          label: "Textiles",          count: "200+ pieces", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80"  },
  { id: "decor-accessories", label: "Decor Accessories", count: "400+ pieces", image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=600&q=80"  },
];

export default function ShopCategories({ activeCategory, onSelect }) {
  return (
    <div className="bg-surface border-b border-border px-[clamp(1.5rem,5vw,4rem)] pt-14 pb-12">

      <div className="mb-8">
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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {categoryCards.map(cat => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={`group text-left cursor-pointer bg-background border p-0 transition-all duration-300 ${
                isActive ? "border-bronze ring-1 ring-bronze/20" : "border-border hover:border-bronze/40"
              }`}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-surface">
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {isActive && (
                  <div className="absolute inset-0 bg-bronze/10" />
                )}
              </div>
              <div className="px-3.5 py-3">
                <p className="font-display font-medium text-[0.95rem] text-ink m-0 mb-0.5 leading-tight">
                  {cat.label}
                </p>
                <p className="font-body font-light text-[0.58rem] text-muted m-0 tracking-[0.1em]">
                  {cat.count}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
