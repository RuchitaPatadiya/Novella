import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { products } from "../../utils/mockData";
import BrandStrip from "../../components/home/BrandStrip";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";

const ProductDetailPage = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));

  // State for active image in the gallery
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // State for quantity
  const [quantity, setQuantity] = useState(1);

  // Accordion active keys
  const [activeAccordion, setActiveAccordion] = useState("specifications");

  // State for "Add to Cart" button animation
  const [cartState, setCartState] = useState("idle"); // idle, adding, added

  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  // Scroll to top on load or product switch
  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveImageIndex(0);
    setQuantity(1);
    setCartState("idle");
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 pt-20">
        <h2 className="font-display font-light text-4xl text-ink mb-4">Product Not Found</h2>
        <p className="font-body text-muted mb-8 text-center max-w-md">
          The piece you are looking for might have been retired or is currently unavailable.
        </p>
        <Link to="/shop" className="no-underline">
          <span className="px-8 py-3.5 bg-bronze text-background font-body font-medium text-xs tracking-widest uppercase hover:brightness-110 transition-all duration-200">
            Back to Shop
          </span>
        </Link>
      </div>
    );
  }

  // Get related products (same category, excluding current product)
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Fallback to general products if not enough in same category
  const displayRelated = relatedProducts.length > 0 
    ? relatedProducts 
    : products.filter((p) => p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    setCartState("adding");
    setTimeout(() => {
      addToCart(product.id, quantity);
      setCartState("added");
      setTimeout(() => {
        setCartState("idle");
      }, 1500);
    }, 800);
  };

  const calculateDiscount = () => {
    if (!product.originalPrice) return null;
    const diff = product.originalPrice - product.price;
    return Math.round((diff / product.originalPrice) * 100);
  };

  const discount = calculateDiscount();

  return (
    <div className="bg-background pt-[100px] min-h-screen">
      {/* Breadcrumbs */}
      <div className="px-[clamp(1.5rem,5vw,4rem)] py-6 border-b border-border">
        <div className="flex items-center gap-2 font-body text-[0.68rem] tracking-[0.18em] uppercase text-muted">
          <Link to="/" className="hover:text-bronze transition-colors duration-200 no-underline text-current">
            Home
          </Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-bronze transition-colors duration-200 no-underline text-current">
            Shop
          </Link>
          <span>/</span>
          <Link
            to={`/shop?category=${product.category}`}
            className="hover:text-bronze transition-colors duration-200 no-underline text-current"
          >
            {product.category.replace("-", " ")}
          </Link>
          <span>/</span>
          <span className="text-ink font-normal truncate max-w-[120px] md:max-w-none">
            {product.name}
          </span>
        </div>
      </div>

      {/* Main product layout */}
      <section className="px-[clamp(1.5rem,5vw,4rem)] py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Image Gallery (cols: 7) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Main Image View */}
            <div className="relative overflow-hidden bg-surface aspect-[4/5] border border-border group">
              <img
                src={product.images[activeImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
              />
              {product.badge && (
                <span className="absolute top-5 left-5 bg-bronze text-background font-body text-[0.55rem] tracking-[0.25em] uppercase px-3.5 py-1.5 font-medium rounded-full">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnail Controls */}
            {product.images.length > 1 && (
              <div className="flex gap-3.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 md:w-24 aspect-[4/5] bg-surface border overflow-hidden cursor-pointer transition-colors duration-300 ${
                      activeImageIndex === idx ? "border-bronze" : "border-border hover:border-bronze/40"
                    }`}
                  >
                    <img src={img} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Info & Buy Box (cols: 5) */}
          <div className="lg:col-span-5 flex flex-col">
            {/* Category Tag */}
            <p className="font-body text-[0.58rem] tracking-[0.3em] uppercase text-bronze m-0 mb-3.5">
              {product.category.replace("-", " ")}
            </p>

            {/* Title */}
            <h1 className="font-display font-light text-[clamp(2rem,3.5vw,2.8rem)] text-ink m-0 leading-tight tracking-tight mb-4">
              {product.name}
            </h1>

            {/* Ratings & Reviews */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex text-gold">
                {[...Array(5)].map((_, idx) => (
                  <svg
                    key={idx}
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill={idx < Math.floor(product.rating) ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <span className="font-body text-[0.72rem] text-muted tracking-wide mt-0.5">
                {product.rating} / 5.0 ({product.reviewsCount} reviews)
              </span>
            </div>

            {/* Price block */}
            <div className="flex items-baseline gap-3.5 mb-7">
              <span className="font-display font-medium text-2xl text-ink">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.originalPrice && (
                <>
                  <span className="font-display text-lg text-muted line-through">
                    ₹{product.originalPrice.toLocaleString("en-IN")}
                  </span>
                  <span className="font-body text-[0.68rem] tracking-widest text-bronze uppercase bg-bronze/10 px-2 py-0.5 font-semibold">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-border mb-7" />

            {/* Description */}
            <p className="font-body font-light text-[0.88rem] leading-[1.8] text-muted m-0 mb-8">
              {product.description}
            </p>

            {/* Cart Box */}
            <div className="flex flex-col sm:flex-row gap-4 mb-9">
              {/* Quantity Selection */}
              <div className="flex items-center justify-between border border-border h-12 px-4 sm:w-32 bg-surface">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="bg-transparent border-0 cursor-pointer font-body font-light text-lg text-ink hover:text-bronze p-1"
                >
                  —
                </button>
                <span className="font-body font-medium text-sm text-ink">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="bg-transparent border-0 cursor-pointer font-body font-light text-lg text-ink hover:text-bronze p-1"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={cartState !== "idle"}
                className={`flex-1 h-12 relative overflow-hidden transition-all duration-300 font-body font-medium text-xs tracking-widest uppercase cursor-pointer border ${
                  cartState === "idle"
                    ? "border-bronze bg-bronze text-background hover:brightness-110"
                    : cartState === "adding"
                    ? "border-border bg-surface text-ink cursor-default"
                    : "border-emerald-600 bg-emerald-600 text-white cursor-default"
                }`}
              >
                {cartState === "idle" && "Add to Cart"}
                {cartState === "adding" && (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-ink" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Adding...
                  </span>
                )}
                {cartState === "added" && (
                  <span className="flex items-center justify-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Added to Cart
                  </span>
                )}
              </button>
            </div>

            {/* Accordions (Specifications, Care, Shipping) */}
            <div className="flex flex-col border-t border-border">
              {/* Accordion Item: Specifications */}
              <div className="border-b border-border">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === "specifications" ? "" : "specifications")}
                  className="w-full flex items-center justify-between py-4 bg-transparent border-0 cursor-pointer text-left"
                >
                  <span className="font-body font-medium text-xs tracking-wider uppercase text-ink">
                    Specifications
                  </span>
                  <svg
                    width="10"
                    height="6"
                    viewBox="0 0 10 6"
                    fill="none"
                    className={`text-muted transition-transform duration-300 ${
                      activeAccordion === "specifications" ? "rotate-180" : ""
                    }`}
                  >
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {activeAccordion === "specifications" && (
                  <div className="pb-5 pt-1 animate-fadeIn">
                    <dl className="m-0 grid grid-cols-1 gap-y-2.5 font-body text-[0.8rem]">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between border-b border-border/40 pb-1.5 last:border-0 last:pb-0">
                          <dt className="text-muted font-light">{key}</dt>
                          <dd className="text-ink font-normal m-0">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}
              </div>

              {/* Accordion Item: Material & Care */}
              <div className="border-b border-border">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === "care" ? "" : "care")}
                  className="w-full flex items-center justify-between py-4 bg-transparent border-0 cursor-pointer text-left"
                >
                  <span className="font-body font-medium text-xs tracking-wider uppercase text-ink">
                    Material &amp; Care
                  </span>
                  <svg
                    width="10"
                    height="6"
                    viewBox="0 0 10 6"
                    fill="none"
                    className={`text-muted transition-transform duration-300 ${
                      activeAccordion === "care" ? "rotate-180" : ""
                    }`}
                  >
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {activeAccordion === "care" && (
                  <div className="pb-5 pt-1 animate-fadeIn">
                    <p className="font-body font-light text-[0.8rem] leading-[1.7] text-muted m-0">
                      {product.careInstructions}
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion Item: Shipping & Returns */}
              <div className="border-b border-border">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === "shipping" ? "" : "shipping")}
                  className="w-full flex items-center justify-between py-4 bg-transparent border-0 cursor-pointer text-left"
                >
                  <span className="font-body font-medium text-xs tracking-wider uppercase text-ink">
                    Shipping &amp; Returns
                  </span>
                  <svg
                    width="10"
                    height="6"
                    viewBox="0 0 10 6"
                    fill="none"
                    className={`text-muted transition-transform duration-300 ${
                      activeAccordion === "shipping" ? "rotate-180" : ""
                    }`}
                  >
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {activeAccordion === "shipping" && (
                  <div className="pb-5 pt-1 animate-fadeIn">
                    <p className="font-body font-light text-[0.8rem] leading-[1.7] text-muted m-0">
                      We offer complimentary white-glove delivery on all orders within India. Handcrafted furniture items take approximately 3-4 weeks to deliver. Smaller decor accessories are delivered within 5-7 business days.
                      <br /><br />
                      Returns are accepted within 14 days of delivery in original packaging. Custom-crafted items and furniture are subject to a 15% restocking fee.
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Related Products Section */}
      <section className="bg-surface py-16 md:py-20 border-t border-border">
        <div className="px-[clamp(1.5rem,5vw,4rem)]">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="block w-5 h-px bg-bronze" />
            <span className="font-body font-normal text-[0.55rem] tracking-[0.38em] uppercase text-bronze">
              Complementary
            </span>
          </div>
          <h2 className="font-display font-light text-[clamp(1.8rem,3vw,2.5rem)] text-ink m-0 mb-10">
            You May Also <em className="text-bronze italic font-medium">Like</em>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {displayRelated.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="block no-underline group"
              >
                <div className="relative overflow-hidden bg-background aspect-[3/4] border border-border group-hover:border-bronze/40 transition-colors duration-300">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-104"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(p.id);
                    }}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-background/95 border border-border flex items-center justify-center cursor-pointer hover:border-bronze transition-colors duration-200 z-10"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" className="text-bronze"
                      fill={isInWishlist(p.id) ? "currentColor" : "none"}
                      stroke="currentColor" strokeWidth="1.8">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                </div>
                <div className="pt-3.5">
                  <p className="font-display font-medium text-[0.95rem] text-ink m-0 mb-1 leading-tight group-hover:text-bronze transition-colors duration-200">
                    {p.name}
                  </p>
                  <p className="font-display font-semibold text-[0.95rem] text-ink m-0">
                    ₹{p.price.toLocaleString("en-IN")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <BrandStrip />

      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ProductDetailPage;
