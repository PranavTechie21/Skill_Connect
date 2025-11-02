import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeUserType(raw?: string) {
  // If raw is undefined, null, or empty string, return empty string
  if (!raw) return "";
  
  // Convert to string and lowercase for comparison
  const s = raw.toString().toLowerCase();
  
  // Professional checks
  if (s === "professional" || 
      s === "job_seeker" ||
      s === "employee" ||
      s.includes("professional") ||
      s.includes("job") ||
      s.includes("seeker") ||
      s.includes("employee")) {
    return "professional";
  }
  
  // Employer checks
  if (s === "employer" ||
      s === "company" ||
      s === "owner" ||
      s.includes("employer") ||
      s.includes("company") ||
      s.includes("owner")) {
    return "employer";
  }
  
  // Admin check
  if (s === "admin") {
    return "admin";
  }

  // If raw input exactly matches expected cases, preserve it
  if (raw.toLowerCase() === "professional" || raw.toLowerCase() === "employer" || raw.toLowerCase() === "admin") {
    return raw.toLowerCase();
  }
  
  // When no matches, return Professional as default for safer UX
  console.warn("Unrecognized user type:", raw, "defaulting to Professional");
  return "professional";
}