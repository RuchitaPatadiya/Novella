import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logoImg from "../../assets/logo1.png";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import SearchOverlay from "../search/SearchOverlay";
import { useAuth } from "../../context/AuthContext";

const navLinks = [
  {
    label: "Shop",
    to: "/shop",
    mega: [
      { label: "Furniture",         to: "/shop/furniture",         desc: "Sofas, tables, beds & more" },
      { label: "Lighting",          to: "/shop/lighting",          desc: "Lamps, pendants & sconces"  },
      { label: "Wall Decor",        to: "/shop/wall-decor",        desc: "Art, mirrors & wall panels" },
      { label: "Textiles",          to: "/shop/textiles",          desc: "Rugs, cushions & throws"    },
      { label: "Decor Accessories", to: "/shop/decor-accessories", desc: "Vases, candles & objects"   },
    ],
  },
  {
    label: "Spaces",
    to: "/spaces",
    mega: [
      { label: "Living Room", to: "/spaces/living-room", desc: "Style your main space"      },
      { label: "Bedroom",     to: "/spaces/bedroom",     desc: "Rest in refined comfort"    },
      { label: "Dining Room", to: "/spaces/dining-room", desc: "Gather around beauty"       },
      { label: "Home Office", to: "/spaces/home-office", desc: "Work in an inspired space"  },
      { label: "Outdoor",     to: "/spaces/outdoor",     desc: "Extend your living outside" },
    ],
  },
  {
    label: "Collections",
    to: "/collections",
    mega: [
      { label: "Modern Minimalist", to: "/collections/modern-minimalist", desc: "Clean lines, calm spaces"    },
      { label: "Luxury Living",     to: "/collections/luxury-living",     desc: "Opulence, refined"           },
      { label: "Scandinavian",      to: "/collections/scandinavian",      desc: "Nordic warmth & simplicity"  },
      { label: "Boho Chic",         to: "/collections/boho-chic",         desc: "Layered, free-spirited"      },
      { label: "New Arrivals",      to: "/collections/new-arrivals",      desc: "Just landed this season"     },
      { label: "Best Sellers",      to: "/collections/best-sellers",      desc: "Our most loved pieces"       },
    ],
  },
  { label: "About",   to: "/about"   },
  { label: "Contact", to: "/contact" },
];

const Navbar = () => {
  const { wishlist } = useWishlist();
  const { cartCount, setIsCartOpen } = useCart();
  const { user } = useAuth();
  const [scrolled,   setScrolled]   = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [activeMega, setActiveMega] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  const isHomePage = location.pathname === "/";
  const isSolid = scrolled || activeMega || !isHomePage;
  const isNavbarDark = isHomePage;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setActiveMega(null);
    setSearchOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <nav
        onMouseLeave={() => setActiveMega(null)}
        className={`fixed top-0 left-0 right-0 z-50 h-[76px] flex items-center justify-between px-8 md:px-14 transition-all duration-500 ${
          isSolid
            ? isNavbarDark
              ? "bg-dark/95 backdrop-blur-md border-b border-gold/12 shadow-md"
              : "bg-background/90 backdrop-blur-md border-b border-border shadow-sm"
            : "bg-gradient-to-b from-black/60 to-transparent"
        }`}
      >
        <Link to="/" className="flex items-center gap-3 no-underline group shrink-0">
          <img
            src={logoImg}
            alt="Novella"
            className={`w-10 h-10 object-contain transition-all duration-300 ${
              isNavbarDark
                ? "[filter:invert(1)_sepia(1)_saturate(1.5)_hue-rotate(5deg)_brightness(0.9)]"
                : "[filter:contrast(1.1)_brightness(0.95)]"
            }`}
          />
          <div className="flex flex-col leading-none">
            <span className={`font-display font-semibold text-[1.05rem] tracking-[0.25em] uppercase transition-colors duration-300 ${
              isNavbarDark ? "text-white group-hover:text-gold" : "text-ink group-hover:text-bronze"
            }`}>
              Novella
            </span>
            <span className={`font-body font-light text-[0.42rem] tracking-[0.35em] uppercase mt-[2px] ${
              isNavbarDark ? "text-gold/50" : "text-bronze/70"
            }`}>
              Home &amp; Décor
            </span>
          </div>
        </Link>

        <ul className="hidden md:flex items-center list-none m-0 p-0 gap-[2.4rem]">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to || location.pathname.startsWith(link.to + "/");
            const isOpen   = activeMega === link.label;
            return (
              <li
                key={link.label}
                className="relative"
                onMouseEnter={() => setActiveMega(link.mega ? link.label : null)}
              >
                <Link
                  to={link.to}
                  className={`no-underline flex items-center gap-1.5 font-body font-normal text-[0.68rem] tracking-[0.2em] uppercase transition-colors duration-300 ${
                    isNavbarDark
                      ? `hover:text-white/85 ${isActive || isOpen ? "text-gold" : "text-white/50"}`
                      : `hover:text-ink/90 ${isActive || isOpen ? "text-bronze font-medium" : "text-ink/60"}`
                  }`}
                >
                  {link.label}
                  {link.mega && (
                    <svg
                      width="8" height="5" viewBox="0 0 10 6" fill="none"
                      className={`transition-transform duration-300 ${
                        isNavbarDark ? "text-gold/50" : "text-bronze/60"
                      } ${isOpen ? "rotate-180" : ""}`}
                    >
                      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </Link>

                {isActive && (
                  <span className={`absolute -bottom-[10px] left-1/2 -translate-x-1/2 w-[3px] h-[3px] rounded-full ${
                    isNavbarDark ? "bg-gold" : "bg-bronze"
                  }`} />
                )}
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-5">
          <button
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
            className={`transition-colors duration-300 bg-transparent border-0 cursor-pointer p-1 flex items-center ${
              isNavbarDark ? "text-white/55 hover:text-gold" : "text-ink/65 hover:text-bronze"
            }`}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className={`relative transition-colors duration-300 p-1 flex items-center no-underline ${
              isNavbarDark ? "text-white/55 hover:text-gold" : "text-ink/65 hover:text-bronze"
            }`}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {wishlist.length > 0 && (
              <span className={`absolute -top-1 -right-1 font-body text-[0.55rem] font-bold w-[14px] h-[14px] rounded-full flex items-center justify-center ${
                isNavbarDark ? "bg-gold text-dark-deep" : "bg-bronze text-background"
              }`}>
                {wishlist.length}
              </span>
            )}
          </Link>

          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="Cart"
            className={`relative transition-colors duration-300 p-1 flex items-center no-underline bg-transparent border-0 cursor-pointer ${
              isNavbarDark ? "text-white/55 hover:text-gold" : "text-ink/65 hover:text-bronze"
            }`}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <span className={`absolute -top-1 -right-1 font-body text-[0.55rem] font-bold w-[14px] h-[14px] rounded-full flex items-center justify-center ${
              isNavbarDark ? "bg-gold text-dark-deep" : "bg-bronze text-background"
            }`}>
              {cartCount}
            </span>
          </button>

          <Link
            to={user ? "/profile" : "/login"}
            aria-label={user ? "Profile" : "Account"}
            className={`hidden md:flex transition-colors duration-300 p-1 items-center no-underline ${
              isNavbarDark ? "text-white/55 hover:text-gold" : "text-ink/65 hover:text-bronze"
            }`}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Link>



          <button
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(o => !o)}
            className="md:hidden flex flex-col gap-[5px] bg-transparent border-0 cursor-pointer p-1 ml-1"
          >
            <span className={`block w-5 h-px transition-all duration-300 origin-center ${
              isNavbarDark ? "bg-white/80" : "bg-ink/80"
            } ${menuOpen ? "rotate-45 translate-y-[6px]" : ""}`} />
            <span className={`block w-5 h-px transition-all duration-300 ${
              isNavbarDark ? "bg-white/80" : "bg-ink/80"
            } ${menuOpen ? "opacity-0" : "opacity-100"}`} />
            <span className={`block w-5 h-px transition-all duration-300 origin-center ${
              isNavbarDark ? "bg-white/80" : "bg-ink/80"
            } ${menuOpen ? "-rotate-45 -translate-y-[6px]" : ""}`} />
          </button>
        </div>
      </nav>

      {navLinks.filter(l => l.mega).map(link => (
        <div
          key={link.label}
          onMouseEnter={() => setActiveMega(link.label)}
          onMouseLeave={() => setActiveMega(null)}
          className={`fixed left-0 right-0 z-40 top-[76px] bg-dark/97 backdrop-blur-xl border-b border-gold/12 transition-all duration-200 ease-out ${
            activeMega === link.label
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-1.5 pointer-events-none"
          }`}
        >
          <div className="max-w-6xl mx-auto px-14 py-10 flex gap-16 items-start">

            <div className="shrink-0 min-w-[140px]">
              <p className="font-body font-light text-[0.55rem] tracking-[0.38em] uppercase text-gold/50 m-0 mb-2">
                Browse
              </p>
              <h3 className="font-display font-light italic text-[1.9rem] text-white/90 m-0 mb-3.5 leading-tight">
                {link.label}
              </h3>
              <div className="w-6 h-px bg-gold" />
            </div>

            <div
              className="flex-1 grid gap-x-10 gap-y-1"
              style={{ gridTemplateColumns: `repeat(${link.mega.length > 4 ? 2 : 1}, 1fr)` }}
            >
              {link.mega.map(item => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="no-underline group flex flex-col py-2.5 border-b border-gold/10 hover:border-gold/20 transition-colors duration-200"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-[3px] h-[3px] rounded-full bg-gold opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0" />
                    <span className="font-body font-normal text-[0.8rem] tracking-[0.06em] text-white/50 group-hover:text-white/85 transition-colors duration-200">
                      {item.label}
                    </span>
                  </div>
                  {item.desc && (
                    <span className="font-body font-light text-[0.65rem] text-gold/35 mt-0.5 pl-[11px]">
                      {item.desc}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            <div className="shrink-0 hidden lg:flex flex-col justify-between w-[180px] p-5 border border-gold/12 bg-gold/5">
              <div>
                <p className="font-body font-light text-[0.55rem] tracking-[0.3em] uppercase text-gold/50 m-0 mb-2">
                  Featured
                </p>
                <p className="font-display font-normal text-base text-white/85 m-0 mb-4 leading-snug">
                  New Arrivals<br />This Season
                </p>
              </div>
              <Link
                to="/collections/new-arrivals"
                className="no-underline flex items-center gap-1.5 font-body font-medium text-[0.58rem] tracking-[0.2em] uppercase text-gold hover:brightness-110 transition-all duration-200"
              >
                Discover
                <svg width="14" height="6" viewBox="0 0 18 8" fill="none" className="text-current">
                  <path d="M0 4H16M13 1L16 4L13 7" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      ))}

      <div
        className={`fixed inset-0 z-40 flex flex-col bg-dark/98 transition-all duration-500 overflow-y-auto pt-[90px] pb-8 px-8 ${
          menuOpen
            ? "opacity-100 translate-x-0 pointer-events-auto"
            : "opacity-0 translate-x-full pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-2 mb-8 opacity-40">
          <img
            src={logoImg}
            alt="Novella"
            className="w-7 h-7 object-contain [filter:invert(1)_sepia(1)_saturate(1.5)_hue-rotate(5deg)_brightness(0.9)]"
          />
          <span className="font-display font-medium text-base text-white tracking-[0.25em] uppercase">
            Novella
          </span>
        </div>

        {navLinks.map((link) => (
          <div key={link.label} className="border-b border-gold/10">
            <div
              className="flex items-center justify-between py-4 cursor-pointer"
              onClick={() => link.mega && setMobileOpen(mobileOpen === link.label ? null : link.label)}
            >
              <Link
                to={link.to}
                className={`no-underline font-display font-light italic text-[2rem] tracking-[0.04em] transition-colors duration-200 ${
                  location.pathname === link.to ? "text-gold" : "text-white/85"
                }`}
              >
                {link.label}
              </Link>
              {link.mega && (
                <svg
                  width="10" height="6" viewBox="0 0 10 6" fill="none"
                  className={`text-gold/50 shrink-0 transition-transform duration-300 ${
                    mobileOpen === link.label ? "rotate-180" : ""
                  }`}
                >
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>

            {link.mega && mobileOpen === link.label && (
              <div className="pb-4 flex flex-col gap-3 pl-2">
                {link.mega.map(sub => (
                  <Link
                    key={sub.label}
                    to={sub.to}
                    className="no-underline font-body font-light text-[0.85rem] tracking-[0.06em] text-white/50 hover:text-gold transition-colors duration-200"
                  >
                    — {sub.label}
                    {sub.desc && (
                      <span className="block text-[0.62rem] text-gold/30 mt-px">
                        {sub.desc}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="flex gap-6 mt-8 flex-wrap">
          <Link to={user ? "/profile" : "/login"} className="no-underline font-body font-normal text-[0.65rem] tracking-[0.22em] uppercase text-white/50">
            {user ? "Profile" : "Account"}
          </Link>
          <Link to="/wishlist" className="no-underline font-body font-normal text-[0.65rem] tracking-[0.22em] uppercase text-white/50">
            Wishlist ({wishlist.length})
          </Link>
          <Link to="/cart" className="no-underline font-body font-normal text-[0.65rem] tracking-[0.22em] uppercase text-white/50">
            Cart ({cartCount})
          </Link>
        </div>
      </div>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Navbar;
