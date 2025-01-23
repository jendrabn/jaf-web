function Loading({ className }: { className?: string }) {
  return (
    <>
      <div
        className={`d-flex justify-content-center align-items-center ${className}`}
      >
        <div className="d-flex align-items-center text-gray-800">
          <span
            className="spinner-border spinner-border me-2"
            aria-hidden="true"
          ></span>
          <span role="status">Loading...</span>
        </div>
      </div>
    </>
  );
}

export default Loading;
