import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";

export default function StyledByYou() {
  const [showcases, setShowcases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShowcases = async () => {
      try {
        const res = await API.get("/showcases");
        setShowcases(res.data);
      } catch (error) {
        console.error("Failed to fetch showcases:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShowcases();
  }, []);

  if (loading) {
    return (
      <section className="bg-background py-20 md:py-24 border-b border-border/40">
        <div className="px-[clamp(1.5rem,5vw,4rem)] flex items-center justify-center min-h-[300px]">
          <span className="font-body text-xs text-muted tracking-widest uppercase animate-pulse">
            Loading community gallery...
          </span>
        </div>
      </section>
    );
  }

  if (showcases.length === 0) {
    return null; // Don't render section if empty
  }

  return (
    <section className="bg-background py-20 md:py-24 border-b border-border/40">
      <div className="px-[clamp(1.5rem,5vw,4rem)]">

        {/* Title Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
          <div>
            <div className="flex items-center gap-2.5 mb-3.5">
              <span className="block w-5 h-px bg-bronze" />
              <span className="font-body font-normal text-[0.55rem] tracking-[0.38em] uppercase text-bronze">
                Styled by You
              </span>
            </div>
            <h2 className="font-display font-light text-[clamp(1.8rem,3.5vw,2.8rem)] text-ink m-0 leading-[1.1]">
              Novella <em className="text-bronze font-medium italic">in Your Spaces</em>
            </h2>
          </div>
          
          <p className="font-body font-light text-[0.8rem] text-muted max-w-xs leading-relaxed m-0">
            A look at how our community styles Novella elements inside their homes. Tag <strong className="font-medium text-bronze">@novella.atelier</strong> to be featured.
          </p>
        </div>

        {/* Horizontal Scrollable Gallery */}
        <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
          {showcases.map((item) => (
            <div
              key={item._id || item.id}
              className="group relative flex-shrink-0 w-[280px] sm:w-[320px] md:w-[350px] overflow-hidden aspect-[4/5] rounded-[22px] border border-border/50 bg-surface shadow-sm hover:shadow-md transition-all duration-500 snap-start"
            >
              {/* Image backdrop */}
              <img
                src={item.image}
                alt={`Styled room by ${item.handle}`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[800ms] group-hover:scale-103 group-hover:brightness-[0.85]"
              />

              {/* Fading details overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-deep/95 via-dark/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                
                {/* Social handle */}
                <span className="font-body font-normal text-[0.7rem] text-gold tracking-wider mb-0.5">
                  {item.handle}
                </span>
                
                {/* Space & Product spotlight */}
                <h3 className="font-display font-medium text-[1.1rem] text-cream m-0 leading-tight mb-2">
                  {item.space}
                </h3>
                
                {/* Link to product */}
                <Link
                  to={item.productId === "6" ? "/shop" : `/product/${item.productId}`}
                  className="no-underline inline-flex items-center gap-1.5 self-start font-body font-medium text-[0.58rem] tracking-[0.2em] uppercase text-cream/70 hover:text-white transition-colors duration-200"
                >
                  <span>Shop {item.productName}</span>
                  <svg width="10" height="6" viewBox="0 0 18 8" fill="none">
                    <path d="M0 4H16M13 1L16 4L13 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
