import { Spinner } from "react-bootstrap";

function Loading({ className }: { className?: string }) {
  return (
    <>
      <div
        className={`d-flex justify-content-center align-items-center ${className}`}
      >
        <Spinner variant="primary" />
      </div>
    </>
  );
}

export default Loading;
