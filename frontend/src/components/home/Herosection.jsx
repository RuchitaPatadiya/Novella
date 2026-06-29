import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import heroImage from "../../assets/hero7.jpg";

const HeroSection = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 120);
    return () => clearTimeout(t);
  }, []);

  const fadeUp = (delay) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(28px)",
    transition: `opacity 900ms ease, transform 900ms ease`,
    transitionDelay: delay,
  });

  return (
    <section className="relative w-full h-screen min-h-[620px] overflow-hidden">

      {/* Image */}
      <img
        src={heroImage}
        alt="Luxury living room by Novella"
        className="absolute inset-0 w-full h-full object-cover object-[center_30%]"
        style={{
          transform: visible ? "scale(1.0)" : "scale(1.04)",
          transition: "transform 10000ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          willChange: "transform",
        }}
      />

      {/* Bottom gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark/85 via-dark/35 to-transparent" />
      {/* Left gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-dark/50 to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 max-w-[54rem]">

        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-7" style={fadeUp("200ms")}>
          <span className="block w-8 h-px bg-gold" />
          <span className="font-body font-normal text-[0.6rem] text-gold tracking-[0.42em] uppercase">
            New Collection 2025
          </span>
        </div>

        {/* Headline */}
        <h1 className="m-0 p-0 mb-1">
          <span
            className="block leading-[1.08] font-display font-light italic text-[clamp(3.2rem,6vw,6.2rem)] text-cream"
            style={fadeUp("370ms")}
          >
            Where every room
          </span>
          <span
            className="block leading-[1.08] font-display font-semibold text-[clamp(3.4rem,6.5vw,6.8rem)] text-gold tracking-[-0.01em]"
            style={fadeUp("510ms")}
          >
            tells your story.
          </span>
        </h1>

        {/* Decorative rule */}
        <div
          className="mt-6 mb-5 flex items-center gap-3"
          style={fadeUp("620ms")}
        >
          <span className="block w-12 h-px bg-gold/40" />
          <span className="block w-2 h-2 rounded-full border border-gold/50" />
        </div>

        {/* Subtext */}
        <p
          className="m-0 leading-[1.85] max-w-[360px] font-body font-light text-[clamp(0.82rem,1.1vw,0.96rem)] text-cream-muted/65 tracking-[0.04em]"
          style={fadeUp("660ms")}
        >
          Handpicked furniture and décor for spaces<br />
          that feel unmistakably like home.
        </p>

        {/* CTAs */}
        <div className="flex items-center gap-7 mt-10" style={fadeUp("800ms")}>
          <Link to="/shop" className="no-underline">
            <span className="block px-9 py-[13px] font-body font-medium text-[0.65rem] tracking-[0.28em] uppercase bg-gold text-dark transition-colors duration-300 hover:brightness-110">
              Shop Now
            </span>
          </Link>

          <Link to="/collections" className="no-underline flex items-center gap-2.5 group">
            <span className="font-body font-normal text-[0.65rem] tracking-[0.28em] uppercase text-cream-muted/60 transition-colors duration-300 group-hover:text-cream">
              View Collections
            </span>
            <svg
              width="18" height="8" viewBox="0 0 18 8" fill="none"
              className="text-gold transition-transform duration-300 group-hover:translate-x-1.5"
            >
              <path d="M0 4H16M13 1L16 4L13 7" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-10 right-10 flex flex-col items-center gap-3"
        style={{ opacity: visible ? 0.5 : 0, transition: "opacity 1200ms ease", transitionDelay: "1100ms" }}
      >
        <span className="font-body text-[0.5rem] [writing-mode:vertical-rl] font-normal tracking-[0.3em] uppercase text-cream">
          Scroll
        </span>
        <div className="w-px h-10 relative overflow-hidden bg-cream-muted/20">
          <div
            className="absolute top-0 left-0 w-full h-[45%] bg-gold"
            style={{ animation: "scrollDrop 2.2s ease-in-out infinite" }}
          />
        </div>
      </div>

      <style>{`
        @keyframes scrollDrop {
          0%   { transform: translateY(-100%); opacity: 0; }
          20%  { opacity: 1; }
          100% { transform: translateY(300%); opacity: 0; }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
