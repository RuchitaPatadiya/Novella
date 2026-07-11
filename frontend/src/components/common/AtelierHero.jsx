import React from "react";

export default function AtelierHero({
  eyebrow = "The Atelier Edit",
  title = "Decor Carnival Sale",
  subtitle = "Flat 40% Off + Extra 5% Off on Prepaid Orders",
  bottomText = "↓ Discover Catalog ↓",
  images = [
    "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=400&q=80",
    "https://images.unsplash.com/photo-1581781870027-04212e231e96?w=400&q=80",
    "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400&q=80"
  ]
}) {
  return (
    <div className="w-full bg-gradient-to-r from-surface to-background border-b border-border/50 py-12 md:py-16 px-[clamp(1.5rem,5vw,4rem)] overflow-hidden animate-fadeIn">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">
        
        {/* Left Side: Editorial Branding & Promotion */}
        <div className="lg:col-span-5 text-left space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-px bg-bronze" />
            <span className="font-body font-light text-[0.6rem] tracking-[0.25em] text-bronze uppercase">
              {eyebrow}
            </span>
          </div>
          
          <h1 className="font-display font-light text-[clamp(2.2rem,5vw,3.5rem)] text-ink leading-[1.1] m-0 uppercase tracking-wide">
            {title}
          </h1>
          
          {subtitle && (
            <p className="font-body font-light text-sm text-muted tracking-wide max-w-sm leading-relaxed">
              {subtitle}
            </p>
          )}

          {bottomText && (
            <div className="pt-2 font-body font-semibold text-[0.62rem] tracking-[0.2em] uppercase text-ink flex items-center gap-1.5 animate-bounce mt-4">
              {bottomText}
            </div>
          )}
        </div>

        {/* Right Side: Staggered White-Border Gallery */}
        <div className="lg:col-span-7 flex justify-center lg:justify-end items-center gap-4 sm:gap-6 pt-4 lg:pt-0">
          {images.slice(0, 3).map((imgUrl, i) => {
            // Apply unique rotation to each card to create the staggered organic look
            const rotations = ["-rotate-2 hover:rotate-0", "rotate-0 hover:scale-108", "rotate-3 hover:rotate-0"];
            const offsets = ["translate-y-2", "-translate-y-2", "translate-y-1"];
            
            return (
              <div
                key={i}
                className={`bg-white border-[6px] border-white shadow-[0_12px_24px_rgba(27,27,27,0.06)] hover:shadow-[0_20px_40px_rgba(27,27,27,0.12)] rounded-[2px] overflow-hidden w-[100px] sm:w-[150px] md:w-[170px] h-[150px] sm:h-[220px] md:h-[240px] transform transition-all duration-300 hover:-translate-y-4 ${rotations[i]} ${offsets[i]}`}
              >
                <img
                  src={imgUrl}
                  alt={`Atelier feature element ${i + 1}`}
                  className="w-full h-full object-cover select-none"
                />
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
