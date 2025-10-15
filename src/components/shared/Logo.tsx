import { useTheme } from "../../contexts/ThemeContext";

type LogoProps = {
  alt?: string;
  className?: string;
  darkSrc?: string;
  lightSrc?: string;
};

const Logo = ({
  alt = "Logo",
  className = "",
  darkSrc = "/img/logo-dark.png",
  lightSrc = "/img/logo-light.png",
}: LogoProps) => {
  const { theme } = useTheme();
  const src = theme === "dark" ? darkSrc : lightSrc;

  return <img src={src} alt={alt} className={className} />;
};

export default Logo;
