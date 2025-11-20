import Layout from "@/components/layouts/Layout";
import ProductItem from "@/components/parts/ProductItem";
import Loading from "@/components/ui/Loading";
import NoData from "@/components/ui/NoData";
import CountdownBlocks from "@/components/ui/CountdownBlocks";
import { useFetchFlashSales } from "@/hooks/api/flash-sale";
import type { FlashSaleScheduleTypes } from "@/types/flash-sale";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { env } from "@/utils/config";
import "./index.scss";

const formatTime = (dateString: string) => {
  const d = new Date(dateString);
  return d.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const formatTabLabel = (sale: FlashSaleScheduleTypes) => {
  if (sale.status === "running") return "Berlangsung";

  const start = new Date(sale.start_at);
  const now = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(now.getDate() + 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const time = formatTime(sale.start_at);

  if (isSameDay(start, now)) {
    return `${time} Hari Ini`;
  }

  if (isSameDay(start, tomorrow)) {
    return `${time} Besok`;
  }

  const dateLabel = start.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return `${time} ${dateLabel}`;
};

const FlashSalePage = () => {
  const { data, isLoading } = useFetchFlashSales();
  const flashSales = data || [];
  const [activeId, setActiveId] = useState<number | null>(null);

  useEffect(() => {
    if (flashSales.length === 0) {
      setActiveId(null);
      return;
    }

    setActiveId((prev) => {
      if (prev && flashSales.some((sale) => sale.id === prev)) {
        return prev;
      }
      const currentSale =
        flashSales.find((sale) => sale.status === "running") || flashSales[0];
      return currentSale.id;
    });
  }, [flashSales]);

  const activeSale = useMemo(
    () => flashSales.find((sale) => sale.id === activeId) || null,
    [flashSales, activeId]
  );

  const countdownTarget =
    activeSale?.status === "running"
      ? activeSale.end_at
      : activeSale?.start_at ?? null;

  const countdownLabel =
    activeSale?.status === "running" ? "Berakhir dalam" : "Mulai dalam";

  return (
    <Layout>
      <Helmet>
        <title>Flash Sale | {env.APP_NAME}</title>
      </Helmet>

      <div className="container flash-sale-page">
        <div className="flash-sale-hero mb-4">
          <div>
            <p className="text-primary fw-semibold mb-1 text-uppercase small">
              Promo Terbatas
            </p>
            <h1 className="h3 mb-2">Flash Sale Eksklusif</h1>
            <p className="text-secondary mb-0">
              Nikmati harga spesial untuk pilihan parfum dan home care favorit,
              stok terbatas dan hanya tersedia pada jam tertentu.
            </p>
          </div>
        </div>

        {isLoading && <Loading className="py-5" />}

        {!isLoading && flashSales.length === 0 && (
          <NoData
            title="Belum Ada Flash Sale"
            message="Tunggu jadwal berikutnya dan aktifkan notifikasi agar tidak ketinggalan promo kilat kami."
          />
        )}

        {!isLoading && flashSales.length > 0 && (
          <>
            <div className="flash-sale-tabs mb-3">
              {flashSales.map((sale) => (
                <button
                  key={sale.id}
                  type="button"
                  className={`flash-sale-tab ${
                    sale.id === activeId ? "active" : ""
                  }`}
                  onClick={() => setActiveId(sale.id)}
                >
                  <span className="tab-label">{formatTabLabel(sale)}</span>
                  <small className="tab-subtitle">
                    {sale.status === "running"
                      ? "Sedang berlangsung"
                      : `Mulai ${formatTime(sale.start_at)}`}
                  </small>
                </button>
              ))}
            </div>

            {activeSale && (
              <>
                <div
                  className={`flash-sale-countdown-bar ${
                    activeSale.status === "running"
                      ? "flash-sale-countdown-running"
                      : "flash-sale-countdown-scheduled"
                  }`}
                >
                  <span className="fw-semibold">{countdownLabel}</span>
                  {countdownTarget && (
                    <CountdownBlocks targetDate={countdownTarget} size="sm" />
                  )}
                </div>

                {activeSale.products.length === 0 && (
                  <NoData
                    title="Produk Belum Tersedia"
                    message="Kami sedang menyiapkan kejutan lainnya. Silakan cek lagi beberapa saat."
                  />
                )}

                {activeSale.products.length > 0 && (
                  <div className="row g-3">
                    {activeSale.products.map((product) => (
                      <div className="col-6 col-md-3 col-lg-2" key={product.id}>
                        <ProductItem
                          product={product}
                          showRating={false}
                          flashSaleStatus={
                            activeSale.status === "running"
                              ? "running"
                              : "scheduled"
                          }
                          hideZeroSoldCount
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default FlashSalePage;
