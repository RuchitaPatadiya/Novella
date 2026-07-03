import React from "react";

export default function CollectionsHero() {
  return (
    <div className="relative h-[55vh] min-h-[400px] bg-dark flex items-center justify-center overflow-hidden">

      {/* Background image — matched brightness to other heroes */}
      <img
        src="https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=1600&q=85"
        alt="Collections Curation"
        className="absolute inset-0 w-full h-full object-cover object-[center_40%] brightness-[0.55] saturate-90"
      />

      {/* Subtle bottom gradient for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark-deep/75 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl">

        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-3 mb-5">
          <span className="block w-7 h-px bg-gold" />
          <span className="font-body font-light text-[0.58rem] tracking-[0.42em] uppercase text-gold">
            Novella Curation
          </span>
          <span className="block w-7 h-px bg-gold" />
        </div>

        {/* Heading */}
        <h1 className="font-display font-light text-[clamp(2.5rem,6vw,5rem)] text-cream m-0 leading-[1.05] tracking-[-0.01em]">
          Discover Our{" "}
          <em className="text-gold font-medium not-italic">Aesthetic</em>
        </h1>

        {/* Subtext */}
        <p className="font-body font-light text-[0.88rem] text-cream-muted/50 mt-4 tracking-[0.04em]">
          Six curated worlds. One home. Discover the collection that speaks to you.
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-5 right-10 hidden md:flex flex-col items-center gap-2 opacity-40">
        <div className="w-px h-10 bg-cream-muted/20 relative overflow-hidden">
          <div
            className="absolute top-0 left-0 w-full h-[45%] bg-gold"
            style={{ animation: "scrollDrop 2s ease-in-out infinite" }}
          />
        </div>
        <span className="font-body font-light text-[0.48rem] tracking-[0.3em] uppercase text-cream-muted [writing-mode:vertical-rl]">
          Scroll
        </span>
      </div>

      <style>{`
        @keyframes scrollDrop {
          0%   { transform: translateY(-100%); opacity: 0; }
          20%  { opacity: 1; }
          100% { transform: translateY(300%); opacity: 0; }
        }
      `}</style>
    </div>
  );
}