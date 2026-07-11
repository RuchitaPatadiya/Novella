import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AIAssistant from "./AIAssistant";

const GlobalAIAssistant = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null; // Only available for authenticated users

  const handleApplyFilters = (filters) => {
    // Construct query parameters
    const params = new URLSearchParams();
    if (filters.searchQuery) params.set("aiSearch", filters.searchQuery);
    if (filters.maxPrice) params.set("aiMaxPrice", String(filters.maxPrice));
    if (filters.category) params.set("aiCategory", filters.category);
    if (filters.space) params.set("aiSpace", filters.space);
    if (filters.excludeColor) params.set("aiExcludeColor", filters.excludeColor);

    // Redirect to /shop with query parameters
    navigate(`/shop?${params.toString()}`);
  };

  const handleClearFilters = () => {
    if (location.pathname === "/shop") {
      navigate("/shop");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-body">
      {/* Floating Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full bg-gradient-to-tr from-bronze via-ink to-ink text-background flex items-center justify-center cursor-pointer border border-bronze/25 transition-all duration-300 transform hover:scale-110 shadow-md hover:shadow-lg hover:shadow-bronze/25 ring-4 ring-bronze/10 hover:ring-bronze/20 relative group`}
        title="Consult AI design curator"
      >
        {/* Glow effect on hover */}
        <span className="absolute inset-0 rounded-full bg-bronze/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md" />
        
        {isOpen ? (
          <svg className="w-6 h-6 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative z-10 flex items-center justify-center">
            {/* Pulsing indicator dot */}
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-bronze border border-ink animate-bounce" />
            {/* Sparkles design vector */}
            <svg className="w-6 h-6 text-cream-muted group-hover:text-background transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L18 12l-5.714 2.143L10 21l-2.286-6.857L2 12l5.714-2.143L10 3z" />
            </svg>
          </div>
        )}
      </button>

      {/* Popup Dialog Container */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[360px] max-w-[90vw] animate-fadeIn transition-all duration-300">
          <AIAssistant 
            onApplyFilters={handleApplyFilters}
            onClearFilters={handleClearFilters}
          />
        </div>
      )}
    </div>
  );
};

export default GlobalAIAssistant;
