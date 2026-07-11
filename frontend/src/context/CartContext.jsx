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

  // Load user-specific cart when user shifts (checks ID instead of object reference)
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
  }, [user?.id]);

  // Sync cart to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(`novella_cart_${user.id}`, JSON.stringify(cart));
    }
  }, [cart, user?.id]);

  const addToCart = (productId, quantity = 1, color = null, size = null) => {
    if (!user) {
      alert("Please sign in to add items to your cart.");
      navigate("/login", { state: { from: location } });
      return;
    }

    const product = products.find((p) => Number(p.id) === Number(productId));
    if (!product) {
      alert("Product not found.");
      return;
    }

    const stock = product.stock !== undefined ? product.stock : 0;
    
    // 1. Immediate sync check against current render state
    const existingItem = cart.find(
      (item) =>
        Number(item.id) === Number(productId) &&
        (item.color || null) === (color || null) &&
        (item.size || null) === (size || null)
    );

    const currentQtyInCart = existingItem ? existingItem.quantity : 0;
    const newTotalQty = currentQtyInCart + quantity;

    if (newTotalQty > stock) {
      if (stock === 0) {
        alert("This item is currently out of stock.");
      } else if (currentQtyInCart > 0) {
        alert(`Cannot add more of this item. You already have ${currentQtyInCart} in your cart, which is the maximum available stock (${stock}).`);
      } else {
        alert(`Cannot add ${quantity} of this item. Only ${stock} items are left in stock.`);
      }
      return;
    }

    // 2. Queue the state update with secondary guard checking absolute latest state
    setCart((prev) => {
      const existingLatest = prev.find(
        (item) =>
          Number(item.id) === Number(productId) &&
          (item.color || null) === (color || null) &&
          (item.size || null) === (size || null)
      );

      const latestQtyInCart = existingLatest ? existingLatest.quantity : 0;
      if (latestQtyInCart + quantity > stock) {
        return prev; // Race condition block: abort update
      }

      const existingIdx = prev.findIndex(
        (item) =>
          Number(item.id) === Number(productId) &&
          (item.color || null) === (color || null) &&
          (item.size || null) === (size || null)
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [...prev, { id: Number(productId), quantity, color, size }];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId, color = null, size = null) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            Number(item.id) === Number(productId) &&
            (item.color || null) === (color || null) &&
            (item.size || null) === (size || null)
          )
      )
    );
  };

  const updateQuantity = (productId, newQty, color = null, size = null) => {
    if (newQty <= 0) {
      removeFromCart(productId, color, size);
      return;
    }

    const product = products.find((p) => Number(p.id) === Number(productId));
    if (product) {
      const stock = product.stock !== undefined ? product.stock : 0;
      if (newQty > stock) {
        alert(`Cannot update quantity to ${newQty}. Only ${stock} items are left in stock.`);
        return;
      }
    }

    setCart((prev) =>
      prev.map((item) =>
        Number(item.id) === Number(productId) &&
        (item.color || null) === (color || null) &&
        (item.size || null) === (size || null)
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
