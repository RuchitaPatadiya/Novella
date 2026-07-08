import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import BrandStrip from "../../components/home/BrandStrip";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../context/ProductContext";
import API from "../../services/api";
import DOMPurify from "dompurify";
import { ProductDetailSkeleton } from "../../components/common/Skeleton";
import ProductCard from "../../components/common/ProductCard";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { products, loading, refreshProducts } = useProducts();
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
  const { user } = useAuth();

  // Reviews and ratings list state
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewEligibility, setReviewEligibility] = useState({ canReview: false, reason: "Loading eligibility status..." });
  const [checkingEligibility, setCheckingEligibility] = useState(false);

  // Fetch reviews on load/change
  useEffect(() => {
    const fetchReviews = async () => {
      setReviewsLoading(true);
      try {
        const res = await API.get(`/products/${id}/reviews`);
        setReviews(res.data);
      } catch (err) {
        console.error("Failed to load reviews:", err);
      } finally {
        setReviewsLoading(false);
      }
    };
    if (id) {
      fetchReviews();
      setUserRating(5);
      setUserComment("");
      setReviewError("");
      setReviewSuccess("");
    }
  }, [id]);

  // Check user eligibility for review submission
  useEffect(() => {
    const checkEligibility = async () => {
      if (!user) {
        setReviewEligibility({ canReview: false, reason: "Please log in to leave a review." });
        return;
      }
      setCheckingEligibility(true);
      try {
        const res = await API.get(`/products/${id}/review-eligibility`);
        setReviewEligibility(res.data);
      } catch (err) {
        console.error("Failed to check review eligibility:", err);
        setReviewEligibility({ canReview: false, reason: "Unable to verify purchase history." });
      } finally {
        setCheckingEligibility(false);
      }
    };

    if (id) {
      checkEligibility();
    }
  }, [id, user]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError("");
    setReviewSuccess("");
    setIsSubmittingReview(true);

    if (!userComment.trim()) {
      setReviewError("Please write a review comment before submitting.");
      setIsSubmittingReview(false);
      return;
    }

    try {
      const res = await API.post(`/products/${id}/reviews`, {
        rating: userRating,
        comment: userComment,
      });

      setReviewSuccess(res.data.message || "Your review has been submitted for moderation and will appear live once approved.");
      setReviewEligibility({ canReview: false, reason: "You have already submitted a review for this piece." });
      setUserComment("");
      setUserRating(5);

      // Re-fetch catalog to update ratings and reviewsCount on detail page
      if (refreshProducts) {
        await refreshProducts();
      }
    } catch (err) {
      setReviewError(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Scroll to top on load or product switch
  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveImageIndex(0);
    setQuantity(1);
    setCartState("idle");
  }, [id]);
  if (loading) {
    return <ProductDetailSkeleton />;
  }

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
          
          {/* Left Column: Image Gallery (cols: 6) */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            {/* Main Image View - using containment and height constraints for readability */}
            <div className="relative overflow-hidden bg-surface border border-border h-[350px] sm:h-[450px] md:h-[500px] lg:h-[550px] flex items-center justify-center group rounded-[20px]">
              <img
                src={product.images[activeImageIndex]}
                alt={product.name}
                className="max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-750 group-hover:scale-103"
              />
              {product.badge && (
                <span className="absolute top-5 left-5 bg-bronze text-background font-body text-[0.55rem] tracking-[0.25em] uppercase px-3.5 py-1.5 font-medium rounded-full">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnail Controls */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 sm:w-20 h-20 sm:h-24 flex-shrink-0 bg-surface border rounded-[12px] overflow-hidden cursor-pointer transition-all duration-300 flex items-center justify-center p-1 ${
                      activeImageIndex === idx ? "border-bronze shadow-xs" : "border-border hover:border-bronze/40"
                    }`}
                  >
                    <img src={img} alt={`${product.name} view ${idx + 1}`} className="max-w-full max-h-full w-auto h-auto object-contain rounded-[8px]" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Info & Buy Box (cols: 6) */}
          <div className="lg:col-span-6 flex flex-col">
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

            {/* Stock status indicator */}
            <div className="font-body text-xs mb-7">
              {product.stock === 0 ? (
                <span className="text-red-700 bg-red-50 border border-red-200/50 px-2.5 py-1.5 uppercase text-[0.6rem] tracking-wider font-semibold rounded-xs">
                  Out of Stock
                </span>
              ) : product.stock <= 5 ? (
                <span className="inline-flex items-center gap-1.5 text-bronze font-medium bg-bronze/5 border border-bronze/20 px-2.5 py-1.5 rounded-xs animate-pulse">
                  <span className="w-1.5 h-1.5 bg-bronze rounded-full" />
                  Only {product.stock} pieces remaining — order soon
                </span>
              ) : (
                <span className="text-emerald-700 font-medium bg-emerald-50 border border-emerald-200/40 px-2.5 py-1.5 rounded-xs">
                  In Stock
                </span>
              )}
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-border mb-7" />

            {/* Description (Sanitized HTML to prevent XSS) */}
            <div 
              className="font-body font-light text-[0.88rem] leading-[1.8] text-muted m-0 mb-8 space-y-4"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description || "") }}
            />

            {/* Cart Box */}
            <div className="flex flex-col sm:flex-row gap-4 mb-9">
              {/* Quantity Selection */}
              <div className="flex items-center justify-between border border-border h-12 px-4 sm:w-32 bg-surface">
                <button
                  type="button"
                  disabled={product.stock === 0}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="bg-transparent border-0 cursor-pointer font-body font-light text-lg text-ink hover:text-bronze p-1 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  —
                </button>
                <span className="font-body font-medium text-sm text-ink">{product.stock === 0 ? 0 : quantity}</span>
                <button
                  type="button"
                  disabled={product.stock === 0 || quantity >= product.stock}
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="bg-transparent border-0 cursor-pointer font-body font-light text-lg text-ink hover:text-bronze p-1 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={cartState !== "idle" || product.stock === 0}
                className={`flex-1 h-12 relative overflow-hidden transition-all duration-300 font-body font-medium text-xs tracking-widest uppercase cursor-pointer border ${
                  cartState === "idle"
                    ? product.stock === 0
                      ? "border-border bg-border/20 text-muted/60 cursor-not-allowed"
                      : "border-bronze bg-bronze text-background hover:brightness-110"
                    : cartState === "adding"
                    ? "border-border bg-surface text-ink cursor-default"
                    : "border-emerald-600 bg-emerald-600 text-white cursor-default"
                }`}
              >
                {cartState === "idle" && (product.stock === 0 ? "Out of Stock" : "Add to Cart")}
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
                    <div 
                      className="font-body font-light text-[0.8rem] leading-[1.7] text-muted m-0 space-y-2"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.careInstructions || "") }}
                    />
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

      {/* Reviews Section */}
      <section className="px-[clamp(1.5rem,5vw,4rem)] py-16 md:py-20 border-t border-border bg-background">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Overall Rating & Write Review */}
          <div className="lg:col-span-1">
            <h3 className="font-display font-light text-2xl text-ink mb-6">
              Ratings &amp; Reviews
            </h3>

            {/* Score box */}
            <div className="flex items-center gap-4.5 mb-8">
              <span className="font-display font-semibold text-5xl text-ink leading-none">
                {product?.rating || 0}
              </span>
              <div className="flex flex-col">
                <div className="flex items-center text-gold gap-0.5 mb-1">
                  {[...Array(5)].map((_, idx) => (
                    <svg
                      key={idx}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill={idx < Math.floor(product?.rating || 0) ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <span className="font-body text-[0.68rem] tracking-wider uppercase text-muted">
                  Based on {product?.reviewsCount || 0} Reviews
                </span>
              </div>
            </div>

            {/* Form Box */}
            <div className="border-t border-border pt-8">
              <h4 className="font-body font-medium text-xs tracking-wider uppercase text-ink mb-4">
                Share your experience
              </h4>

              {reviewSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 text-xs font-body tracking-[0.02em] mb-4 rounded-sm">
                  {reviewSuccess}
                </div>
              )}
              {reviewError && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-4 text-xs font-body tracking-[0.02em] mb-4 rounded-sm">
                  {reviewError}
                </div>
              )}

              {checkingEligibility ? (
                <div className="text-center py-8">
                  <div className="w-5 h-5 border-2 border-bronze border-t-transparent rounded-full animate-spin mx-auto mb-2.5" />
                  <p className="font-body text-xs text-muted m-0">Verifying customer eligibility...</p>
                </div>
              ) : !user ? (
                <div className="bg-surface border border-border p-4.5 text-center rounded-[2px]">
                  <p className="font-body text-xs text-muted leading-relaxed m-0 mb-3.5">
                    You must hold an active account to review this piece.
                  </p>
                  <Link to="/login" className="no-underline">
                    <span className="px-5 py-2.5 bg-ink text-background hover:bg-bronze font-body font-medium text-[0.62rem] tracking-widest uppercase transition-colors duration-200 block rounded-[2px]">
                      Log In to Write Review
                    </span>
                  </Link>
                </div>
              ) : !reviewEligibility.canReview ? (
                <div className="bg-[#FDFBF7] border border-border/75 p-5 text-center rounded-[2px] space-y-2">
                  <svg className="w-5 h-5 text-bronze/60 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <h5 className="font-body text-[0.68rem] font-medium tracking-wide uppercase text-ink m-0">Form Restricted</h5>
                  <p className="font-body text-[0.68rem] text-muted m-0 leading-relaxed max-w-[240px] mx-auto">
                    {reviewEligibility.reason}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
                  {/* Stars select */}
                  <div>
                    <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block mb-2">Rating</label>
                    <div className="flex items-center gap-1.5 text-gold">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setUserRating(star)}
                          className="bg-transparent border-0 cursor-pointer p-0 hover:scale-110 transition-transform text-gold"
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill={star <= userRating ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="font-body text-[0.62rem] uppercase tracking-wider text-muted block mb-2">Your Review</label>
                    <textarea
                      value={userComment}
                      onChange={(e) => setUserComment(e.target.value)}
                      rows="4"
                      placeholder="What did you think of the finish, quality, and material of this piece?..."
                      className="w-full bg-background border border-border px-4 py-3 font-body text-xs text-ink outline-none focus:border-bronze rounded-[2px] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="h-11 bg-ink hover:bg-bronze text-background font-body font-medium text-[0.62rem] tracking-[0.2em] uppercase border-0 cursor-pointer transition-colors duration-300 disabled:opacity-55 rounded-[2px]"
                  >
                    {isSubmittingReview ? "Submitting Review..." : "Submit Review"}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Customer Comments list */}
          <div className="lg:col-span-2 border-t lg:border-t-0 lg:border-l border-border pt-10 lg:pt-0 lg:pl-12">
            <h3 className="font-display font-light text-2xl text-ink mb-6">
              Customer Experiences
            </h3>

            {reviewsLoading ? (
              <div className="font-body text-xs text-muted tracking-widest uppercase animate-pulse">
                Loading Reviews...
              </div>
            ) : reviews.length === 0 ? (
              <div className="bg-surface border border-border/60 py-12 px-6 text-center rounded-[2px] italic font-body text-xs text-muted">
                No reviews yet. Be the first to share your thoughts on this designer piece!
              </div>
            ) : (
              <div className="flex flex-col gap-6.5 max-h-[550px] overflow-y-auto pr-2">
                {reviews.map((rev) => (
                  <div key={rev._id} className="border-b border-border/50 pb-5 last:border-0 last:pb-0 animate-fadeIn">
                    <div className="flex items-center justify-between gap-4 mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-body font-medium text-xs text-ink">
                          {rev.name}
                        </span>
                        {rev.isVerifiedBuyer && (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200/40 text-[0.55rem] font-body font-medium px-1.5 py-0.5 rounded-sm uppercase tracking-wider scale-90 origin-left">
                            <svg className="w-2.5 h-2.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Verified Buyer
                          </span>
                        )}
                      </div>
                      <span className="font-body text-[0.68rem] text-muted font-light">
                        {new Date(rev.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center text-gold gap-0.5 mb-2.5">
                      {[...Array(5)].map((_, idx) => (
                        <svg
                          key={idx}
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill={idx < rev.rating ? "currentColor" : "none"}
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>

                    <p className="font-body font-light text-xs leading-[1.8] text-muted m-0">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayRelated.map((p) => (
              <ProductCard key={p.id || p._id} product={p} />
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
