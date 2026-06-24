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
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap"
        rel="stylesheet"
      />

      <section className="relative w-full h-screen min-h-[620px] overflow-hidden">

        {/* Image */}
        <img
          src={heroImage}
          alt="Luxury living room by Novella"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            objectPosition: "center 30%",
            transform: visible ? "scale(1.0)" : "scale(1.04)",
            transition: "transform 10000ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            willChange: "transform",
          }}
        />

        {/* Warm sepia overlay — gives the image a luxe golden tone */}
        {/* <div className="absolute inset-0" style={{ background: "rgba(60,35,10,0.38)", mixBlendMode: "multiply" }} /> */}
        {/* Bottom gradient for text */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(28,18,8,0.85) 0%, rgba(28,18,8,0.35) 45%, transparent 75%)" }} />
        {/* Left gradient */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(28,18,8,0.5) 0%, transparent 65%)" }} />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 max-w-[54rem]">

          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-7" style={fadeUp("200ms")}>
            <span className="block w-8 h-px" style={{ background: "#C8A97E" }} />
            <span style={{ fontFamily: "'Jost', sans-serif", fontWeight: 400, fontSize: "0.6rem", color: "#C8A97E", letterSpacing: "0.42em", textTransform: "uppercase" }}>
              New Collection 2025
            </span>
          </div>

          {/* Headline */}
          <h1 className="m-0 p-0 mb-1">
            <span
              className="block leading-[1.08]"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
                fontStyle: "italic",
                fontSize: "clamp(3.2rem, 6vw, 6.2rem)",
                color: "#FAF0E0",
                ...fadeUp("370ms"),
              }}
            >
              Where every room
            </span>
            <span
              className="block leading-[1.08]"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 600,
                fontSize: "clamp(3.4rem, 6.5vw, 6.8rem)",
                color: "#C8A97E",
                letterSpacing: "-0.01em",
                ...fadeUp("510ms"),
              }}
            >
              tells your story.
            </span>
          </h1>

          {/* Decorative rule */}
          <div style={{ ...fadeUp("620ms"), marginTop: "1.5rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span className="block w-12 h-px" style={{ background: "rgba(200,169,126,0.4)" }} />
            <span className="block w-2 h-2 rounded-full" style={{ border: "1px solid rgba(200,169,126,0.5)" }} />
          </div>

          {/* Subtext */}
          <p
            className="m-0 leading-[1.85] max-w-[360px]"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontWeight: 300,
              fontSize: "clamp(0.82rem, 1.1vw, 0.96rem)",
              letterSpacing: "0.04em",
              color: "rgba(240,225,200,0.65)",
              ...fadeUp("660ms"),
            }}
          >
            Handpicked furniture and décor for spaces<br />
            that feel unmistakably like home.
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-7 mt-10" style={fadeUp("800ms")}>
            <Link to="/shop" className="no-underline">
              <span
                className="block px-9 py-[13px] transition-all duration-300"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontWeight: 500,
                  fontSize: "0.65rem",
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  background: "#C8A97E",
                  color: "#1C1208",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#D4B98A"}
                onMouseLeave={e => e.currentTarget.style.background = "#C8A97E"}
              >
                Explore Collection
              </span>
            </Link>

            <Link to="/about" className="no-underline flex items-center gap-2.5 group">
              <span
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontWeight: 400,
                  fontSize: "0.65rem",
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "rgba(240,225,200,0.6)",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={e => e.currentTarget.style.color = "#FAF0E0"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(240,225,200,0.6)"}
              >
                Our Story
              </span>
              <svg width="18" height="8" viewBox="0 0 18 8" fill="none"
                className="transition-transform duration-300 group-hover:translate-x-1.5"
                style={{ color: "#C8A97E" }}>
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
          <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.5rem", writingMode: "vertical-rl", fontWeight: 400, letterSpacing: "0.3em", textTransform: "uppercase", color: "#FAF0E0" }}>
            Scroll
          </span>
          <div className="w-px h-10 relative overflow-hidden" style={{ background: "rgba(240,225,200,0.2)" }}>
            <div className="absolute top-0 left-0 w-full" style={{ height: "45%", background: "#C8A97E", animation: "scrollDrop 2.2s ease-in-out infinite" }} />
          </div>
        </div>

        {/* Stats strip */}
        {/* <div
          className="absolute bottom-0 left-0 right-0 border-t"
          style={{
            borderColor: "rgba(200,169,126,0.2)",
            background: "linear-gradient(to right, rgba(28,18,8,0.75), rgba(28,18,8,0.45))",
            backdropFilter: "blur(8px)",
            opacity: visible ? 1 : 0,
            transition: "opacity 1000ms ease",
            transitionDelay: "1000ms",
          }}
        >
          {[
            { number: "2,400+", label: "Curated Pieces" },
            { number: "180+",   label: "Trusted Brands"  },
            { number: "12k+",   label: "Happy Homes"     },
          ].map((stat, i) => (
            <div key={i} className="inline-flex flex-col items-center justify-center py-4 border-r last:border-r-0"
              style={{ width: "33.333%", borderColor: "rgba(200,169,126,0.15)" }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: "clamp(1.1rem, 2vw, 1.55rem)", color: "#C8A97E", lineHeight: 1, marginBottom: "3px" }}>
                {stat.number}
              </span>
              <span style={{ fontFamily: "'Jost', sans-serif", fontWeight: 400, fontSize: "0.55rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(240,225,200,0.4)" }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div> */}

        <style>{`
          @keyframes scrollDrop {
            0%   { transform: translateY(-100%); opacity: 0; }
            20%  { opacity: 1; }
            100% { transform: translateY(300%); opacity: 0; }
          }
        `}</style>
      </section>
    </>
  );
};

export default HeroSection;