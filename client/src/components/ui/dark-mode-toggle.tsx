import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";
import { useTheme } from "../theme-provider";

export function ModeToggle() {
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        if (!theme || theme === "system") return;
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, [theme]);

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
    };

    return (
        <button
            onClick={toggleTheme}
            className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 border border-slate-200 dark:border-purple-500/30 transition-all duration-500 hover:shadow-lg dark:hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] overflow-hidden"
            aria-label="Toggle theme"
        >
            <div className="absolute inset-0 rounded-full transition-transform duration-500 group-active:scale-95">
                <Sun className="absolute h-[1.3rem] w-[1.3rem] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-pink-500 transition-all duration-700 ease-in-out dark:-translate-y-[-150%] dark:rotate-180 dark:opacity-0" />
                <Moon className="absolute h-[1.3rem] w-[1.3rem] top-1/2 left-1/2 -translate-x-1/2 -translate-y-[150%] text-purple-400 opacity-0 transition-all duration-700 ease-in-out dark:-translate-y-1/2 dark:-rotate-[360deg] dark:opacity-100" />
            </div>
        </button>
    );
}