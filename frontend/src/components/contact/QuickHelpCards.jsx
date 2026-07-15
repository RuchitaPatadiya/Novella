import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";

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
    to: "track",
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
    to: "styling",
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
    to: "returns",
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
  const [activeModal, setActiveModal] = useState(null); // 'track', 'styling', 'returns', null

  // 1. Order Tracking States
  const [trackOrderId, setTrackOrderId] = useState("");
  const [trackResult, setTrackResult] = useState(null);
  const [trackError, setTrackError] = useState("");
  const [trackLoading, setTrackLoading] = useState(false);

  // 2. Styling Consultation States
  const [stylingForm, setStylingForm] = useState({
    name: "",
    email: "",
    space: "Living Room",
    style: "Modern Minimalist",
    message: "",
  });
  const [stylingSuccess, setStylingSuccess] = useState("");
  const [stylingError, setStylingError] = useState("");
  const [stylingLoading, setStylingLoading] = useState(false);

  // 3. Return Requests States
  const [returnOrderId, setReturnOrderId] = useState("");
  const [returnReason, setReturnReason] = useState("Changed Mind");
  const [returnSuccess, setReturnSuccess] = useState("");
  const [returnError, setReturnError] = useState("");
  const [returnLoading, setReturnLoading] = useState(false);

  const handleCardClick = (e, card) => {
    e.preventDefault();
    if (card.to.startsWith("#")) {
      const el = document.getElementById(card.to.substring(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      setActiveModal(card.to);
      // Reset states on open
      setTrackOrderId("");
      setTrackResult(null);
      setTrackError("");
      setStylingSuccess("");
      setStylingError("");
      setReturnOrderId("");
      setReturnSuccess("");
      setReturnError("");
    }
  };

  const handleTrackSubmit = async (e) => {
    e.preventDefault();
    setTrackError("");
    setTrackResult(null);
    setTrackLoading(true);

    if (!trackOrderId.trim()) {
      setTrackError("Please enter a valid Order ID.");
      setTrackLoading(false);
      return;
    }

    try {
      const res = await API.get(`/orders/track/${trackOrderId.trim()}`);
      setTrackResult(res.data);
    } catch (err) {
      setTrackError(err.response?.data?.message || "Order not found. Please log in and verify your Reference Order ID.");
    } finally {
      setTrackLoading(false);
    }
  };

  const handleStylingSubmit = async (e) => {
    e.preventDefault();
    setStylingError("");
    setStylingSuccess("");
    setStylingLoading(true);

    if (!stylingForm.name || !stylingForm.email || !stylingForm.message) {
      setStylingError("Please fill out all fields.");
      setStylingLoading(false);
      return;
    }

    try {
      const payload = {
        name: stylingForm.name,
        email: stylingForm.email,
        subject: "Styling Advice",
        message: `Preferred Space: ${stylingForm.space}\nCurated Style: ${stylingForm.style}\n\nClient Details Request:\n${stylingForm.message}`,
      };
      await API.post("/contact", payload);
      setStylingSuccess("Consultation booked! Our lead interior designers will review your preference and contact you shortly.");
      setStylingForm({ name: "", email: "", space: "Living Room", style: "Modern Minimalist", message: "" });
    } catch (err) {
      setStylingError(err.response?.data?.message || "Failed to submit request.");
    } finally {
      setStylingLoading(false);
    }
  };

  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    setReturnError("");
    setReturnSuccess("");
    setReturnLoading(true);

    if (!returnOrderId.trim()) {
      setReturnError("Please enter your Order Reference ID.");
      setReturnLoading(false);
      return;
    }

    try {
      const res = await API.put(`/orders/${returnOrderId.trim()}/return`);
      setReturnSuccess(`Return request submitted! Order ${res.data.orderId} status updated to: Return Requested.`);
      setReturnOrderId("");
    } catch (err) {
      setReturnError(err.response?.data?.message || "Failed to submit return request. Ensure the order is Delivered and within the 30-day return policy window.");
    } finally {
      setReturnLoading(false);
    }
  };

  return (
    <>
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
              <a
                key={card.id}
                href={card.to}
                onClick={(e) => handleCardClick(e, card)}
                className="no-underline group flex flex-col gap-4 p-6 bg-background border border-border hover:border-bronze/40 transition-all duration-300 rounded-lg cursor-pointer"
              >
                {/* Icon */}
                <div className="w-11 h-11 flex items-center justify-center border border-border group-hover:border-bronze/40 transition-all duration-300 flex-shrink-0 text-bronze">
                  {card.icon}
                </div>

                {/* Accent line */}
                <div className="h-px bg-bronze/30 transition-all duration-500 w-5 group-hover:w-9" />

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
              </a>
            ))}
          </div>

          {/* Response time note */}
          <div className="flex items-center gap-3 mt-8">
            <div className="w-2 h-2 rounded-full bg-green-500/70 flex-shrink-0 animate-pulse" />
            <p className="font-body font-light text-[0.72rem] text-muted m-0 tracking-[0.04em]">
              Our team is online · We typically respond within{" "}
              <span className="text-ink font-normal">24 hours</span>
            </p>
          </div>
        </div>
      </section>

      {/* Modal Backdrops */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-ink/35 backdrop-blur-xs flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-background border border-border w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-fadeIn relative">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-border flex items-center justify-between">
              <h3 className="font-display font-medium text-[1.15rem] text-ink m-0">
                {activeModal === "track" && "Track Your Order"}
                {activeModal === "styling" && "Book a Design Consultation"}
                {activeModal === "returns" && "Returns & Exchanges Portal"}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full border border-border bg-background flex items-center justify-center text-muted hover:text-ink hover:border-bronze transition-colors duration-200 cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[75vh] overflow-y-auto font-body">
              
              {/* 1. Track Order Modal */}
              {activeModal === "track" && (
                <div className="space-y-5">
                  <form onSubmit={handleTrackSubmit} className="flex gap-3">
                    <input
                      type="text"
                      placeholder="e.g. ORD-1783-2940"
                      value={trackOrderId}
                      onChange={(e) => setTrackOrderId(e.target.value)}
                      className="flex-1 px-4 py-3 bg-surface border border-border rounded-lg text-ink text-sm focus:outline-none focus:border-bronze"
                    />
                    <button
                      type="submit"
                      disabled={trackLoading}
                      className="px-6 py-3 bg-ink text-background hover:bg-bronze hover:text-white transition-all duration-200 rounded-lg text-xs font-body font-medium tracking-wider uppercase disabled:opacity-50 cursor-pointer"
                    >
                      {trackLoading ? "Searching..." : "Track"}
                    </button>
                  </form>

                  {trackError && (
                    <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg leading-relaxed">
                      {trackError}
                    </div>
                  )}

                  {trackResult && (
                    <div className="space-y-4 border-t border-border pt-4 animate-fadeIn">
                      <div className="flex justify-between items-center bg-surface p-3.5 rounded-lg border border-border">
                        <div>
                          <p className="text-[0.62rem] text-muted uppercase tracking-widest m-0 mb-1">Order Reference</p>
                          <h4 className="text-ink font-display font-medium text-sm m-0">{trackResult.orderId}</h4>
                        </div>
                        <div className="text-right">
                          <p className="text-[0.62rem] text-muted uppercase tracking-widest m-0 mb-1">Status</p>
                          <span className="px-3 py-1 bg-bronze/10 text-bronze font-body text-[0.62rem] tracking-wider uppercase font-semibold rounded-full border border-bronze/15">
                            {trackResult.status}
                          </span>
                        </div>
                      </div>

                      {/* Timeline Stepper */}
                      <div className="relative pl-6 space-y-5">
                        <div className="absolute left-2.5 top-2 bottom-2 w-px bg-border" />
                        {[
                          { label: "Order Placed", match: ["Placed", "Processing", "Shipped", "Delivered"] },
                          { label: "Processing & QC", match: ["Processing", "Shipped", "Delivered"] },
                          { label: "Shipped out", match: ["Shipped", "Delivered"] },
                          { label: "Delivered", match: ["Delivered"] }
                        ].map((step, idx) => {
                          const isDone = step.match.includes(trackResult.status);
                          return (
                            <div key={idx} className="relative flex items-start gap-4">
                              <span className={`absolute -left-6.5 w-3 h-3 rounded-full border-2 ${
                                isDone ? "bg-bronze border-bronze shadow-xs animate-pulse" : "bg-background border-border"
                              }`} />
                              <div>
                                <p className={`text-xs m-0 font-medium ${isDone ? "text-ink" : "text-muted"}`}>
                                  {step.label}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Items details summary */}
                      <div className="border-t border-border pt-4">
                        <p className="text-[0.65rem] text-muted uppercase tracking-widest mb-3">Items Summary</p>
                        <div className="space-y-2">
                          {trackResult.items.map((item, index) => (
                            <div key={index} className="flex justify-between items-center text-xs text-ink py-1">
                              <span className="font-light truncate max-w-[200px]">
                                {item.name} <em className="text-muted text-[0.7rem] not-italic">x {item.quantity}</em>
                              </span>
                              <span className="font-medium">₹{item.price.toLocaleString("en-IN")}</span>
                            </div>
                          ))}
                          <div className="flex justify-between items-center text-xs font-semibold text-ink border-t border-border/50 pt-2.5 mt-2">
                            <span>Total Bill</span>
                            <span className="text-bronze">₹{trackResult.totalAmount.toLocaleString("en-IN")}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 2. Styling Advice Modal */}
              {activeModal === "styling" && (
                <form onSubmit={handleStylingSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[0.6rem] uppercase tracking-widest text-muted">Full Name</label>
                      <input
                        type="text"
                        required
                        value={stylingForm.name}
                        onChange={(e) => setStylingForm({ ...stylingForm, name: e.target.value })}
                        className="px-3.5 py-2.5 bg-surface border border-border rounded-lg text-ink text-sm focus:outline-none focus:border-bronze"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[0.6rem] uppercase tracking-widest text-muted">Email Address</label>
                      <input
                        type="email"
                        required
                        value={stylingForm.email}
                        onChange={(e) => setStylingForm({ ...stylingForm, email: e.target.value })}
                        className="px-3.5 py-2.5 bg-surface border border-border rounded-lg text-ink text-sm focus:outline-none focus:border-bronze"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[0.6rem] uppercase tracking-widest text-muted">Target Space</label>
                      <select
                        value={stylingForm.space}
                        onChange={(e) => setStylingForm({ ...stylingForm, space: e.target.value })}
                        className="px-3.5 py-2.5 bg-surface border border-border rounded-lg text-ink text-sm focus:outline-none focus:border-bronze"
                      >
                        <option value="Living Room">Living Room</option>
                        <option value="Bedroom">Bedroom</option>
                        <option value="Dining Room">Dining Room</option>
                        <option value="Home Office">Home Office</option>
                        <option value="Decor/Art styling">Decor/Art Styling</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[0.6rem] uppercase tracking-widest text-muted">Preferred Style</label>
                      <select
                        value={stylingForm.style}
                        onChange={(e) => setStylingForm({ ...stylingForm, style: e.target.value })}
                        className="px-3.5 py-2.5 bg-surface border border-border rounded-lg text-ink text-sm focus:outline-none focus:border-bronze"
                      >
                        <option value="Modern Minimalist">Modern Minimalist</option>
                        <option value="Scandinavian">Scandinavian</option>
                        <option value="Luxury Living">Luxury Living</option>
                        <option value="Boho Chic">Boho Chic</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[0.6rem] uppercase tracking-widest text-muted">Design Request Details</label>
                    <textarea
                      rows="4"
                      required
                      placeholder="Tell us about your room size, colors, or specific furniture requirements..."
                      value={stylingForm.message}
                      onChange={(e) => setStylingForm({ ...stylingForm, message: e.target.value })}
                      className="px-3.5 py-2.5 bg-surface border border-border rounded-lg text-ink text-sm focus:outline-none focus:border-bronze resize-none"
                    />
                  </div>

                  {stylingError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                      {stylingError}
                    </div>
                  )}

                  {stylingSuccess && (
                    <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-lg leading-relaxed">
                      {stylingSuccess}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={stylingLoading}
                    className="w-full py-3.5 bg-ink text-background hover:bg-bronze hover:text-white transition-all duration-200 rounded-lg text-xs font-body font-medium tracking-widest uppercase disabled:opacity-50 cursor-pointer"
                  >
                    {stylingLoading ? "Booking Consultation..." : "Submit Consultation Request"}
                  </button>
                </form>
              )}

              {/* 3. Returns & Exchanges Modal */}
              {activeModal === "returns" && (
                <div className="space-y-5">
                  <div className="bg-surface p-4 border border-border rounded-lg space-y-2">
                    <h4 className="text-xs font-semibold text-ink uppercase tracking-wider m-0">Return Policy Highlight</h4>
                    <ul className="text-[0.72rem] text-muted pl-4 space-y-1 list-disc m-0 leading-relaxed">
                      <li>We accept return requests within <strong>30 days</strong> of delivery.</li>
                      <li>Items must be returned in their original packaging and condition.</li>
                      <li>Standard refund processing takes 5-7 business days after collection.</li>
                    </ul>
                  </div>

                  <form onSubmit={handleReturnSubmit} className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[0.6rem] uppercase tracking-widest text-muted">Order Reference ID</label>
                      <input
                        type="text"
                        placeholder="e.g. ORD-1783-2940"
                        value={returnOrderId}
                        onChange={(e) => setReturnOrderId(e.target.value)}
                        className="px-3.5 py-2.5 bg-surface border border-border rounded-lg text-ink text-sm focus:outline-none focus:border-bronze"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[0.6rem] uppercase tracking-widest text-muted">Reason for Return</label>
                      <select
                        value={returnReason}
                        onChange={(e) => setReturnReason(e.target.value)}
                        className="px-3.5 py-2.5 bg-surface border border-border rounded-lg text-ink text-sm focus:outline-none focus:border-bronze"
                      >
                        <option value="Changed Mind">Changed my mind / Size issue</option>
                        <option value="Not as Described">Item color or print doesn't fit expectations</option>
                        <option value="Defective">Slight surface transit damage</option>
                      </select>
                    </div>

                    {returnError && (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg leading-relaxed">
                        {returnError}
                      </div>
                    )}

                    {returnSuccess && (
                      <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-lg leading-relaxed font-medium">
                        {returnSuccess}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={returnLoading}
                      className="w-full py-3.5 bg-ink text-background hover:bg-bronze hover:text-white transition-all duration-200 rounded-lg text-xs font-body font-medium tracking-widest uppercase disabled:opacity-50 cursor-pointer"
                    >
                      {returnLoading ? "Processing Return..." : "Request Return Authorization"}
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}