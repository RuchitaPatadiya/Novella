import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logoImg from "../../assets/logo1.png";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const navLinks = [
    { label: "Shop", to: "/shop" },
    { label: "Collections", to: "/collections" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
  ];

  return (
    <>
      {/* Font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Jost:wght@300;400;500&display=swap"
        rel="stylesheet"
      />

      <nav
        className="fixed top-0 left-0 right-0 z-50 h-[76px] flex items-center justify-between px-8 md:px-14 transition-all duration-500"
        style={{
          background: scrolled
            ? "rgba(28, 18, 8, 0.92)"
            : "linear-gradient(to bottom, rgba(0,0,0,0.45), transparent)",
          backdropFilter: scrolled ? "blur(14px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(14px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(200,169,126,0.15)" : "none",
        }}
      >
        {/* ── LOGO ── */}
        <Link to="/" className="flex items-center gap-3 no-underline group">
          <img
            src={logoImg}
            alt="Novella"
            className="w-8 h-8 object-contain"
            style={{
              filter: "invert(1) sepia(1) saturate(1.5) hue-rotate(5deg) brightness(0.9)",
            }}
          />
          <div className="flex flex-col leading-none">
            <span
              className="text-white tracking-[0.25em] uppercase group-hover:text-[#C8A97E] transition-colors duration-300"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: "1.05rem" }}
            >
              Novella
            </span>
            <span
              className="text-[#C8A97E]/65 tracking-[0.35em] uppercase mt-[2px]"
              style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: "0.42rem" }}
            >
              Home &amp; Décor
            </span>
          </div>
        </Link>

        {/* ── DESKTOP NAV ── */}
        <ul className="hidden md:flex items-center list-none m-0 p-0" style={{ gap: "2.8rem" }}>
          {navLinks.map((link) => (
            <li key={link.to} className="relative group">
              <Link
                to={link.to}
                className="no-underline transition-colors duration-300"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontWeight: 400,
                  fontSize: "0.68rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: location.pathname === link.to ? "#C8A97E" : "rgba(255,255,255,0.75)",
                }}
              >
                {link.label}
              </Link>
              {/* animated underline */}
              <span
                className="absolute -bottom-1 left-0 h-px bg-[#C8A97E] transition-all duration-300"
                style={{ width: location.pathname === link.to ? "100%" : "0%" }}
              />
              <span className="absolute -bottom-1 left-0 h-px bg-[#C8A97E] w-0 group-hover:w-full transition-all duration-300" />
            </li>
          ))}
        </ul>

        {/* ── RIGHT ICONS ── */}
        <div className="flex items-center gap-5">
          {/* Search */}
          <button
            aria-label="Search"
            className="text-white/55 hover:text-[#C8A97E] transition-colors duration-300 bg-transparent border-0 cursor-pointer p-1 flex items-center"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          {/* Wishlist */}
          <button
            aria-label="Wishlist"
            className="hidden md:flex text-white/55 hover:text-[#C8A97E] transition-colors duration-300 bg-transparent border-0 cursor-pointer p-1 items-center"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

          {/* Cart */}
          <Link
            to="/cart"
            aria-label="Cart"
            className="relative text-white/55 hover:text-[#C8A97E] transition-colors duration-300 p-1 flex items-center no-underline"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-[#C8A97E] text-[#0F0C0A] text-[0.55rem] font-bold w-[14px] h-[14px] rounded-full flex items-center justify-center"
              style={{ fontFamily: "'Jost', sans-serif" }}>
              0
            </span>
          </Link>

          {/* Profile */}
          <Link
            to="/login"
            aria-label="Account"
            className="hidden md:flex text-white/55 hover:text-[#C8A97E] transition-colors duration-300 p-1 items-center no-underline"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Link>

          {/* Divider + CTA on desktop */}
          <div className="hidden lg:flex items-center gap-4 ml-2 pl-5 border-l border-white/15">
            <Link
              to="/shop"
              className="no-underline px-5 py-2 text-[#0F0C0A] bg-[#C8A97E] hover:bg-[#d4b98a] transition-colors duration-300"
              style={{
                fontFamily: "'Jost', sans-serif",
                fontWeight: 500,
                fontSize: "0.62rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              Shop Now
            </Link>
          </div>

          {/* Hamburger */}
          <button
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden flex flex-col gap-[5px] bg-transparent border-0 cursor-pointer p-1 ml-1"
          >
            <span className={`block w-5 h-px bg-white/80 transition-all duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-[6px]" : ""}`} />
            <span className={`block w-5 h-px bg-white/80 transition-all duration-300 ${menuOpen ? "opacity-0 w-0" : "opacity-100"}`} />
            <span className={`block w-5 h-px bg-white/80 transition-all duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-[6px]" : ""}`} />
          </button>
        </div>
      </nav>

      {/* ── MOBILE DRAWER ── */}
      <div
        className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-9 transition-all duration-500"
        style={{
          background: "rgba(28,18,8,0.98)",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transform: menuOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Mobile logo */}
        <div className="flex items-center gap-2 mb-6 opacity-50">
          <img src={logoImg} alt="Novella" className="w-7 h-7 object-contain"
            style={{ filter: "invert(1) sepia(1) saturate(1.5) hue-rotate(5deg) brightness(0.9)" }} />
          <span className="text-white tracking-[0.25em] uppercase"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: "1rem" }}>
            Novella
          </span>
        </div>

        {navLinks.map((link, i) => (
          <Link
            key={link.to}
            to={link.to}
            className="no-underline transition-colors duration-200"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontStyle: "italic",
              fontSize: "2.4rem",
              letterSpacing: "0.06em",
              color: location.pathname === link.to ? "#C8A97E" : "rgba(255,255,255,0.85)",
              transitionDelay: `${i * 60}ms`,
            }}
          >
            {link.label}
          </Link>
        ))}

        <Link to="/login"
          className="mt-6 no-underline text-white/35 hover:text-[#C8A97E] transition-colors duration-200"
          style={{ fontFamily: "'Jost', sans-serif", fontWeight: 400, fontSize: "0.65rem", letterSpacing: "0.22em", textTransform: "uppercase" }}>
          My Account
        </Link>
      </div>
    </>
  );
};

export default Navbar;