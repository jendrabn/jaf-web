import { useTheme } from "../../contexts/ThemeContext";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className="btn btn-link"
      onClick={toggleTheme}
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
