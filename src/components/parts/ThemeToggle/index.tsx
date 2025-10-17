import { Button } from "react-bootstrap";
import { useTheme } from "@/contexts/ThemeContext";

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle = (props: ThemeToggleProps) => {
  const { className } = props;

  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="link"
      onClick={toggleTheme}
      title="Toggle Theme"
      className={className}
    >
      {theme === "dark" ? (
        <i className="bi bi-moon-stars" />
      ) : (
        <i className="bi bi-sun-fill" />
      )}
    </Button>
  );
};

export default ThemeToggle;
