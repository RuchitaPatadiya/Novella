import { Link } from "react-router-dom";
import logoImg from "../../assets/logo1.png";

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
    <footer className="bg-surface border-t border-border">

      <div className="h-[3px] bg-gradient-to-r from-gold via-cream-muted to-transparent" />

      <div className="px-8 md:px-16 lg:px-24 pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 max-w-7xl mx-auto">

          <div className="lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2.5 no-underline group mb-5">
              <img
                src={logoImg}
                alt="Novella"
                className="w-8 h-8 object-contain [filter:sepia(1)_saturate(2)_hue-rotate(5deg)_brightness(0.75)]"
              />
              <div className="flex flex-col leading-none">
                <span className="font-display font-semibold text-base text-ink tracking-[0.25em] uppercase transition-colors duration-300 group-hover:text-bronze">
                  Novella
                </span>
                <span className="font-body font-light text-[0.4rem] text-cream-muted tracking-[0.35em] uppercase mt-[2px]">
                  Home &amp; Décor
                </span>
              </div>
            </Link>

            <p className="font-body font-light text-[0.83rem] text-muted leading-[1.85] max-w-[220px] mb-6 mt-4">
              Curated home pieces that transform spaces into expressions of who you are.
            </p>

            <div className="flex gap-3">
              {socials.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="no-underline flex items-center justify-center w-8 h-8 border border-border bg-transparent transition-all duration-200 hover:bg-gold hover:border-gold group"
                >
                  <span className="font-body font-medium text-[0.5rem] tracking-[0.05em] text-muted group-hover:text-cream transition-colors duration-200">
                    {label.slice(0, 2).toUpperCase()}
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-body font-medium text-[0.62rem] tracking-[0.25em] uppercase text-ink mb-5 mt-0">
              Shop
            </h4>
            <div className="mb-5 h-px w-6 bg-gold" />
            <ul className="list-none p-0 m-0 flex flex-col gap-3">
              {shopLinks.map((item) => (
                <li key={item}>
                  <Link
                    to="/shop"
                    className="no-underline font-body font-light text-[0.83rem] text-muted hover:text-gold transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="block w-0 group-hover:w-3 h-px bg-gold transition-all duration-200" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-body font-medium text-[0.62rem] tracking-[0.25em] uppercase text-ink mb-5 mt-0">
              Help
            </h4>
            <div className="mb-5 h-px w-6 bg-gold" />
            <ul className="list-none p-0 m-0 flex flex-col gap-3">
              {helpLinks.map((item) => (
                <li key={item}>
                  <Link
                    to="/contact"
                    className="no-underline font-body font-light text-[0.83rem] text-muted hover:text-gold transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="block w-0 group-hover:w-3 h-px bg-gold transition-all duration-200" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-body font-medium text-[0.62rem] tracking-[0.25em] uppercase text-ink mb-5 mt-0">
              Stay Inspired
            </h4>
            <div className="mb-5 h-px w-6 bg-gold" />
            <p className="font-body font-light text-[0.82rem] text-muted leading-[1.8] mb-5">
              New arrivals, styling ideas &amp; exclusive offers — straight to your inbox.
            </p>

            <div className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 outline-none font-body font-light text-[0.78rem] py-[0.7rem] px-[0.9rem] bg-background border border-border border-r-0 text-ink focus:border-gold transition-colors duration-200"
              />
              <button
                className="font-body font-medium text-[0.6rem] tracking-[0.2em] uppercase py-[0.7rem] px-[1.1rem] bg-ink text-cream-muted border-0 cursor-pointer whitespace-nowrap transition-all duration-200 hover:bg-gold hover:text-cream"
              >
                Join
              </button>
            </div>

            <p className="font-body font-light text-[0.62rem] text-muted/70 mt-3">
              No spam, ever. Unsubscribe any time.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-8 md:mx-16 lg:mx-24 h-px bg-border" />

      <div className="px-8 md:px-16 lg:px-24 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 max-w-7xl mx-auto">
        <p className="font-body font-light text-[0.68rem] tracking-[0.08em] text-muted m-0">
          © {year} Novella Home &amp; Décor. All rights reserved.
        </p>

        <div className="flex items-center gap-1 text-muted">
          <span className="font-body font-light text-[0.62rem]">Crafted with</span>
          <svg width="10" height="10" viewBox="0 0 24 24" className="text-gold mx-0.5" fill="currentColor" stroke="currentColor" strokeWidth="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span className="font-body font-light text-[0.62rem]">for beautiful homes</span>
        </div>

        <div className="flex gap-5">
          {["Privacy Policy", "Terms of Service"].map((t) => (
            <Link
              key={t}
              to="#"
              className="no-underline font-body font-light text-[0.65rem] tracking-[0.06em] text-muted hover:text-gold transition-colors duration-200"
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
