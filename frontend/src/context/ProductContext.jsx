import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";
import { setMockProducts } from "../utils/mockData";

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all products from MongoDB on load
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await API.get("/products");
      setProducts(res.data);
      setMockProducts(res.data);
      setError(null);
    } catch (err) {
      console.error("Error loading products:", err);
      setError(err.response?.data?.message || "Failed to load product catalog.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add a new product to the catalog (Admin Only)
  const addProduct = async (productData) => {
    try {
      const res = await API.post("/products", productData);
      setProducts((prev) => {
        const updated = [...prev, res.data];
        setMockProducts(updated);
        return updated;
      });
      return res.data;
    } catch (err) {
      const errMsg = err.response?.data?.message || "Failed to add product to catalog.";
      throw new Error(errMsg);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        addProduct,
        refreshProducts: fetchProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
