import { useEffect, useState } from "react";

function ThemeToggle() {
  const [theme, setTheme] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "dark" || saved === "light") return saved;
      return window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    try {
      document.documentElement.setAttribute("data-bs-theme", theme);
      localStorage.setItem("theme", theme);

      const logo =
        document.querySelector<HTMLImageElement>(".navbar-brand img");
      if (logo) {
        logo.src =
          theme === "dark" ? "/img/logo-dark.png" : "/img/logo-light.png";
      }
    } catch {
      // ignore
    }
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <button
      type="button"
      className="btn btn-link"
      onClick={toggle}
      title="Toggle Theme"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <i className="bi bi-moon-stars" />
      ) : (
        <i className="bi bi-sun-fill" />
      )}
    </button>
  );
}

export default ThemeToggle;
