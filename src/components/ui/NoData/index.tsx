import EmptyFolder from "@/assets/images/empty-folder.png";
import type { ReactNode } from "react";

interface NoDataProps {
  className?: string;
  title?: string;
  message?: string | ReactNode;
  icon?: string;
  showIcon?: boolean;
}

const NoData = ({
  className = "",
  title = "Data Tidak Tersedia",
  message = "Kami tidak menemukan data untuk ditampilkan saat ini. Silakan periksa kembali atau coba beberapa saat lagi.",
  icon = EmptyFolder,
  showIcon = true,
}: NoDataProps) => {
  return (
    <section
      className={`w-100 d-flex justify-content-center align-items-center py-5 ${className}`}
      aria-labelledby="no-data-title"
      role="status"
    >
      <div className="text-center">
        {showIcon && (
          <img
            src={icon}
            alt="No Data"
            style={{ maxWidth: 100 }}
            className="mb-3"
          />
        )}
        <h2 id="no-data-title" className="h5 fw-semibold text-dark mb-2">
          {title}
        </h2>
        <p className="text-muted mb-0">{message}</p>
      </div>
    </section>
  );
};

export default NoData;
