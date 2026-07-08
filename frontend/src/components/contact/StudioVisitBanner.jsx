import { useState } from "react";
import API from "../../services/api";

export default function StudioVisitBanner() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    timeSlot: "11:00 am - 12:30 pm",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setSuccess("");
    setError("");
    setFormData({
      name: "",
      email: "",
      date: "",
      timeSlot: "11:00 am - 12:30 pm",
      notes: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!formData.name || !formData.email || !formData.date) {
      setError("Please fill in your name, email, and preferred date.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        subject: "General Enquiry",
        message: `Studio Viewing Tour Request\nPreferred Date: ${formData.date}\nTime Slot: ${formData.timeSlot}\n\nClient notes:\n${formData.notes || "None"}`,
      };

      await API.post("/contact", payload);
      setSuccess("Your studio viewing tour request has been successfully submitted! Our team will contact you to confirm the appointment.");
      setFormData({ name: "", email: "", date: "", timeSlot: "11:00 am - 12:30 pm", notes: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit viewing request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="bg-surface py-20 px-[clamp(2rem,8vw,6rem)] border-b border-border">
        <div className="max-w-6xl mx-auto">

          {/* ── Header ── */}
          <div className="flex items-center gap-2.5 mb-10">
            <span className="block w-5 h-px bg-bronze" />
            <span className="font-body font-normal text-[0.55rem] tracking-[0.4em] uppercase text-bronze">
              Our Studio
            </span>
          </div>

          {/* ── Main split layout ── */}
          <div className="flex flex-col lg:flex-row gap-0 border border-border overflow-hidden rounded-2xl bg-background shadow-xs">

            {/* LEFT — image */}
            <div className="relative lg:w-[55%] flex-shrink-0" style={{ minHeight: "420px" }}>
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&q=85"
                alt="Novella Design Studio Mumbai"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: "brightness(0.78) saturate(0.85)" }}
              />

              {/* Warm overlay */}
              <div
                className="absolute inset-0"
                style={{ background: "rgba(40,18,2,0.2)", mixBlendMode: "multiply" }}
              />

              {/* Bottom gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-deep/60 via-transparent to-transparent" />

              {/* Gold corner brackets */}
              <div className="absolute top-5 left-5 opacity-50">
                <div className="w-6 h-px bg-gold" />
                <div className="w-px h-6 bg-gold" />
              </div>
              <div className="absolute top-5 right-5 opacity-50">
                <div className="w-6 h-px bg-gold ml-auto" />
                <div className="w-px h-6 bg-gold ml-auto" />
              </div>

              {/* Studio label — top center */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2">
                <span
                  className="font-body font-normal text-[0.5rem] tracking-[0.3em] uppercase text-gold px-3 py-1.5 border border-gold/25"
                  style={{ background: "rgba(13,10,6,0.55)", backdropFilter: "blur(6px)" }}
                >
                  Novella Design Studio
                </span>
              </div>

              {/* Address overlay — bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="font-body font-normal text-[0.52rem] tracking-[0.28em] uppercase text-gold/60 m-0 mb-1.5">
                  Find Us At
                </p>
                <p className="font-display font-medium text-[1.1rem] text-cream m-0 leading-tight">
                  Studio 4B, Linking Road,
                  <br />Bandra West, Mumbai — 400050
                </p>
              </div>
            </div>

            {/* RIGHT — info */}
            <div className="flex-1 bg-background flex flex-col justify-between p-8 lg:p-10">

              {/* Top */}
              <div>
                <h2 className="font-display font-light text-[clamp(1.8rem,3vw,2.6rem)] text-ink m-0 mb-3 leading-[1.1]">
                  Visit our{" "}
                  <em className="text-bronze font-medium italic">Mumbai Studio</em>
                </h2>
                <p className="font-body font-light text-[0.88rem] text-muted leading-[1.85] tracking-[0.03em] m-0 mb-8">
                  Come experience Novella in person. Our studio is a working design space — you'll see pieces being made, finished collections on display, and our team at work. Drop in or book a private viewing.
                </p>

                {/* Info rows */}
                <div className="flex flex-col gap-4 mb-8">
                  {[
                    {
                      icon: (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                      ),
                      label: "Studio Hours",
                      value: "Monday – Saturday · 10:00 am – 7:00 pm",
                    },
                    {
                      icon: (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      ),
                      label: "Address",
                      value: "Studio 4B, Linking Road, Bandra West, Mumbai — 400050",
                    },
                    {
                      icon: (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      ),
                      label: "Private Viewing",
                      value: "Book a slot in advance for a personal studio tour",
                    },
                  ].map((row, i) => (
                    <div key={i} className="flex items-start gap-3.5">
                      <div
                        className="w-8 h-8 flex items-center justify-center border border-border flex-shrink-0 mt-0.5"
                        style={{ color: "#B07D3A" }}
                      >
                        {row.icon}
                      </div>
                      <div>
                        <p className="font-body font-normal text-[0.58rem] tracking-[0.2em] uppercase text-muted m-0 mb-0.5">
                          {row.label}
                        </p>
                        <p className="font-body font-light text-[0.85rem] text-ink m-0 leading-snug">
                          {row.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom — CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="no-underline flex-1 flex items-center justify-center gap-2.5 font-body font-medium text-[0.62rem] tracking-[0.22em] uppercase text-background bg-bronze py-3.5 rounded-lg transition-all duration-300 hover:brightness-110"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  Get Directions
                </a>

                <button
                  onClick={handleOpenModal}
                  className="flex-1 flex items-center justify-center gap-2.5 font-body font-medium text-[0.62rem] tracking-[0.22em] uppercase text-bronze bg-transparent border border-bronze/40 py-3.5 rounded-lg cursor-pointer transition-all duration-300 hover:bg-bronze/5 hover:border-bronze"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Book a Viewing
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal Dialog overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-ink/35 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-background border border-border w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-fadeIn relative">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-border flex items-center justify-between">
              <h3 className="font-display font-medium text-[1.12rem] text-ink m-0">
                Book a Studio Viewing
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full border border-border bg-background flex items-center justify-center text-muted hover:text-ink hover:border-bronze transition-colors duration-200 cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 font-body">
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.6rem] uppercase tracking-widest text-muted">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="px-3.5 py-2.5 bg-surface border border-border rounded-lg text-ink text-sm focus:outline-none focus:border-bronze"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[0.6rem] uppercase tracking-widest text-muted">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="px-3.5 py-2.5 bg-surface border border-border rounded-lg text-ink text-sm focus:outline-none focus:border-bronze"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.6rem] uppercase tracking-widest text-muted">Select Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="px-3.5 py-2.5 bg-surface border border-border rounded-lg text-ink text-sm focus:outline-none focus:border-bronze"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.6rem] uppercase tracking-widest text-muted">Select Time Slot</label>
                  <select
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                    className="px-3.5 py-2.5 bg-surface border border-border rounded-lg text-ink text-sm focus:outline-none focus:border-bronze"
                  >
                    <option value="11:00 am - 12:30 pm">11:00 am - 12:30 pm</option>
                    <option value="2:00 pm - 3:30 pm">2:00 pm - 3:30 pm</option>
                    <option value="4:00 pm - 5:30 pm">4:00 pm - 5:30 pm</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[0.6rem] uppercase tracking-widest text-muted">Special Requests / Notes</label>
                <textarea
                  rows="3"
                  placeholder="Let us know if you're looking for a specific collection..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="px-3.5 py-2.5 bg-surface border border-border rounded-lg text-ink text-sm focus:outline-none focus:border-bronze resize-none"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-lg leading-relaxed">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-ink text-background hover:bg-bronze hover:text-white transition-all duration-200 rounded-lg text-xs font-body font-medium tracking-widest uppercase disabled:opacity-50 cursor-pointer border-0"
              >
                {loading ? "Scheduling Visit..." : "Request Viewing Slot"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}