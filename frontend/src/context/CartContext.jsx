import { createContext, useContext, useState, useEffect } from "react";
import { useProducts } from "./ProductContext";
import { useAuth } from "./AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { products } = useProducts();
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load user-specific cart when user shifts
  useEffect(() => {
    if (user) {
      try {
        const saved = localStorage.getItem(`novella_cart_${user.id}`);
        setCart(saved ? JSON.parse(saved) : []);
      } catch {
        setCart([]);
      }
    } else {
      setCart([]);
    }
  }, [user]);

  // Sync cart to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(`novella_cart_${user.id}`, JSON.stringify(cart));
    }
  }, [cart, user]);

  const addToCart = (productId, quantity = 1, color = null, size = null) => {
    if (!user) {
      alert("Please sign in to add items to your cart.");
      navigate("/login", { state: { from: location } });
      return;
    }
    setCart((prev) => {
      // Check if product with same options already exists
      const existingIdx = prev.findIndex(
        (item) =>
          item.id === productId &&
          item.color === color &&
          item.size === size
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [...prev, { id: productId, quantity, color, size }];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId, color = null, size = null) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(item.id === productId && item.color === color && item.size === size)
      )
    );
  };

  const updateQuantity = (productId, newQty, color = null, size = null) => {
    if (newQty <= 0) {
      removeFromCart(productId, color, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId && item.color === color && item.size === size
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculate dynamic properties
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const cartSubtotal = cart.reduce((acc, item) => {
    const product = products.find((p) => p.id === item.id);
    return acc + (product ? product.price : 0) * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
