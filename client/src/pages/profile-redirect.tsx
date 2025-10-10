import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { normalizeUserType } from "@/lib/utils";

export default function ProfileRedirect() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const normalized = normalizeUserType((user as any)?.userType);
    if (normalized === "professional") navigate("/employee/home", { replace: true });
    else if (normalized === "employer") navigate("/employer/home", { replace: true });
    else navigate("/", { replace: true });
  }, [user, navigate]);

  return null;
}
