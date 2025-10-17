import { Image } from "react-bootstrap";
import { useTheme } from "@/contexts/ThemeContext";

type LogoProps = {
  alt?: string;
  className?: string;
  darkSrc?: string;
  lightSrc?: string;
};

const Logo = (props: LogoProps) => {
  const {
    alt = "Logo",
    className = "",
    darkSrc = "/img/logo-dark.png",
    lightSrc = "/img/logo-light.png",
  } = props;

  const { theme } = useTheme();
  const src = theme === "dark" ? darkSrc : lightSrc;

  return <Image src={src} alt={alt} className={className} />;
};

export default Logo;
