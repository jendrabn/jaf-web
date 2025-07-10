import { type FormEvent, useState } from "react";
import { useFetchCities, useFetchProvinces } from "../../services/api/region";
import { Button, Form, Modal } from "react-bootstrap";
import type { AddressTypes } from "../../types/checkout";
import {
  useCheckoutDispatch,
  useCheckoutState,
} from "../../contexts/CheckoutContext";
import { toast } from "react-toastify";
import { useFetchShippingCosts } from "../../services/api/order";

interface DeliveryAddressModalProps {
  onClose: () => void;
  show?: boolean;
}

function DeliveryAddressModal({
  show = false,
  onClose,
}: DeliveryAddressModalProps) {
  const { address, checkout } = useCheckoutState();
  const dispatch = useCheckoutDispatch();

  const [data, setData] = useState<AddressTypes>({
    name: address?.name || "",
    phone: address?.phone || "",
    province: address?.province || undefined,
    city: address?.city || undefined,
    district: address?.district || "",
    postal_code: address?.postal_code || "",
    address: address?.address || "",
  });

  const shippingCostMutation = useFetchShippingCosts();

  const { data: provinces, isLoading: isLoadingProvinces } =
    useFetchProvinces();
  const { data: cities, isLoading: isLoadingCities } = useFetchCities(
    data.province?.id
  );

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !data.name ||
      !data.phone ||
      !data.province ||
      !data.city ||
      !data.district ||
      !data.postal_code ||
      !data.address
    ) {
      toast.error("Please fill in all the fields");

      return;
    }

    dispatch({ type: "SET_ADDRESS", payload: data });

    onClose();

    dispatch({ type: "SET_LOADING_SHIPPING_COSTS", payload: true });

    shippingCostMutation.mutate(
      {
        destination: data.city?.id || 0,
        weight: checkout?.total_weight || 0,
      },
      {
        onSuccess(data) {
          dispatch({ type: "SET_SHIPPING_COSTS", payload: data });
        },
        onSettled() {
          dispatch({ type: "SET_LOADING_SHIPPING_COSTS", payload: false });
        },
      }
    );
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header>
        <Modal.Title>Alamat Pengiriman</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <fieldset disabled={shippingCostMutation.isPending}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Nama Lengkap</Form.Label>
              <Form.Control
                type="text"
                value={data.name}
                name="name"
                onChange={(e) => setData({ ...data, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="phone">
              <Form.Label>Nomor Telepon</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={data.phone}
                onChange={(e) => setData({ ...data, phone: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="provinces">
              <Form.Label>Provinsi</Form.Label>
              <Form.Select
                disabled={isLoadingProvinces}
                value={data.province?.id || ""}
                onChange={(e) =>
                  setData({
                    ...data,
                    province: provinces?.find(
                      (province) => province.id === Number(e.target.value)
                    ),
                  })
                }
              >
                <option>Pilih Provinsi</option>
                {provinces?.map((province) => (
                  <option key={`province-${province.id}`} value={province.id}>
                    {province.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="cities">
              <Form.Label>Kabupaten/Kota</Form.Label>
              <Form.Select
                value={data.city?.id || ""}
                onChange={(e) =>
                  setData({
                    ...data,
                    city: cities?.find(
                      (city) => city.id === Number(e.target.value)
                    ),
                  })
                }
                disabled={isLoadingCities || !data.province}
              >
                <option>Pilih Kabupaten/Kota</option>
                {cities?.map((city) => (
                  <option key={`city-${city.id}`} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="district">
              <Form.Label>Kecamatan</Form.Label>
              <Form.Control
                type="text"
                name="district"
                value={data.district}
                onChange={(e) => setData({ ...data, district: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="postal_code">
              <Form.Label>Kode Pos</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) =>
                  setData({ ...data, postal_code: e.target.value })
                }
                name="postal_code"
                value={data.postal_code}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="address">
              <Form.Label>Alamat Lengkap</Form.Label>
              <Form.Control
                type="text"
                as={"textarea"}
                rows={2}
                name="address"
                onChange={(e) => setData({ ...data, address: e.target.value })}
                value={data.address}
              />
              <Form.Text className="text-muted">
                Masukkan alamat lengkap Anda, termasuk nomor rumah, nama jalan,
                dan detail lainnya.
              </Form.Text>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="outline-secondary" onClick={handleClose}>
                Batal
              </Button>
              <Button variant="primary" type="submit">
                Simpan
              </Button>
            </div>
          </fieldset>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default DeliveryAddressModal;
