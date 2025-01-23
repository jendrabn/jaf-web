import { FormEvent, useState } from "react";
import { useFetchCities, useFetchProvinces } from "../../services/api/region";
import { Button, Form, Modal } from "react-bootstrap";
import { ShippingAddressTypes } from "../../types/checkout";
import { OrderReqTypes } from "../../types/order";

interface DeliveryAddressModalProps {
  address: ShippingAddressTypes;
  onSubmit: (address: OrderReqTypes["shipping_address"]) => void;
  onClose: () => void;
  show?: boolean;
}

function DeliveryAddressModal({
  address,
  show = false,
  onClose,
  onSubmit,
}: DeliveryAddressModalProps) {
  const [data, setData] = useState({
    name: address?.name || "",
    phone: address?.phone || "",
    city_id: address?.city?.id || null,
    district: address?.district || "",
    postal_code: address?.postal_code || "",
    address: address?.address || "",
  });

  const [selectedProvinceId, setSelectedProvinceId] = useState(
    address?.province?.id || null
  );
  const { data: provinces, isLoading: isLoadingProvinces } =
    useFetchProvinces();
  const { data: cities, isLoading: isLoadingCities } =
    useFetchCities(selectedProvinceId);

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onSubmit(data as OrderReqTypes["shipping_address"]);
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header>
        <Modal.Title>Shipping Address</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              value={data.name}
              name="name"
              onChange={(e) => setData({ ...data, name: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="phone">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={data.phone}
              onChange={(e) => setData({ ...data, phone: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="provinces">
            <Form.Label>Provinces</Form.Label>
            <Form.Select
              disabled={isLoadingProvinces}
              onChange={(e) => setSelectedProvinceId(Number(e.target.value))}
            >
              <option>Choose a Province</option>
              {provinces?.map((province) => (
                <option
                  key={`province-${province.id}`}
                  value={province.id}
                  selected={province.id === selectedProvinceId}
                >
                  {province.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="cities">
            <Form.Label>Cities</Form.Label>
            <Form.Select
              onChange={(e) =>
                setData({ ...data, city_id: Number(e.target.value) })
              }
              disabled={isLoadingCities || !selectedProvinceId}
            >
              <option>Choose a City</option>
              {cities?.map((city) => (
                <option
                  key={`city-${city.id}`}
                  value={city.id}
                  selected={city.id === data.city_id}
                >
                  {city.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="district">
            <Form.Label>District</Form.Label>
            <Form.Control
              type="text"
              name="district"
              value={data.district}
              onChange={(e) => setData({ ...data, district: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="postal_code">
            <Form.Label>Postal Code</Form.Label>
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
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              as={"textarea"}
              rows={2}
              name="address"
              onChange={(e) => setData({ ...data, address: e.target.value })}
              value={data.address}
            />
            <Form.Text className="text-muted">
              Please enter your complete address including house number, street
              name, and any other relevant details.
            </Form.Text>
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleClose} className="me-2">
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default DeliveryAddressModal;
