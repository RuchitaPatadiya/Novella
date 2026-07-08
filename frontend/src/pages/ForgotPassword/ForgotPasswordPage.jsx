import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const res = await API.post("/auth/forgot-password", { email });
      setSuccess(res.data.message || "A password reset link has been dispatched to your console.");
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to request password reset.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center pt-24 pb-12 px-6 md:px-14">
      <div className="w-full max-w-md bg-surface border border-border p-8 md:p-10 shadow-sm relative overflow-hidden transition-all duration-300">
        
        {/* Subtle Decorative Line */}
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-bronze via-gold to-bronze" />

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2.5 mb-3">
            <span className="block w-5 h-px bg-bronze" />
            <span className="font-body font-normal text-[0.55rem] tracking-[0.38em] uppercase text-bronze">
              Reset Session
            </span>
            <span className="block w-5 h-px bg-bronze" />
          </div>
          <h2 className="font-display font-light text-3xl text-ink leading-tight">
            Forgot Password
          </h2>
          <p className="font-body font-light text-[0.8rem] text-muted mt-2">
            Enter your email address below and we'll dispatch a link to reset your account.
          </p>
        </div>

        {/* Success Banner */}
        {success && (
          <div className="bg-emerald-50/60 border border-emerald-200 text-emerald-800 px-4 py-3 text-xs font-body tracking-[0.02em] rounded-sm mb-6 flex items-center gap-2 transition-all duration-300">
            <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{success}</span>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50/60 border border-red-200 text-red-700 px-4 py-3 text-xs font-body tracking-[0.02em] rounded-sm mb-6 flex items-center gap-2 transition-all duration-300">
            <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1 relative">
            <label className="font-body font-normal text-[0.62rem] tracking-[0.18em] uppercase text-muted block mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              placeholder="e.g. email@example.com"
              className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none transition-all duration-300 focus:border-bronze focus:ring-1 focus:ring-bronze/10 placeholder:text-muted/40"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink text-cream-muted font-body font-medium text-[0.68rem] tracking-[0.22em] uppercase py-3.5 mt-2 transition-all duration-300 flex items-center justify-center gap-2 hover:bg-gold hover:text-dark disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed group"
          >
            {loading ? "Requesting..." : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-border/60 text-center">
          <p className="font-body font-light text-[0.8rem] text-muted">
            Remember your password?{" "}
            <Link
              to="/login"
              className="font-normal text-bronze hover:text-gold no-underline transition-colors duration-200"
            >
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default ForgotPasswordPage;
