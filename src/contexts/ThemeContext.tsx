import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const attr = document?.documentElement?.getAttribute("data-bs-theme");
      if (attr === "dark" || attr === "light") return attr;
      const saved = localStorage.getItem("theme");
      if (saved === "dark" || saved === "light") return saved;
      return "light"; // default to light when none set
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    try {
      document.documentElement.setAttribute("data-bs-theme", theme);
      localStorage.setItem("theme", theme);
    } catch {
      // ignore
    }
  }, [theme]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "theme") {
        const v = e.newValue;
        if (v === "dark" || v === "light") setThemeState(v);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setTheme = (t: Theme) => setThemeState(t);
  const toggleTheme = () =>
    setThemeState((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};

export default ThemeContext;
