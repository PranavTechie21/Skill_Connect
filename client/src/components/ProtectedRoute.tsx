import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { normalizeUserType } from "@/lib/utils";

type Props = {
  children: React.ReactElement;
  allowedUserTypes?: string[]; // backend userType values e.g. ["professional", "employer", "admin"]
};

/**
 * ProtectedRoute: checks auth.user exists and optionally checks allowedUserTypes.
 * If not authenticated -> redirect to /login
 * If authenticated but userType not allowed -> redirect to /404 (you can change to /)
 */
export const ProtectedRoute: React.FC<Props> = ({ children, allowedUserTypes }) => {
  const { user } = useAuth();

  console.log("=== ProtectedRoute Check ===");
  console.log("User:", user);
  console.log("Allowed Types:", allowedUserTypes);

  if (!user) {
    console.log("No user found, redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  if (allowedUserTypes && allowedUserTypes.length > 0) {
    // Handle both snake_case (user_type) and camelCase (userType) from backend
    const ut = (user as any).userType || (user as any).user_type;
    const normalized = normalizeUserType(ut as string);
    const allowedNormalized = allowedUserTypes.map(a => normalizeUserType(a));
    
    console.log("ProtectedRoute check:", {
      userType: ut,
      normalized,
      allowedTypes: allowedUserTypes,
      allowedNormalized
    });

    // Check if the normalized user type is in the allowed normalized types
    if (!allowedNormalized.includes(normalized)) {
      console.log("ProtectedRoute: access denied", {
        userType: ut,
        normalized,
        allowed: allowedNormalized,
        reason: `User type "${normalized}" not in allowed types [${allowedNormalized.join(", ")}]`
      });
      
      // If user type is not allowed, redirect to a "not found" or "unauthorized" page.
      return <Navigate to="/404" replace />;
    }
    
    console.log("ProtectedRoute: access granted ✓");
  }

  return children;
};