import { type FormEvent, useState, useEffect } from "react";
import {
  useFetchCities,
  useFetchDistricts,
  useFetchProvinces,
  useFetchSubDistricts,
} from "../../services/api/region";
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
    name: "",
    phone: "",
    province: undefined,
    city: undefined,
    district: undefined,
    subdistrict: undefined,
    zip_code: "",
    address: "",
  });

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      name: address?.name,
      phone: address?.phone,
      province: address?.province,
      city: address?.city,
      district: address?.district,
      subdistrict: address?.subdistrict,
      zip_code: address?.zip_code,
      address: address?.address,
    }));
  }, [address]);

  const shippingCostMutation = useFetchShippingCosts();

  const { data: provinces, isLoading: isLoadingProvinces } =
    useFetchProvinces();
  const { data: cities, isLoading: isLoadingCities } = useFetchCities(
    data.province?.id
  );
  const { data: districts, isLoading: isLoadingDistricts } = useFetchDistricts(
    data.city?.id
  );
  const { data: subDistricts, isLoading: isLoadingSubDistricts } =
    useFetchSubDistricts(data.district?.id);

  useEffect(() => {
    if (data.subdistrict) {
      setData((prev) => ({
        ...prev,
        zip_code: data?.subdistrict?.zip_code || "",
      }));
    }
  }, [data.subdistrict]);

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
      !data.zip_code ||
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

            <Form.Group className="mb-3" controlId="cities">
              <Form.Label>Kecamatan</Form.Label>
              <Form.Select
                value={data.district?.id || ""}
                onChange={(e) =>
                  setData({
                    ...data,
                    district: districts?.find(
                      (district) => district.id === Number(e.target.value)
                    ),
                  })
                }
                disabled={isLoadingDistricts || !data.city}
              >
                <option>Pilih Kecamatan</option>
                {districts?.map((district) => (
                  <option key={`district-${district.id}`} value={district.id}>
                    {district.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="cities">
              <Form.Label>Keluarahan/Desa</Form.Label>
              <Form.Select
                value={data.subdistrict?.id || ""}
                onChange={(e) =>
                  setData({
                    ...data,
                    subdistrict: subDistricts?.find(
                      (subdistrict) => subdistrict.id === Number(e.target.value)
                    ),
                  })
                }
                disabled={isLoadingSubDistricts || !data.district}
              >
                <option>Pilih Keluarahan/Desa</option>
                {subDistricts?.map((subdistrict) => (
                  <option
                    key={`subdistrict-${subdistrict.id}`}
                    value={subdistrict.id}
                  >
                    {subdistrict.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="postal_code">
              <Form.Label>Kode Pos</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setData({ ...data, zip_code: e.target.value })}
                name="zip_code"
                readOnly
                value={data.zip_code}
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
