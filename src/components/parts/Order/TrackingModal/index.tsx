import { Modal, Button, Alert, Card } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import fetchApi from "@/utils/api";
import Loading from "@/components/ui/Loading";
import { QUERY_KEYS } from "@/utils/constans";
import type { AxiosError } from "axios";

interface TrackingModalProps {
  orderId: number | null;
  show: boolean;
  onClose: () => void;
}

interface WaybillMeta {
  message?: string;
  code?: number;
  status?: string;
}
interface WaybillSummary {
  courier_code?: string;
  courier_name?: string;
  waybill_number?: string;
  service_code?: string;
  waybill_date?: string;
  shipper_name?: string;
  receiver_name?: string;
  origin?: string;
  destination?: string;
  status?: string;
}
interface WaybillDetails {
  waybill_number?: string;
  waybill_date?: string;
  waybill_time?: string;
  weight?: string;
  origin?: string;
  destination?: string;
  shipper_name?: string;
  shipper_address1?: string;
  shipper_address2?: string;
  shipper_address3?: string;
  shipper_city?: string;
  receiver_name?: string;
  receiver_address1?: string;
  receiver_address2?: string;
  receiver_address3?: string;
  receiver_city?: string;
}
interface DeliveryStatus {
  status?: string;
  pod_receiver?: string;
  pod_date?: string;
  pod_time?: string;
}
interface ManifestItem {
  manifest_code?: string;
  manifest_description?: string;
  manifest_date?: string;
  manifest_time?: string;
  city_name?: string;
}
interface WaybillData {
  delivered?: boolean;
  summary?: WaybillSummary;
  details?: WaybillDetails;
  delivery_status?: DeliveryStatus;
  manifest?: ManifestItem[];
}
interface WaybillApiResponse {
  meta?: WaybillMeta;
  data?: WaybillData;
}

const TrackingModal = ({ orderId, show, onClose }: TrackingModalProps) => {
  const { data, isPending, isError, error, isFetching } = useQuery<
    WaybillApiResponse | WaybillData,
    AxiosError<{ message?: string }>
  >({
    queryKey: [QUERY_KEYS.ORDER, orderId, "waybill"],
    queryFn: async () => fetchApi().get(`/orders/${orderId}/waybill`),
    enabled: show && !!orderId,
    retry: 1,
  });

  const isApiResponse = (val: unknown): val is WaybillApiResponse => {
    if (typeof val !== "object" || val === null) return false;
    const obj = val as Record<string, unknown>;
    return "data" in obj || "meta" in obj;
  };
  const apiResp = isApiResponse(data)
    ? (data as WaybillApiResponse)
    : undefined;
  const payload: WaybillData | undefined = isApiResponse(data)
    ? apiResp?.data
    : (data as WaybillData | undefined);

  // Timeline state & derived list
  const [showAll, setShowAll] = useState(false);
  const manifestsSorted = useMemo(() => {
    const arr = Array.isArray(payload?.manifest)
      ? [...(payload?.manifest || [])]
      : [];
    arr.sort((a, b) => {
      const ta = new Date(
        `${a.manifest_date ?? ""} ${a.manifest_time ?? ""}`
      ).getTime();
      const tb = new Date(
        `${b.manifest_date ?? ""} ${b.manifest_time ?? ""}`
      ).getTime();
      return tb - ta; // newest first
    });
    return arr;
  }, [payload?.manifest]);
  const visibleManifests = showAll
    ? manifestsSorted
    : manifestsSorted.slice(0, 5);

  return (
    <Modal show={show} onHide={onClose} centered backdrop="static" size="lg">
      <Modal.Header closeButton className="border-bottom-0">
        <Modal.Title>Lacak Pesanan</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {(isPending || isFetching) && <Loading className="py-5" />}

        {!isPending && !isFetching && isError && (
          <Alert variant="danger">
            Gagal memuat status pengiriman{" "}
            {error.response?.data?.message || error.message}
          </Alert>
        )}

        {!isPending && !isFetching && !isError && payload && (
          <>
            {Array.isArray(payload.manifest) && payload.manifest.length > 0 && (
              <Card className="mt-3">
                <Card.Header className="fw-semibold">
                  Riwayat Manifest
                </Card.Header>
                <Card.Body>
                  {visibleManifests.map((m, idx) => {
                    const isFirst = idx === 0;
                    const isSecond = idx === 1;
                    const isLast = idx === visibleManifests.length - 1;
                    const markerClass = isFirst
                      ? "bg-success text-white"
                      : isSecond
                      ? "bg-secondary text-white"
                      : "bg-light text-muted";
                    const markerIcon = isFirst
                      ? "bi bi-check-lg"
                      : isSecond
                      ? "bi bi-truck"
                      : "bi bi-dot";
                    const timeLabel = `${m.manifest_date ?? ""} ${
                      m.manifest_time ?? ""
                    }`.trim();

                    return (
                      <div key={`manifest-${idx}`} className="d-flex">
                        <div className="d-flex flex-column align-items-center me-3">
                          <div
                            className={`rounded-circle d-flex align-items-center justify-content-center ${markerClass}`}
                            style={{ width: "1.25rem", height: "1.25rem" }}
                          >
                            <i className={markerIcon}></i>
                          </div>
                          {!isLast && (
                            <div
                              className="border-start border-2 flex-grow-1 mt-1"
                              style={{ minHeight: "1.5rem" }}
                            ></div>
                          )}
                        </div>
                        <div className="flex-grow-1 pb-3">
                          <div
                            className={
                              isFirst
                                ? "fw-semibold text-success"
                                : "fw-semibold"
                            }
                          >
                            {m.manifest_description}
                          </div>
                          <div className="small text-secondary">
                            {m.city_name || "-"}
                          </div>
                          <div className="small text-muted">{timeLabel}</div>
                        </div>
                      </div>
                    );
                  })}
                  {manifestsSorted.length > visibleManifests.length && (
                    <div className="mt-1">
                      <Button
                        variant="link"
                        className="p-0"
                        onClick={() => setShowAll(true)}
                      >
                        Lihat Lainnya
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer className="border-top-0">
        <Button variant="outline-secondary" onClick={onClose}>
          Tutup
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TrackingModal;
