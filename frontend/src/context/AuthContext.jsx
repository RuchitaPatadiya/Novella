import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize: Check if the user is already logged in (verify secure cookie session)
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const res = await API.get("/auth/profile");
        setUser(res.data); // Log the user in if the cookie token is valid
      } catch (err) {
        setUser(null); // Keep user logged out if token is missing/expired
      } finally {
        setLoading(false);
      }
    };
    checkLoginStatus();
  }, []);

  // Register User
  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.post("/auth/register", { name, email, password });
      setUser(res.data);
      setLoading(false);
      return res.data;
    } catch (err) {
      const errMsg = err.response?.data?.message || "Failed to create account.";
      setError(errMsg);
      setLoading(false);
      throw new Error(errMsg);
    }
  };

  // Login User
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.post("/auth/login", { email, password });
      setUser(res.data);
      setLoading(false);
      return res.data;
    } catch (err) {
      const errMsg = err.response?.data?.message || "Invalid email or password.";
      setError(errMsg);
      setLoading(false);
      throw new Error(errMsg);
    }
  };

  // Login with Google
  const loginWithGoogle = async (credential) => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.post("/auth/google", { credential });
      setUser(res.data);
      setLoading(false);
      return res.data;
    } catch (err) {
      const errMsg = err.response?.data?.message || "Google Authentication failed.";
      setError(errMsg);
      setLoading(false);
      throw new Error(errMsg);
    }
  };

  // Logout User
  const logout = async () => {
    setLoading(true);
    try {
      await API.post("/auth/logout");
      setUser(null);
      setError(null);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update Profile Details (Shipping details, order history)
  const updateProfile = async (updatedData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.put("/auth/profile", updatedData);
      setUser(res.data);
      setLoading(false);
      return res.data;
    } catch (err) {
      const errMsg = err.response?.data?.message || "Failed to update profile.";
      setError(errMsg);
      setLoading(false);
      throw new Error(errMsg);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        loginWithGoogle,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};