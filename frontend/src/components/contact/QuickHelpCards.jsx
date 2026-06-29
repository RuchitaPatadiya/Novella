import { Link } from "react-router-dom";

const helpCards = [
  {
    id: 1,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    title: "Track Your Order",
    desc: "Enter your order ID to get real-time updates on your delivery.",
    cta: "Track Now",
    to: "/track-order",
  },
  {
    id: 2,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9,22 9,12 15,12 15,22" />
      </svg>
    ),
    title: "Styling Advice",
    desc: "Not sure what works for your space? Our designers are happy to help.",
    cta: "Book a Consultation",
    to: "/styling",
  },
  {
    id: 3,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="17 1 21 5 17 9" />
        <path d="M3 11V9a4 4 0 014-4h14" />
        <polyline points="7 23 3 19 7 15" />
        <path d="M21 13v2a4 4 0 01-4 4H3" />
      </svg>
    ),
    title: "Returns & Exchanges",
    desc: "Changed your mind? We offer hassle-free 30-day returns on all orders.",
    cta: "View Policy",
    to: "/returns",
  },
  {
    id: 4,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    title: "General Enquiry",
    desc: "Have a question that doesn't fit the above? Just scroll down and write to us.",
    cta: "Send a Message",
    to: "#contact-form",
  },
];

export default function QuickHelpCards() {
  return (
    <section className="bg-surface py-16 px-[clamp(2rem,8vw,6rem)] border-b border-border">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <span className="block w-5 h-px bg-bronze" />
          <span className="font-body font-normal text-[0.55rem] tracking-[0.4em] uppercase text-bronze">
            How Can We Help?
          </span>
        </div>

        {/* 4 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {helpCards.map((card) => (
            <Link
              key={card.id}
              to={card.to}
              className="no-underline group flex flex-col gap-4 p-6 bg-background border border-border hover:border-bronze/40 transition-all duration-300"
              style={{ borderRadius: "4px" }}
            >
              {/* Icon */}
              <div
                className="w-11 h-11 flex items-center justify-center border border-border group-hover:border-bronze/40 transition-all duration-300 flex-shrink-0"
                style={{ color: "#B07D3A" }}
              >
                {card.icon}
              </div>

              {/* Gold line — grows on hover */}
              <div
                className="h-px bg-bronze/30 transition-all duration-500"
                style={{ width: "20px" }}
                ref={el => {
                  if (el) {
                    el.closest("a").addEventListener("mouseenter", () => el.style.width = "36px");
                    el.closest("a").addEventListener("mouseleave", () => el.style.width = "20px");
                  }
                }}
              />

              {/* Title */}
              <h3 className="font-display font-medium text-[1.05rem] text-ink m-0 leading-tight group-hover:text-bronze transition-colors duration-200">
                {card.title}
              </h3>

              {/* Description */}
              <p className="font-body font-light text-[0.82rem] text-muted leading-[1.8] m-0 flex-1">
                {card.desc}
              </p>

              {/* CTA */}
              <div className="flex items-center gap-2 mt-1">
                <span className="font-body font-medium text-[0.6rem] tracking-[0.18em] uppercase text-bronze group-hover:text-ink transition-colors duration-200">
                  {card.cta}
                </span>
                <svg
                  width="13" height="6" viewBox="0 0 18 8" fill="none"
                  className="text-bronze transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path d="M0 4H16M13 1L16 4L13 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Response time note */}
        <div className="flex items-center gap-3 mt-8">
          <div className="w-2 h-2 rounded-full bg-green-500/70 flex-shrink-0" />
          <p className="font-body font-light text-[0.72rem] text-muted m-0 tracking-[0.04em]">
            Our team is online · We typically respond within{" "}
            <span className="text-ink font-normal">24 hours</span>
          </p>
        </div>
      </div>
    </section>
  );
}