import { useRef } from "react";

const reviews = [
  {
    id: 1,
    quote: "The Arco lamp completely changed our living room. It's the first thing every guest notices.",
    name: "Priya M.",
    city: "Mumbai",
    rating: 5,
    product: "Arco Floor Lamp",
  },
  {
    id: 2,
    quote: "Finally found a sofa that feels luxurious but livable. The linen fabric is even better in person.",
    name: "Arjun K.",
    city: "Bangalore",
    rating: 5,
    product: "Linen Cloud Sofa",
  },
  {
    id: 3,
    quote: "Ordered the entire bedroom edit — every piece arrived beautifully packed. Worth every rupee.",
    name: "Sneha R.",
    city: "Delhi",
    rating: 5,
    product: "Bedroom Collection",
  },
];

const StarRow = ({ count }) => (
  <div className="flex gap-0.5 text-gold">
    {Array.from({ length: count }).map((_, i) => (
      <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
      </svg>
    ))}
  </div>
);

const ReviewCard = ({ review }) => (
  <div className="shrink-0 w-[min(340px,85vw)] md:w-auto flex flex-col p-7 border border-border bg-background">
    <StarRow count={review.rating} />
    <p className="font-display font-light italic text-[1.05rem] text-ink leading-[1.55] m-0 my-5 flex-1">
      "{review.quote}"
    </p>
    <div className="pt-4 border-t border-border">
      <p className="font-body font-medium text-[0.72rem] tracking-[0.08em] text-ink m-0 mb-0.5">
        {review.name}
        <span className="font-light text-muted"> · {review.city}</span>
      </p>
      <p className="font-body font-light text-[0.62rem] tracking-[0.1em] uppercase text-bronze m-0">
        {review.product}
      </p>
    </div>
  </div>
);

export default function CustomerReviews() {
  const scrollRef = useRef(null);

  return (
    <section className="bg-background py-16 md:py-20">
      <div className="px-[clamp(1.5rem,5vw,4rem)]">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="block w-5 h-px bg-bronze" />
              <span className="font-body font-normal text-[0.55rem] tracking-[0.38em] uppercase text-bronze">
                Loved by Homeowners
              </span>
            </div>
            <h2 className="font-display font-light text-[clamp(1.8rem,3.5vw,2.6rem)] text-ink m-0 leading-[1.1]">
              What Our{" "}
              <em className="text-bronze font-medium italic">Customers</em> Say
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <StarRow count={5} />
            <span className="font-body font-light text-[0.78rem] text-muted">
              4.9 average · 2,400+ reviews
            </span>
          </div>
        </div>

        {/* Desktop — 3 column grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        {/* Mobile — horizontal scroll */}
        <div
          ref={scrollRef}
          className="flex md:hidden gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [scroll-snap-type:x_mandatory]"
        >
          {reviews.map((review) => (
            <div key={review.id} className="scroll-snap-start">
              <ReviewCard review={review} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
