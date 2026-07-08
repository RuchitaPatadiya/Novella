import { useState } from "react";
import API from "../../services/api";

const subjects = [
  "Order Query",
  "Styling Advice",
  "Returns & Exchanges",
  "Custom Order",
  "Press & Media",
  "General Enquiry",
];

const contactInfo = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    label: "Email Us",
    value: "hello@novella.in",
    href: "mailto:hello@novella.in",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 .99h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
      </svg>
    ),
    label: "Call Us",
    value: "+91 99999 99999",
    href: "tel:+919999999999",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    label: "Visit Us",
    value: "Studio 4B, Bandra West, Mumbai — 400050",
    href: "https://maps.google.com",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    label: "Working Hours",
    value: "Monday – Saturday, 10am – 7pm IST",
    href: null,
  },
];

const InputField = ({ label, type = "text", placeholder, required, value, onChange }) => (
  <div className="flex flex-col gap-2">
    <label className="font-body font-normal text-[0.6rem] tracking-[0.22em] uppercase text-muted">
      {label} {required && <span className="text-bronze">*</span>}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full bg-background border border-border px-4 py-3 font-body font-light text-[0.85rem] text-ink placeholder:text-muted/40 outline-none transition-all duration-200 focus:border-bronze"
    />
  </div>
);

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "", email: "", subject: "", message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await API.post("/contact", {
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
      });
      setSubmitted(true);
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contact-form"
      className="bg-background py-20 px-[clamp(2rem,8vw,6rem)] border-b border-border"
    >
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16">

        {/* ── LEFT — Contact Form ── */}
        <div className="flex-1">
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="block w-5 h-px bg-bronze" />
              <span className="font-body font-normal text-[0.55rem] tracking-[0.4em] uppercase text-bronze">
                Write To Us
              </span>
            </div>
            <h2 className="font-display font-light text-[clamp(1.8rem,3.5vw,2.8rem)] text-ink m-0 leading-[1.1]">
              Send us a{" "}
              <em className="text-bronze font-medium italic">message</em>
            </h2>
          </div>

          {/* Success message */}
           {submitted && (
            <div className="flex items-center gap-3 p-4 mb-6 border border-bronze/30 bg-bronze/5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B07D3A" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <p className="font-body font-normal text-[0.82rem] text-bronze m-0">
                Message sent! We'll get back to you within 24 hours.
              </p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-3 p-4 mb-6 border border-red-300/40 bg-red-50">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              <p className="font-body font-normal text-[0.82rem] text-red-600 m-0">
                {error}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Name + Email row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InputField
                label="Full Name"
                placeholder="Your name"
                required
                value={form.name}
                onChange={handleChange("name")}
              />
              <InputField
                label="Email Address"
                type="email"
                placeholder="your@email.com"
                required
                value={form.email}
                onChange={handleChange("email")}
              />
            </div>

            {/* Subject dropdown */}
            <div className="flex flex-col gap-2">
              <label className="font-body font-normal text-[0.6rem] tracking-[0.22em] uppercase text-muted">
                Subject <span className="text-bronze">*</span>
              </label>
              <div className="relative">
                <select
                  value={form.subject}
                  onChange={handleChange("subject")}
                  required
                  className="w-full bg-background border border-border px-4 py-3 font-body font-light text-[0.85rem] text-ink outline-none appearance-none cursor-pointer transition-all duration-200 focus:border-bronze"
                  style={{ color: form.subject ? "#2c2416" : "#8a7d6b" }}
                >
                  <option value="" disabled>Select a subject</option>
                  {subjects.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <svg
                  className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-bronze"
                  width="10" height="6" viewBox="0 0 10 6" fill="none"
                >
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Message */}
            <div className="flex flex-col gap-2">
              <label className="font-body font-normal text-[0.6rem] tracking-[0.22em] uppercase text-muted">
                Message <span className="text-bronze">*</span>
              </label>
              <textarea
                placeholder="Tell us how we can help..."
                value={form.message}
                onChange={handleChange("message")}
                required
                maxLength={500}
                rows={6}
                className="w-full bg-background border border-border px-4 py-3 font-body font-light text-[0.85rem] text-ink placeholder:text-muted/40 outline-none resize-none transition-all duration-200 focus:border-bronze"
              />
              <p className="font-body font-light text-[0.62rem] text-muted/50 m-0 text-right">
                {form.message.length} / 500
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className={`self-start inline-flex items-center gap-3 font-body font-medium text-[0.63rem] tracking-[0.28em] uppercase text-dark-deep bg-bronze px-10 py-4 border-none cursor-pointer transition-all duration-300 hover:bg-gold mt-2 ${submitting ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-dark-deep border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send Message
                  <svg width="16" height="7" viewBox="0 0 18 8" fill="none">
                    <path d="M0 4H16M13 1L16 4L13 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>

            <p className="font-body font-light text-[0.65rem] text-muted/45 m-0 tracking-[0.03em]">
              By submitting this form you agree to our{" "}
              <a href="/privacy" className="text-bronze no-underline hover:underline">Privacy Policy</a>.
            </p>
          </form>
        </div>

        {/* ── RIGHT — Contact Info ── */}
        <div className="lg:w-[38%] flex-shrink-0 flex flex-col gap-0">

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="block w-5 h-px bg-bronze" />
              <span className="font-body font-normal text-[0.55rem] tracking-[0.4em] uppercase text-bronze">
                Contact Details
              </span>
            </div>
            <h2 className="font-display font-light text-[clamp(1.8rem,3.5vw,2.8rem)] text-ink m-0 leading-[1.1]">
              Find us{" "}
              <em className="text-bronze font-medium italic">here</em>
            </h2>
          </div>

          {/* Info items */}
          <div className="flex flex-col divide-y divide-border">
            {contactInfo.map((info, i) => (
              <div key={i} className="group flex items-start gap-4 py-5">
                {/* Icon box */}
                <div
                  className="w-10 h-10 flex items-center justify-center border border-border flex-shrink-0 transition-all duration-200 group-hover:border-bronze/40"
                  style={{ color: "#B07D3A" }}
                >
                  {info.icon}
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className="font-body font-normal text-[0.58rem] tracking-[0.22em] uppercase text-muted">
                    {info.label}
                  </span>
                  {info.href ? (
                    <a
                      href={info.href}
                      target={info.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="no-underline font-body font-light text-[0.88rem] text-ink hover:text-bronze transition-colors duration-200 leading-snug"
                    >
                      {info.value}
                    </a>
                  ) : (
                    <span className="font-body font-light text-[0.88rem] text-ink leading-snug">
                      {info.value}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Social links */}
          <div className="mt-8 pt-8 border-t border-border">
            <p className="font-body font-normal text-[0.58rem] tracking-[0.3em] uppercase text-muted mb-4">
              Follow Us
            </p>
            <div className="flex gap-3">
              {["Instagram", "Pinterest", "Facebook"].map((s) => (
                <a
                  key={s}
                  href="#"
                  aria-label={s}
                  className="no-underline w-10 h-10 flex items-center justify-center border border-border hover:border-bronze/40 hover:bg-bronze/5 transition-all duration-200"
                  style={{ borderRadius: "2px" }}
                >
                  <span className="font-body font-medium text-[0.5rem] tracking-[0.05em] text-muted hover:text-bronze transition-colors duration-200">
                    {s.slice(0, 2).toUpperCase()}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Response time card */}
          <div
            className="mt-8 p-5 border border-border"
            style={{ background: "#F5F0E8" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500/70" />
              <span className="font-body font-normal text-[0.58rem] tracking-[0.2em] uppercase text-muted">
                We're Online
              </span>
            </div>
            <p className="font-display font-light text-[1rem] text-ink m-0 mb-1 leading-snug">
              Typically reply within{" "}
              <em className="text-bronze font-medium italic">24 hours</em>
            </p>
            <p className="font-body font-light text-[0.75rem] text-muted m-0">
              For urgent queries, call us directly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}