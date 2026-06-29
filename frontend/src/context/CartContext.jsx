import { createContext, useContext, useState, useEffect } from "react";
import { products } from "../utils/mockData";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("novella_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("novella_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (productId, quantity = 1, color = null, size = null) => {
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
