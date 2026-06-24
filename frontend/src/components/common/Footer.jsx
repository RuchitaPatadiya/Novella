import { Link } from "react-router-dom";
import logoImg from "../../assets/logo1.png";

// ── Design tokens (same as rest of site) ──
const CREAM   = "#f1e9dc";
const GOLD    = "#c49a47";
const GOLD_LT = "#eee5d9";
const INK     = "#352916";
const MUTED   = "#7f6a56";
const BORDER  = "#E8E0D5";

const shopLinks = ["Living Room", "Bedroom", "Kitchen", "Lighting", "Decor"];
const helpLinks = ["FAQ", "Shipping & Returns", "Track Order", "Contact Us"];
const socials   = [
  { label: "Instagram", href: "#" },
  { label: "Pinterest", href: "#" },
  { label: "Facebook",  href: "#" },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: CREAM, borderTop: `1px solid ${BORDER}` }}>

      {/* ── Top accent bar ── */}
      <div style={{ height: "3px", background: `linear-gradient(to right, ${GOLD}, ${GOLD_LT}, transparent)` }} />

      {/* ── Main footer body ── */}
      <div
        className="px-8 md:px-16 lg:px-24 pt-16 pb-10"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 max-w-7xl mx-auto">

          {/* ── Brand column ── */}
          <div className="lg:col-span-1">
            {/* Logo + wordmark */}
            <Link to="/" className="inline-flex items-center gap-2.5 no-underline group mb-5 block">
              <img
                src={logoImg}
                alt="Novella"
                className="w-8 h-8 object-contain"
                style={{ filter: "sepia(1) saturate(2) hue-rotate(5deg) brightness(0.75)" }}
              />
              <div className="flex flex-col leading-none">
                <span
                  className="tracking-[0.25em] uppercase transition-colors duration-300 group-hover:text-[#B8934A]"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: "1rem", color: INK }}
                >
                  Novella
                </span>
                <span
                  className="tracking-[0.35em] uppercase mt-[2px]"
                  style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: "0.4rem", color: GOLD_LT }}
                >
                  Home &amp; Décor
                </span>
              </div>
            </Link>

            <p
              className="leading-relaxed max-w-[220px] mb-6 mt-4"
              style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: "0.83rem", color: MUTED, lineHeight: "1.85" }}
            >
              Curated home pieces that transform spaces into expressions of who you are.
            </p>

            {/* Socials */}
            <div className="flex gap-3">
              {socials.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="no-underline flex items-center justify-center w-8 h-8 transition-all duration-200"
                  style={{ border: `1px solid ${BORDER}`, background: "transparent" }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = GOLD;
                    e.currentTarget.style.borderColor = GOLD;
                    e.currentTarget.querySelector("span").style.color = CREAM;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderColor = BORDER;
                    e.currentTarget.querySelector("span").style.color = MUTED;
                  }}
                >
                  <span style={{ fontFamily: "'Jost', sans-serif", fontWeight: 500, fontSize: "0.5rem", letterSpacing: "0.05em", color: MUTED, transition: "color 0.2s" }}>
                    {label.slice(0, 2).toUpperCase()}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* ── Shop column ── */}
          <div>
            <h4
              className="mb-5 mt-0"
              style={{ fontFamily: "'Jost', sans-serif", fontWeight: 500, fontSize: "0.62rem", letterSpacing: "0.25em", textTransform: "uppercase", color: INK }}
            >
              Shop
            </h4>
            {/* Gold underline accent */}
            <div className="mb-5 h-px w-6" style={{ background: GOLD }} />
            <ul className="list-none p-0 m-0 flex flex-col gap-3">
              {shopLinks.map((item) => (
                <li key={item}>
                  <Link
                    to="/shop"
                    className="no-underline transition-colors duration-200 flex items-center gap-2 group"
                    style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: "0.83rem", color: MUTED }}
                    onMouseEnter={e => e.currentTarget.style.color = GOLD}
                    onMouseLeave={e => e.currentTarget.style.color = MUTED}
                  >
                    <span className="block w-0 group-hover:w-3 h-px transition-all duration-200" style={{ background: GOLD }} />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Help column ── */}
          <div>
            <h4
              className="mb-5 mt-0"
              style={{ fontFamily: "'Jost', sans-serif", fontWeight: 500, fontSize: "0.62rem", letterSpacing: "0.25em", textTransform: "uppercase", color: INK }}
            >
              Help
            </h4>
            <div className="mb-5 h-px w-6" style={{ background: GOLD }} />
            <ul className="list-none p-0 m-0 flex flex-col gap-3">
              {helpLinks.map((item) => (
                <li key={item}>
                  <Link
                    to="/contact"
                    className="no-underline transition-colors duration-200 flex items-center gap-2 group"
                    style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: "0.83rem", color: MUTED }}
                    onMouseEnter={e => e.currentTarget.style.color = GOLD}
                    onMouseLeave={e => e.currentTarget.style.color = MUTED}
                  >
                    <span className="block w-0 group-hover:w-3 h-px transition-all duration-200" style={{ background: GOLD }} />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Newsletter column ── */}
          <div>
            <h4
              className="mb-5 mt-0"
              style={{ fontFamily: "'Jost', sans-serif', fontWeight: 500, fontSize: '0.62rem", letterSpacing: "0.25em", textTransform: "uppercase", color: INK }}
            >
              Stay Inspired
            </h4>
            <div className="mb-5 h-px w-6" style={{ background: GOLD }} />
            <p
              className="mb-5 leading-relaxed"
              style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: "0.82rem", color: MUTED, lineHeight: "1.8" }}
            >
              New arrivals, styling ideas &amp; exclusive offers — straight to your inbox.
            </p>

            {/* Email input */}
            <div className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 outline-none transition-colors duration-200"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontWeight: 300,
                  fontSize: "0.78rem",
                  padding: "0.7rem 0.9rem",
                  background: "#F5EFE7",
                  border: `1px solid ${BORDER}`,
                  borderRight: "none",
                  color: INK,
                }}
                onFocus={e => e.target.style.borderColor = GOLD_LT}
                onBlur={e => e.target.style.borderColor = BORDER}
              />
              <button
                className="transition-all duration-200 border-0 cursor-pointer"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontWeight: 500,
                  fontSize: "0.6rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  padding: "0.7rem 1.1rem",
                  background: INK,
                  color: GOLD_LT,
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = GOLD; e.currentTarget.style.color = CREAM; }}
                onMouseLeave={e => { e.currentTarget.style.background = INK; e.currentTarget.style.color = GOLD_LT; }}
              >
                Join
              </button>
            </div>

            {/* Trust note */}
            <p style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: "0.62rem", color: MUTED, marginTop: "0.75rem", opacity: 0.7 }}>
              No spam, ever. Unsubscribe any time.
            </p>
          </div>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="mx-8 md:mx-16 lg:mx-24" style={{ height: "1px", background: BORDER }} />

      {/* ── Bottom bar ── */}
      <div
        className="px-8 md:px-16 lg:px-24 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 max-w-7xl mx-auto"
      >
        <p style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: "0.68rem", letterSpacing: "0.08em", color: MUTED, margin: 0 }}>
          © {year} Novella Home &amp; Décor. All rights reserved.
        </p>

        <div className="flex items-center gap-1" style={{ color: MUTED }}>
          <span style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: "0.62rem" }}>Crafted with</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill={GOLD} stroke={GOLD} strokeWidth="1.5" style={{ margin: "0 2px" }}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: "0.62rem" }}>for beautiful homes</span>
        </div>

        <div className="flex gap-5">
          {["Privacy Policy", "Terms of Service"].map((t) => (
            <Link
              key={t}
              to="#"
              className="no-underline transition-colors duration-200"
              style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: "0.65rem", letterSpacing: "0.06em", color: MUTED }}
              onMouseEnter={e => e.currentTarget.style.color = GOLD}
              onMouseLeave={e => e.currentTarget.style.color = MUTED}
            >
              {t}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;