import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [wishlist, setWishlist] = useState([]);

  // Load user-specific wishlist when user shifts
  useEffect(() => {
    if (user) {
      try {
        const saved = localStorage.getItem(`novella_wishlist_${user.id}`);
        setWishlist(saved ? JSON.parse(saved) : []);
      } catch {
        setWishlist([]);
      }
    } else {
      setWishlist([]);
    }
  }, [user]);

  // Sync wishlist to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(`novella_wishlist_${user.id}`, JSON.stringify(wishlist));
    }
  }, [wishlist, user]);

  const toggleWishlist = (id) => {
    if (!user) {
      alert("Please sign in to add items to your wishlist.");
      navigate("/login", { state: { from: location } });
      return;
    }
    setWishlist((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const isInWishlist = (id) => {
    return wishlist.includes(id);
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
