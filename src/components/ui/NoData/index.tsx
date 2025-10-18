const NoData = ({ className }: { className?: string }) => {
  return (
    <div
      className={`w-100 d-flex justify-content-center py-5 ${className ?? ""}`}
    >
      <div className="text-center">
        <i
          className="bi bi-inbox display-4"
          style={{ color: "#6c757d" }}
          aria-hidden="true"
        />
        <p className="text-muted mb-0">No Data Available</p>
      </div>
    </div>
  );
};

export default NoData;
