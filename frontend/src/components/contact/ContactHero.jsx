import { Link } from "react-router-dom";

export default function ContactHero() {
  return (
    <div className="bg-background border-b border-border">

      {/* ── Hero — light cream, minimal, approachable ── */}
      <div className="relative px-[clamp(2rem,8vw,6rem)] pt-32 pb-16 flex flex-col items-center text-center overflow-hidden">

        {/* Subtle background texture — faint pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, #B07D3A 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Decorative top line */}
        <div className="flex items-center gap-3 mb-7">
          <span className="block w-8 h-px bg-bronze" />
          <span className="font-body font-normal text-[0.55rem] tracking-[0.45em] uppercase text-bronze">
            Get In Touch
          </span>
          <span className="block w-8 h-px bg-bronze" />
        </div>

        {/* Heading */}
        <h1 className="font-display font-light text-[clamp(2.4rem,5.5vw,4.5rem)] text-ink m-0 leading-[1.08] tracking-[-0.01em] max-w-2xl">
          We'd love to{" "}
          <em className="text-bronze font-medium italic">
            hear from you
          </em>
        </h1>

        {/* Subtext */}
        <p className="font-body font-light text-[0.9rem] text-muted leading-[1.85] tracking-[0.03em] mt-5 mb-0 max-w-md mx-auto">
          Whether it's a question about an order, styling advice, or just a hello — our team is here and happy to help.
        </p>

        {/* Quick contact chips */}
        <div className="flex items-center gap-4 mt-7 flex-wrap justify-center">
          <a
            href="mailto:hello@novella.in"
            className="no-underline flex items-center gap-2 font-body font-normal text-[0.65rem] tracking-[0.12em] text-muted hover:text-bronze transition-colors duration-200"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ color: "#B07D3A" }}>
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            hello@novella.in
          </a>

          <span className="block w-px h-4 bg-border" />

          <a
            href="tel:+919999999999"
            className="no-underline flex items-center gap-2 font-body font-normal text-[0.65rem] tracking-[0.12em] text-muted hover:text-bronze transition-colors duration-200"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ color: "#B07D3A" }}>
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 .99h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
            </svg>
            +91 99999 99999
          </a>

          <span className="block w-px h-4 bg-border" />

          <span className="flex items-center gap-2 font-body font-normal text-[0.65rem] tracking-[0.12em] text-muted">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ color: "#B07D3A" }}>
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Mon–Sat, 10am–7pm IST
          </span>
      </div>
    </div>

    {/* ── Thin gold rule ── */}
    <div
        className="mx-[clamp(2rem,8vw,6rem)] h-px"
        style={{ background: "linear-gradient(to right, transparent, #B07D3A, transparent)" }}
      />
    </div>
  );
}