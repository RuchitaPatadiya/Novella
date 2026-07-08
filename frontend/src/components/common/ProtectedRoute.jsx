import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="bg-background min-h-screen pt-32 flex items-center justify-center font-body text-[0.62rem] text-muted tracking-[0.2em] uppercase animate-pulse">
        Verifying Atelier Authorization...
      </div>
    );
  }

  if (!user) {
    // Redirect to login page but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !user.isAdmin) {
    // If they are not an admin but trying to access admin route, send to profile page
    return <Navigate to="/profile" replace />;
  }

  return children;
};

export default ProtectedRoute;
