import { useState } from "react";
import { Button } from "react-bootstrap";

interface CopyTextButtonProps {
  text: string;
  withLabel?: boolean;
}

const CopyTextButton = ({ text, withLabel = true }: CopyTextButtonProps) => {
  const [icon, setIcon] = useState("bi bi-copy");

  const handleClick = () => {
    navigator.clipboard.writeText(text);

    // timeout to reset the icon
    setTimeout(() => {
      setIcon("bi bi-copy");
    }, 1500);

    setIcon("bi bi-check-lg");
  };

  return (
    <Button
      variant="link"
      size="sm"
      className="text-muted"
      onClick={handleClick}
      title="Copy to clipboard"
    >
      <i className={icon}></i>
      {withLabel && <span className="ms-1">Salin</span>}
    </Button>
  );
};

export default CopyTextButton;
