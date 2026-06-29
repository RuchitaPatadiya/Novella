import { useState } from "react";

const faqs = [
  {
    id: 1,
    question: "How long does delivery take?",
    answer:
      "Standard delivery takes 5–7 business days across India. For metro cities like Mumbai, Delhi, and Bangalore, we typically deliver within 3–5 business days. You'll receive a tracking link as soon as your order is dispatched.",
  },
  {
    id: 2,
    question: "What is your return policy?",
    answer:
      "We offer hassle-free 30-day returns on all orders. If you're not completely satisfied with your purchase, simply contact us within 30 days of delivery and we'll arrange a pickup and full refund — no questions asked.",
  },
  {
    id: 3,
    question: "Do you accept custom orders?",
    answer:
      "Yes! Our design team loves working on custom pieces. Whether it's a specific size, finish, or a completely bespoke design, reach out to us at hello@novella.in with your requirements and we'll get back to you within 48 hours with a quote.",
  },
  {
    id: 4,
    question: "Can I get styling advice for my space?",
    answer:
      "Absolutely. We offer complimentary styling consultations for orders above ₹25,000. For all other enquiries, our designers are available for a paid 45-minute virtual consultation. Book via the 'Styling Advice' card above or email us directly.",
  },
  {
    id: 5,
    question: "Are all pieces designed by Novella?",
    answer:
      "Yes — every single piece in the Novella collection is conceived and designed entirely by our in-house team at our Mumbai studio. We don't resell or white-label other brands. What you see is original Novella design, crafted to our specifications.",
  },
  {
    id: 6,
    question: "Do you ship internationally?",
    answer:
      "Currently we ship across India only. We're working on international shipping and hope to launch it soon. Sign up for our newsletter to be the first to know when we expand.",
  },
];

const FAQItem = ({ faq, isOpen, onToggle }) => (
  <div
    className="border-b border-border last:border-b-0"
  >
    <button
      onClick={onToggle}
      className="w-full flex items-start justify-between gap-4 py-5 text-left bg-transparent border-none cursor-pointer group"
    >
      {/* Question */}
      <span
        className="font-display font-medium text-[1rem] leading-snug transition-colors duration-200 group-hover:text-bronze"
        style={{ color: isOpen ? "#B07D3A" : "#2C2416" }}
      >
        {faq.question}
      </span>

      {/* Toggle icon */}
      <div
        className="w-7 h-7 flex items-center justify-center border flex-shrink-0 mt-0.5 transition-all duration-300"
        style={{
          borderColor: isOpen ? "#B07D3A" : "#E8E0D5",
          background: isOpen ? "#B07D3A" : "transparent",
          color: isOpen ? "#FDFAF6" : "#B07D3A",
          borderRadius: "2px",
        }}
      >
        <svg
          width="10" height="10" viewBox="0 0 12 12" fill="none"
          style={{
            transition: "transform 0.3s ease",
            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          <line x1="6" y1="0" x2="6" y2="12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="0" y1="6" x2="12" y2="6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </div>
    </button>

    {/* Answer — animates open/close */}
    <div
      style={{
        maxHeight: isOpen ? "300px" : "0px",
        overflow: "hidden",
        transition: "max-height 0.4s cubic-bezier(0.25,0.46,0.45,0.94)",
      }}
    >
      <p className="font-body font-light text-[0.88rem] text-muted leading-[1.85] tracking-[0.03em] pb-5 m-0 pr-10">
        {faq.answer}
      </p>
    </div>
  </div>
);

export default function FAQStrip() {
  const [openId, setOpenId] = useState(1);

  const toggle = (id) => setOpenId(openId === id ? null : id);

  return (
    <section className="bg-background py-20 px-[clamp(2rem,8vw,6rem)]">
      <div className="max-w-6xl mx-auto">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="block w-5 h-px bg-bronze" />
              <span className="font-body font-normal text-[0.55rem] tracking-[0.4em] uppercase text-bronze">
                Common Questions
              </span>
            </div>
            <h2 className="font-display font-light text-[clamp(2rem,4vw,3.2rem)] text-ink m-0 leading-[1.1]">
              Frequently Asked{" "}
              <em className="text-bronze font-medium italic">Questions</em>
            </h2>
          </div>

          <p className="font-body font-light text-[0.85rem] text-muted max-w-xs leading-relaxed hidden md:block tracking-[0.03em]">
            Can't find your answer? Write to us using the form above.
          </p>
        </div>

        {/* Gold rule */}
        <div
          className="h-px mb-10"
          style={{ background: "linear-gradient(to right, #B07D3A, transparent)" }}
        />

        {/* ── Two column FAQ layout ── */}
        <div className="flex flex-col lg:flex-row gap-12">

          {/* Left column — first 3 FAQs */}
          <div className="flex-1">
            {faqs.slice(0, 3).map((faq) => (
              <FAQItem
                key={faq.id}
                faq={faq}
                isOpen={openId === faq.id}
                onToggle={() => toggle(faq.id)}
              />
            ))}
          </div>

          {/* Divider — vertical on desktop */}
          <div className="hidden lg:block w-px bg-border flex-shrink-0" />

          {/* Right column — last 3 FAQs */}
          <div className="flex-1">
            {faqs.slice(3).map((faq) => (
              <FAQItem
                key={faq.id}
                faq={faq}
                isOpen={openId === faq.id}
                onToggle={() => toggle(faq.id)}
              />
            ))}
          </div>
        </div>

        {/* ── Bottom CTA ── */}
        <div
          className="mt-14 flex flex-col md:flex-row items-center justify-between gap-5 px-8 py-6 border border-border"
          style={{ background: "#F5F0E8" }}
        >
          <div>
            <p className="font-display font-medium text-[1rem] text-ink m-0 mb-1 leading-snug">
              Still have a question?
            </p>
            <p className="font-body font-light text-[0.82rem] text-muted m-0">
              Our team typically responds within 24 hours.
            </p>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <a
              href="mailto:hello@novella.in"
              className="no-underline flex items-center gap-2 font-body font-medium text-[0.62rem] tracking-[0.22em] uppercase text-bronze border-b border-bronze/40 pb-0.5 hover:text-ink hover:border-ink transition-colors duration-200"
            >
              Email Us
              <svg width="14" height="6" viewBox="0 0 18 8" fill="none" style={{ color: "#B07D3A" }}>
                <path d="M0 4H16M13 1L16 4L13 7" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>

            <span className="block w-px h-4 bg-border" />

            <a
              href="tel:+919999999999"
              className="no-underline flex items-center gap-2 font-body font-medium text-[0.62rem] tracking-[0.22em] uppercase text-bronze border-b border-bronze/40 pb-0.5 hover:text-ink hover:border-ink transition-colors duration-200"
            >
              Call Us
              <svg width="14" height="6" viewBox="0 0 18 8" fill="none" style={{ color: "#B07D3A" }}>
                <path d="M0 4H16M13 1L16 4L13 7" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}