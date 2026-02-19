import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext.jsx";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { role } = useAuth();
  if (!role) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
