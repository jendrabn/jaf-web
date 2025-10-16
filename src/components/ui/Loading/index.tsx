import { Spinner } from "react-bootstrap";

const Loading = ({ className }: { className?: string }) => {
  return (
    <>
      <div
        className={`d-flex justify-content-center align-items-center ${className}`}
      >
        <Spinner variant="primary" />
      </div>
    </>
  );
};

export default Loading;
