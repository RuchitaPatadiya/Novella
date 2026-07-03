import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const RegisterPage = () => {
  const { register, error: authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/profile";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await register(name, email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center pt-28 pb-12 px-6 md:px-14">
      <div className="w-full max-w-md bg-surface border border-border p-8 md:p-10 shadow-sm relative overflow-hidden transition-all duration-300">
        
        {/* Subtle Decorative Line */}
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-bronze via-gold to-bronze" />

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2.5 mb-3">
            <span className="block w-5 h-px bg-bronze" />
            <span className="font-body font-normal text-[0.55rem] tracking-[0.38em] uppercase text-bronze">
              Join Novella
            </span>
            <span className="block w-5 h-px bg-bronze" />
          </div>
          <h2 className="font-display font-light text-3xl md:text-4xl text-ink leading-tight">
            Create Account
          </h2>
          <p className="font-body font-light text-[0.8rem] text-muted mt-2">
            Unlock exclusive updates, order tracking, and seamless checkout
          </p>
        </div>

        {/* Global Error Banner */}
        {(error || authError) && (
          <div className="bg-red-50/60 border border-red-200 text-red-700 px-4 py-3 text-xs font-body tracking-[0.02em] rounded-sm mb-6 flex items-center gap-2 transition-all duration-300">
            <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error || authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1 relative">
            <label className="font-body font-normal text-[0.62rem] tracking-[0.18em] uppercase text-muted block mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Eleanor Vance"
              className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none transition-all duration-300 focus:border-bronze focus:ring-1 focus:ring-bronze/10 placeholder:text-muted/40"
              required
            />
          </div>

          <div className="space-y-1 relative">
            <label className="font-body font-normal text-[0.62rem] tracking-[0.18em] uppercase text-muted block mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. email@example.com"
              className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none transition-all duration-300 focus:border-bronze focus:ring-1 focus:ring-bronze/10 placeholder:text-muted/40"
              required
            />
          </div>

          <div className="space-y-1 relative">
            <label className="font-body font-normal text-[0.62rem] tracking-[0.18em] uppercase text-muted block mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Min. 6 characters"
              className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none transition-all duration-300 focus:border-bronze focus:ring-1 focus:ring-bronze/10 placeholder:text-muted/40"
              required
            />
          </div>

          <div className="space-y-1 relative">
            <label className="font-body font-normal text-[0.62rem] tracking-[0.18em] uppercase text-muted block mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-ink outline-none transition-all duration-300 focus:border-bronze focus:ring-1 focus:ring-bronze/10 placeholder:text-muted/40"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink text-cream-muted font-body font-medium text-[0.68rem] tracking-[0.22em] uppercase py-3.5 mt-4 transition-all duration-300 flex items-center justify-center gap-2 hover:bg-gold hover:text-dark disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed group"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-cream-muted" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </span>
            ) : (
              <>
                Create Account
                <svg
                  width="14" height="6" viewBox="0 0 18 8" fill="none"
                  className="text-current transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path d="M0 4H16M13 1L16 4L13 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-border/60 text-center">
          <p className="font-body font-light text-[0.8rem] text-muted">
            Already have an account?{" "}
            <Link
              to="/login"
              state={location.state}
              className="font-normal text-bronze hover:text-gold no-underline transition-colors duration-200"
            >
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
