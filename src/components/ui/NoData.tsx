function NoData({ className }: { className?: string }) {
  return (
    <div
      className={`w-100 d-flex justify-content-center py-5 ${className ?? ""}`}
    >
      <div className="text-center">
        <div
          className="mb-3 d-inline-flex align-items-center justify-content-center bg-body-tertiary rounded-circle"
          style={{
            width: "clamp(64px, 12vw, 88px)",
            height: "clamp(64px, 12vw, 88px)",
          }}
        >
          <i
            className="bi bi-inbox"
            style={{ fontSize: "clamp(28px, 4vw, 40px)", color: "#6c757d" }}
            aria-hidden="true"
          />
        </div>

        <h3 className="h5 fw-semibold mb-1">Tidak ada data</h3>
        <p className="text-muted mb-0">
          Coba ubah filter atau kata kunci pencarian untuk melihat hasil.
        </p>
      </div>
    </div>
  );
}

export default NoData;
