import { ModeToggle } from "./ui/dark-mode-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { buttonVariants } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn, normalizeUserType } from "@/lib/utils";
import { MainNav } from "./main-nav";
import { Link, useNavigate, useLocation } from "react-router-dom";

export function SiteHeader() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const isMarketingHome = location.pathname === "/";

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      // ignore errors, still navigate to home to clear UI state
      console.warn("Logout failed:", e);
    }
    navigate("/", { replace: true });
  };

  return (
    <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center">
        <MainNav />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <LanguageSwitcher />
          <ModeToggle />
          {user && !isMarketingHome ? (
            <>
              {/* On the marketing site we don't show a profile icon — show role-aware Dashboard instead */}
              {(() => {
                const normalized = normalizeUserType((user as any)?.userType);
                const dashboardPath = normalized === "professional" ? "/employee/dashboard" : normalized === "employer" ? "/employer/dashboard" : "/";
                return (
                  <Link
                    to={dashboardPath}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "w-9 px-0"
                    )}
                  >
                    {t("nav.dashboard")}
                  </Link>
                );
              })()}
              <button
                onClick={handleLogout}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "w-9 px-0"
                )}
              >
                {t("nav.logout")}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "w-9 px-0"
                )}
              >
                {t("nav.signIn")}
              </Link>
              <Link
                to="/signup"
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "w-9 px-0"
                )}
              >
                {t("nav.signUp")}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
