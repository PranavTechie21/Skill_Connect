import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { normalizeUserType } from "@/lib/utils";

type Props = {
  children: React.ReactElement;
  allowedUserTypes?: string[]; // backend userType values e.g. ["Professional"]
};

/**
 * ProtectedRoute: checks auth.user exists and optionally checks allowedUserTypes.
 * If not authenticated -> redirect to /login
 * If authenticated but userType not allowed -> redirect to /404 (you can change to /)
 */
export const ProtectedRoute: React.FC<Props> = ({ children, allowedUserTypes }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedUserTypes && allowedUserTypes.length > 0) {
  const ut = (user as any).userType;
  const normalized = normalizeUserType(ut as string);
  const allowedNormalized = allowedUserTypes.map(a => a.toLowerCase());
    if (!allowedNormalized.includes(normalized)) {
      // Debug: log mismatch for easier diagnosis
      console.debug("ProtectedRoute: access denied", { userType: ut, normalized, allowed: allowedNormalized });
      // If the user is authenticated but not authorized for this route,
      // redirect them to their appropriate dashboard instead of a 404.
  const redirectTo = normalized === "professional" ? "/employee/home" : normalized === "employer" ? "/employer/home" : "/";
      return <Navigate to={redirectTo} replace />;
    }
  }

  return children;
};
