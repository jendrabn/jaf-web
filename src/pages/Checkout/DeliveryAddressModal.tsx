import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  useFetchCities,
  useFetchDistricts,
  useFetchProvinces,
  useFetchSubDistricts,
} from "../../hooks/api/region";
import { Button, Form, Modal } from "react-bootstrap";
import Select, { type SingleValue } from "react-select";
import type { AddressTypes } from "../../types/checkout";
import {
  useCheckoutDispatch,
  useCheckoutState,
} from "../../contexts/CheckoutContext";
import { toast } from "react-toastify";
import { useFetchShippingCosts } from "../../hooks/api/order";

interface DeliveryAddressModalProps {
  onClose: () => void;
  show?: boolean;
}

const EMPTY_ADDRESS: AddressTypes = {
  name: "",
  phone: "",
  province: undefined,
  city: undefined,
  district: undefined,
  subdistrict: undefined,
  zip_code: "",
  address: "",
};

function DeliveryAddressModal({
  show = false,
  onClose,
}: DeliveryAddressModalProps) {
  const { address, checkout } = useCheckoutState();
  const dispatch = useCheckoutDispatch();

  const [data, setData] = useState<AddressTypes>({ ...EMPTY_ADDRESS });

  useEffect(() => {
    if (address) {
      setData({
        name: address.name ?? "",
        phone: address.phone ?? "",
        province: address.province,
        city: address.city,
        district: address.district,
        subdistrict: address.subdistrict,
        zip_code: address.zip_code ?? "",
        address: address.address ?? "",
      });
    } else {
      setData({ ...EMPTY_ADDRESS });
    }
  }, [address, show]);

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

  type Option = { value: number; label: string };

  const provinceOptions = useMemo<Option[]>(
    () =>
      (provinces ?? []).map((province) => ({
        value: province.id,
        label: province.name,
      })),
    [provinces]
  );

  const cityOptions = useMemo<Option[]>(
    () =>
      (cities ?? []).map((city) => ({
        value: city.id,
        label: city.name,
      })),
    [cities]
  );

  const districtOptions = useMemo<Option[]>(
    () =>
      (districts ?? []).map((district) => ({
        value: district.id,
        label: district.name,
      })),
    [districts]
  );

  const subDistrictOptions = useMemo<Option[]>(
    () =>
      (subDistricts ?? []).map((subdistrict) => ({
        value: subdistrict.id,
        label: subdistrict.name,
      })),
    [subDistricts]
  );

  const selectedProvinceOption = useMemo<Option | null>(
    () =>
      provinceOptions.find((option) => option.value === data.province?.id) ??
      null,
    [provinceOptions, data.province?.id]
  );

  const selectedCityOption = useMemo<Option | null>(
    () => cityOptions.find((option) => option.value === data.city?.id) ?? null,
    [cityOptions, data.city?.id]
  );

  const selectedDistrictOption = useMemo<Option | null>(
    () =>
      districtOptions.find((option) => option.value === data.district?.id) ??
      null,
    [districtOptions, data.district?.id]
  );

  const selectedSubDistrictOption = useMemo<Option | null>(
    () =>
      subDistrictOptions.find(
        (option) => option.value === data.subdistrict?.id
      ) ?? null,
    [subDistrictOptions, data.subdistrict?.id]
  );

  const handleProvinceChange = useCallback(
    (option: SingleValue<Option>) => {
      const selectedProvince = provinces?.find(
        (province) => province.id === option?.value
      );

      setData((prev) => ({
        ...prev,
        province: selectedProvince,
        city: undefined,
        district: undefined,
        subdistrict: undefined,
        zip_code: "",
      }));
    },
    [provinces]
  );

  const handleCityChange = useCallback(
    (option: SingleValue<Option>) => {
      const selectedCity = cities?.find((city) => city.id === option?.value);

      setData((prev) => ({
        ...prev,
        city: selectedCity,
        district: undefined,
        subdistrict: undefined,
        zip_code: "",
      }));
    },
    [cities]
  );

  const handleDistrictChange = useCallback(
    (option: SingleValue<Option>) => {
      const selectedDistrict = districts?.find(
        (district) => district.id === option?.value
      );

      setData((prev) => ({
        ...prev,
        district: selectedDistrict,
        subdistrict: undefined,
        zip_code: "",
      }));
    },
    [districts]
  );

  const handleSubDistrictChange = useCallback(
    (option: SingleValue<Option>) => {
      const selectedSubDistrict = subDistricts?.find(
        (subdistrict) => subdistrict.id === option?.value
      );

      setData((prev) => ({
        ...prev,
        subdistrict: selectedSubDistrict,
        zip_code: selectedSubDistrict?.zip_code ?? "",
      }));
    },
    [subDistricts]
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

            <Form.Group className="mb-3" controlId="province">
              <Form.Label>Provinsi</Form.Label>
              <Select
                inputId="province-select"
                classNamePrefix="react-select"
                options={provinceOptions}
                value={selectedProvinceOption}
                onChange={handleProvinceChange}
                isLoading={isLoadingProvinces}
                isDisabled={isLoadingProvinces}
                isClearable
                placeholder="Pilih Provinsi"
                noOptionsMessage={() => "Provinsi tidak ditemukan"}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="city">
              <Form.Label>Kabupaten/Kota</Form.Label>
              <Select
                inputId="city-select"
                classNamePrefix="react-select"
                options={cityOptions}
                value={selectedCityOption}
                onChange={handleCityChange}
                isLoading={isLoadingCities}
                isDisabled={isLoadingCities || !data.province}
                isClearable
                placeholder="Pilih Kabupaten/Kota"
                noOptionsMessage={() => "Kabupaten/Kota tidak ditemukan"}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="district">
              <Form.Label>Kecamatan</Form.Label>
              <Select
                inputId="district-select"
                classNamePrefix="react-select"
                options={districtOptions}
                value={selectedDistrictOption}
                onChange={handleDistrictChange}
                isLoading={isLoadingDistricts}
                isDisabled={isLoadingDistricts || !data.city}
                isClearable
                placeholder="Pilih Kecamatan"
                noOptionsMessage={() => "Kecamatan tidak ditemukan"}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="subdistrict">
              <Form.Label>Keluarahan/Desa</Form.Label>
              <Select
                inputId="subdistrict-select"
                classNamePrefix="react-select"
                options={subDistrictOptions}
                value={selectedSubDistrictOption}
                onChange={handleSubDistrictChange}
                isLoading={isLoadingSubDistricts}
                isDisabled={isLoadingSubDistricts || !data.district}
                isClearable
                placeholder="Pilih Kelurahan/Desa"
                noOptionsMessage={() => "Kelurahan/Desa tidak ditemukan"}
              />
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
