import { Link } from "react-router-dom";

export default function ShopHero({ totalProducts = 12 }) {
  return (
    <div className="relative h-[55vh] min-h-[400px] bg-dark flex items-center justify-center overflow-hidden">

      {/* Background image */}
      <img
        src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1400&q=85"
        alt="Shop"
        className="absolute inset-0 w-full h-full object-cover object-[center_40%] brightness-[0.45]"
      />

      {/* Bottom gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark-deep/70 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-3 mb-5">
          <span className="block w-7 h-px bg-gold" />
          <span className="font-body font-light text-[0.58rem] tracking-[0.42em] uppercase text-gold">
            The Novella Edit
          </span>
          <span className="block w-7 h-px bg-gold" />
        </div>

        {/* Heading */}
        <h1 className="font-display font-light text-[clamp(2.5rem,6vw,5rem)] text-cream m-0 leading-[1.05] tracking-[-0.01em]">
          Discover Our{" "}
          <em className="text-gold font-medium not-italic">Collections</em>
        </h1>

        {/* Subtext */}
        <p className="font-body font-light text-[0.88rem] text-cream-muted/50 mt-4 tracking-[0.04em]">
          {totalProducts} curated pieces for every corner of your home
        </p>
      </div>

    </div>
  );
}
