function NoData({ className }: { className?: string }) {
  return (
    <div
      className={`w-100 d-flex justify-content-center align-items-center py-3 ${className}`}
    >
      <p className="text-center text-muted mb-0">Tidak ada data</p>
    </div>
  );
}

export default NoData;
