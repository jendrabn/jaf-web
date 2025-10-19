import { Modal, Button, Table, Alert } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
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
  const { data, isPending, isError, error, refetch, isFetching } = useQuery<
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
  const meta: WaybillMeta | undefined = apiResp?.meta;
  const payload: WaybillData | undefined = isApiResponse(data)
    ? apiResp?.data
    : (data as WaybillData | undefined);

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
            {meta?.message && (
              <Alert variant="info" className="mb-3">
                {meta.message}
              </Alert>
            )}

            {payload.summary && (
              <>
                <h6 className="fw-bold mb-2">Ringkasan</h6>
                <Table size="sm" borderless className="mb-3">
                  <tbody>
                    <tr>
                      <td>Kurir</td>
                      <td className="text-end">
                        {payload.summary.courier_name} (
                        {payload.summary.courier_code})
                      </td>
                    </tr>
                    <tr>
                      <td>No. Resi</td>
                      <td className="text-end">
                        {payload.summary.waybill_number}
                      </td>
                    </tr>
                    <tr>
                      <td>Layanan</td>
                      <td className="text-end">
                        {payload.summary.service_code}
                      </td>
                    </tr>
                    <tr>
                      <td>Tanggal Resi</td>
                      <td className="text-end">
                        {payload.summary.waybill_date}
                      </td>
                    </tr>
                    <tr>
                      <td>Pengirim</td>
                      <td className="text-end">
                        {payload.summary.shipper_name}
                      </td>
                    </tr>
                    <tr>
                      <td>Penerima</td>
                      <td className="text-end">
                        {payload.summary.receiver_name}
                      </td>
                    </tr>
                    <tr>
                      <td>Asal</td>
                      <td className="text-end">{payload.summary.origin}</td>
                    </tr>
                    <tr>
                      <td>Tujuan</td>
                      <td className="text-end">
                        {payload.summary.destination}
                      </td>
                    </tr>
                    <tr>
                      <td>Status</td>
                      <td className="text-end">{payload.summary.status}</td>
                    </tr>
                  </tbody>
                </Table>
              </>
            )}

            {payload.details && (
              <>
                <h6 className="fw-bold mb-2">Detail</h6>
                <Table size="sm" borderless className="mb-3">
                  <tbody>
                    <tr>
                      <td>No. Resi</td>
                      <td className="text-end">
                        {payload.details.waybill_number}
                      </td>
                    </tr>
                    <tr>
                      <td>Tanggal</td>
                      <td className="text-end">
                        {payload.details.waybill_date}{" "}
                        {payload.details.waybill_time}
                      </td>
                    </tr>
                    <tr>
                      <td>Berat</td>
                      <td className="text-end">{payload.details.weight}</td>
                    </tr>
                    <tr>
                      <td>Asal</td>
                      <td className="text-end">{payload.details.origin}</td>
                    </tr>
                    <tr>
                      <td>Tujuan</td>
                      <td className="text-end">
                        {payload.details.destination}
                      </td>
                    </tr>
                    <tr>
                      <td>Pengirim</td>
                      <td className="text-end">
                        {payload.details.shipper_name}
                      </td>
                    </tr>
                    <tr>
                      <td>Alamat Pengirim</td>
                      <td className="text-end">
                        {[
                          payload.details.shipper_address1,
                          payload.details.shipper_address2,
                          payload.details.shipper_address3,
                          payload.details.shipper_city,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </td>
                    </tr>
                    <tr>
                      <td>Penerima</td>
                      <td className="text-end">
                        {payload.details.receiver_name}
                      </td>
                    </tr>
                    <tr>
                      <td>Alamat Penerima</td>
                      <td className="text-end">
                        {[
                          payload.details.receiver_address1,
                          payload.details.receiver_address2,
                          payload.details.receiver_address3,
                          payload.details.receiver_city,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </>
            )}

            {payload.delivery_status && (
              <>
                <h6 className="fw-bold mb-2">Status Pengantaran</h6>
                <Table size="sm" borderless className="mb-3">
                  <tbody>
                    <tr>
                      <td>Status</td>
                      <td className="text-end">
                        {payload.delivery_status.status}
                      </td>
                    </tr>
                    <tr>
                      <td>Penerima (POD)</td>
                      <td className="text-end">
                        {payload.delivery_status.pod_receiver}
                      </td>
                    </tr>
                    <tr>
                      <td>Tanggal POD</td>
                      <td className="text-end">
                        {payload.delivery_status.pod_date}{" "}
                        {payload.delivery_status.pod_time}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </>
            )}

            {Array.isArray(payload.manifest) && payload.manifest.length > 0 && (
              <>
                <h6 className="fw-bold mb-2">Riwayat Manifest</h6>
                {(() => {
                  const manifests = [...payload.manifest].sort((a, b) => {
                    const ta = new Date(
                      `${a.manifest_date ?? ""} ${a.manifest_time ?? ""}`
                    ).getTime();
                    const tb = new Date(
                      `${b.manifest_date ?? ""} ${b.manifest_time ?? ""}`
                    ).getTime();
                    return tb - ta; // terbaru di atas
                  });
                  return (
                    <Table size="sm" responsive hover>
                      <thead>
                        <tr>
                          <th>Deskripsi</th>
                          <th>Kode</th>
                          <th>Tanggal & Waktu</th>
                          <th>Kota</th>
                        </tr>
                      </thead>
                      <tbody>
                        {manifests.map((m, idx) => (
                          <tr key={`manifest-${idx}`}>
                            <td style={{ minWidth: 220 }}>
                              {m.manifest_description}
                            </td>
                            <td className="text-muted">{m.manifest_code}</td>
                            <td>{`${m.manifest_date ?? ""} ${
                              m.manifest_time ?? ""
                            }`}</td>
                            <td>{m.city_name}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  );
                })()}
              </>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer className="border-top-0">
        <Button variant="outline-secondary" onClick={onClose}>
          Tutup
        </Button>
        <Button
          variant="primary"
          onClick={() => refetch()}
          disabled={isPending || isFetching}
        >
          Muat Ulang
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TrackingModal;
