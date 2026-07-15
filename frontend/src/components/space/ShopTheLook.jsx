import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../../context/ProductContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import API from "../../services/api";

export default function ShopTheLook() {
  const { products, loading: productsLoading } = useProducts();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [cmsData, setCmsData] = useState(null);
  const [cmsLoading, setCmsLoading] = useState(true);
  const [activeSpot, setActiveSpot] = useState("");
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    const fetchCmsData = async () => {
      try {
        const res = await API.get("/cms/shop_the_look");
        setCmsData(res.data);
        if (res.data?.hotspots?.length > 0) {
          setActiveSpot(res.data.hotspots[0].id);
        }
      } catch (error) {
        console.error("Failed to load Shop the Look CMS data:", error);
      } finally {
        setCmsLoading(false);
      }
    };
    fetchCmsData();
  }, []);

  if (productsLoading || cmsLoading || !cmsData) return null;

  // Map hotspots to live products in database
  const hotspots = (cmsData.hotspots || []).map((spot) => {
    const liveProd = products.find((p) => String(p.id) === String(spot.productId));
    const resolvedProduct = liveProd || { ...spot.fallback, id: spot.id };
    return {
      ...spot,
      product: resolvedProduct,
    };
  });

  const activeHotspot = hotspots.find((h) => h.id === activeSpot);
  const activeProduct = activeHotspot?.product;

  const handleQuickAdd = (pId) => {
    setAddingId(pId);
    addToCart(pId, 1);
    setTimeout(() => {
      setAddingId(null);
    }, 1200);
  };

  return (
    <section className="bg-background py-20 md:py-24 border-b border-border/40">
      <div className="px-[clamp(1.5rem,5vw,4rem)] max-w-7xl mx-auto">

        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-3.5">
              <span className="block w-5 h-px bg-bronze" />
              <span className="font-body font-normal text-[0.55rem] tracking-[0.38em] uppercase text-bronze">
                Interactive Showcase
              </span>
            </div>
            <h2 className="font-display font-light text-[clamp(1.8rem,3.5vw,2.8rem)] text-ink m-0 leading-[1.1]">
              {cmsData.title || "Shop the"}{" "}
              <em className="text-bronze font-medium italic">
                {cmsData.title?.toLowerCase().includes("look") ? "" : "Look"}
              </em>
            </h2>
          </div>
          
          <p className="font-body font-light text-[0.8rem] text-muted max-w-xs leading-relaxed m-0">
            {cmsData.subtitle || "Click on the interactive pulse points on the design setup to view and shop featured furniture pieces instantly."}
          </p>
        </div>

        {/* Split Showcase Screen */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Side: Room Hotspots Canvas (8 Columns) */}
          <div className="lg:col-span-8 relative w-full aspect-[4/3] rounded-[24px] overflow-hidden border border-border/50 shadow-sm shrink-0 bg-surface">
            <img
              src={cmsData.image || "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1400&q=85"}
              alt="Wabi Sabi styled interior setup"
              className="absolute inset-0 w-full h-full object-cover brightness-[0.96]"
            />

            {/* Hotspots Overlay */}
            {hotspots.map((spot) => (
              <div
                key={spot.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                style={{ top: spot.top, left: spot.left }}
              >
                {/* Glowing Pulse rings */}
                <span className={`absolute inline-flex h-8 w-8 rounded-full bg-bronze/45 opacity-75 animate-ping -left-1.5 -top-1.5 transition-all duration-300 ${
                  activeSpot === spot.id ? "scale-125" : "hidden"
                }`} />
                <button
                  onClick={() => setActiveSpot(spot.id)}
                  aria-label={`View ${spot.displayName}`}
                  className={`relative inline-flex h-8 w-8 rounded-full border-2 items-center justify-center font-body text-xs font-semibold cursor-pointer shadow-md transition-all duration-300 ${
                    activeSpot === spot.id
                      ? "bg-bronze border-white text-white scale-110"
                      : "bg-background border-border text-bronze hover:border-bronze hover:scale-105"
                  }`}
                >
                  +
                </button>
              </div>
            ))}
          </div>

          {/* Right Side: Active Highlight & Explorer Panel (4 Columns) */}
          <div className="lg:col-span-4 flex flex-col justify-between bg-surface/30 border border-border/50 rounded-[24px] p-6 min-h-[500px]">
            <div className="flex flex-col h-full justify-between">
              
              <div>
                <h3 className="font-display font-medium text-[1.05rem] text-ink m-0 mb-4.5">
                  Featured in this Space
                </h3>

                {/* Active Highlight Detail Box */}
                {activeProduct && (
                  <div className="mb-6 p-4 bg-background border border-bronze/30 rounded-[20px] shadow-xs animate-fadeIn flex flex-col">
                    <div className="flex gap-4 mb-3.5">
                      <img
                        src={activeProduct.images?.[0] || activeProduct.image}
                        alt={activeProduct.name}
                        className="w-18 h-18 rounded-xl object-cover border border-border bg-surface shrink-0"
                      />
                      <div className="flex-grow min-w-0">
                        <span className="font-body text-[0.52rem] tracking-[0.2em] uppercase text-bronze block mb-1">
                          {activeProduct.category || "Furniture"}
                        </span>
                        <h4 className="font-display font-medium text-[0.95rem] text-ink m-0 mb-1 leading-snug truncate">
                          {activeProduct.name}
                        </h4>
                        <span className="font-display font-semibold text-[0.98rem] text-ink">
                          ₹{activeProduct.price.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    <p className="font-body font-light text-[0.7rem] text-muted leading-relaxed m-0 mb-4 line-clamp-2">
                      {activeProduct.description || "Designed with soft sculptural silhouettes and tailored finishes to anchor the room's character."}
                    </p>

                    {/* Quick Shop Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleQuickAdd(activeProduct.id)}
                        disabled={addingId === activeProduct.id}
                        className="flex-1 font-body font-medium text-[0.6rem] tracking-[0.2em] uppercase py-2.5 bg-ink text-background hover:bg-bronze transition-colors duration-250 cursor-pointer rounded-lg text-center border-0"
                      >
                        {addingId === activeProduct.id ? "Added ✓" : "Add to Cart"}
                      </button>

                      {/* Wishlist Button */}
                      <button
                        onClick={() => toggleWishlist(activeProduct.id)}
                        className="w-9 h-9 rounded-lg border border-border bg-background flex items-center justify-center cursor-pointer hover:border-bronze transition-colors duration-200"
                        aria-label="Toggle wishlist"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill={isInWishlist(activeProduct.id) ? "currentColor" : "none"}
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-bronze"
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      </button>

                      {/* View Details Link */}
                      <Link
                        to={activeProduct.id === "sofa" || activeProduct.id === "pendant" || activeProduct.id === "table" || activeProduct.id === "canvas" ? "/shop" : `/product/${activeProduct.id}`}
                        className="no-underline w-9 h-9 rounded-lg border border-border bg-background flex items-center justify-center hover:border-bronze hover:text-bronze transition-colors duration-200"
                        aria-label="View product page"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-muted hover:text-bronze">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                )}

                {/* Grid Item Selector Pills */}
                <div className="space-y-2.5">
                  <p className="font-body font-normal text-[0.55rem] tracking-[0.18em] uppercase text-muted m-0">
                    Explore Other Pieces in Setup
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {hotspots.map((spot) => {
                      const p = spot.product;
                      const isActive = activeSpot === spot.id;

                      return (
                        <button
                          key={spot.id}
                          onClick={() => setActiveSpot(spot.id)}
                          className={`flex items-center gap-2 p-2 rounded-[12px] border cursor-pointer text-left transition-all duration-300 ${
                            isActive
                              ? "bg-background border-bronze shadow-xs text-ink"
                              : "bg-background/45 border-border/50 text-muted hover:bg-background/80 hover:text-ink"
                          }`}
                        >
                          <img
                            src={p.images?.[0] || p.image}
                            alt={p.name}
                            className="w-7 h-7 rounded-md object-cover border border-border shrink-0"
                          />
                          <span className="font-body font-light text-[0.6rem] truncate tracking-wide flex-grow">
                            {spot.displayName}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom CTA Full Room Link */}
              <div className="mt-8 pt-5 border-t border-border/40">
                <Link
                  to={cmsData.buttonLink || "/shop"}
                  className="no-underline w-full text-center block font-body font-medium text-[0.62rem] tracking-[0.2em] uppercase text-background bg-ink py-3.5 rounded-xl transition-all duration-300 hover:bg-bronze hover:text-white"
                >
                  {cmsData.buttonText || "Shop Full Space"}
                </Link>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
