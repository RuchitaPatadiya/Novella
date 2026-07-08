import { Link } from "react-router-dom";
import { useProducts } from "../../context/ProductContext";
import { useCart } from "../../context/CartContext";

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { products } = useProducts();
  const product = products.find((p) => p.id === item.id);

  if (!product) return null;

  return (
    <div className="flex gap-6 py-6 border-b border-border/60 last:border-0 items-start">
      {/* Item Image */}
      <div className="w-20 sm:w-24 aspect-[3/4] overflow-hidden bg-surface border border-border shrink-0">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </Link>
      </div>

      {/* Item Details */}
      <div className="flex-1 flex flex-col sm:flex-row sm:justify-between gap-4">
        <div className="flex flex-col">
          {/* Title */}
          <Link to={`/product/${product.id}`} className="no-underline">
            <h3 className="font-display font-medium text-[0.95rem] text-ink m-0 hover:text-bronze transition-colors duration-200">
              {product.name}
            </h3>
          </Link>

          {/* Specs Details */}
          {(item.color || item.size) && (
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5 font-body text-[0.7rem] text-muted/80">
              {item.color && (
                <span className="flex items-center gap-1.5">
                  <span className="font-light">Color:</span>
                  <span className="font-medium text-ink capitalize">{item.color}</span>
                </span>
              )}
              {item.color && item.size && <span className="text-border">|</span>}
              {item.size && (
                <span className="flex items-center gap-1.5">
                  <span className="font-light">Size:</span>
                  <span className="font-medium text-ink uppercase">{item.size}</span>
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <p className="font-display font-semibold text-[0.92rem] text-ink mt-3 mb-0">
            ₹{product.price.toLocaleString("en-IN")}
          </p>
        </div>

        {/* Quantity Controls & Remove */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center border border-border bg-surface h-9 px-1 rounded-[2px]">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1, item.color, item.size)}
              aria-label="Decrease quantity"
              className="w-7 h-7 flex items-center justify-center font-body text-muted hover:text-bronze bg-transparent border-0 cursor-pointer text-sm"
            >
              —
            </button>
            <span className="w-8 text-center font-body text-[0.8rem] font-medium text-ink">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1, item.color, item.size)}
              aria-label="Increase quantity"
              className="w-7 h-7 flex items-center justify-center font-body text-muted hover:text-bronze bg-transparent border-0 cursor-pointer text-sm"
            >
              +
            </button>
          </div>

          {/* Remove Trigger */}
          <button
            onClick={() => removeFromCart(item.id, item.color, item.size)}
            className="font-body font-normal text-[0.62rem] tracking-[0.15em] uppercase text-muted hover:text-red-700 bg-transparent border-0 cursor-pointer p-0 transition-colors duration-150 sm:mt-2.5"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
