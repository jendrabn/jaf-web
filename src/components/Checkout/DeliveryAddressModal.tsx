import { FormEvent, useState } from "react";
import { useFetchCities, useFetchProvinces } from "../../services/api/region";
import { Button, Form, Modal } from "react-bootstrap";
import { AddressTypes } from "../../types/checkout";
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

    shippingCostMutation.mutate(
      {
        destination: data.city?.id || 0,
        weight: checkout?.total_weight || 0,
      },
      {
        onSuccess(data) {
          dispatch({ type: "SET_SHIPPING_COSTS", payload: data });
          onClose();
        },
      }
    );
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header>
        <Modal.Title>Delivery Address</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <fieldset disabled={shippingCostMutation.isPending}>
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
                <option>Choose a Province</option>
                {provinces?.map((province) => (
                  <option key={`province-${province.id}`} value={province.id}>
                    {province.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="cities">
              <Form.Label>Cities</Form.Label>
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
                <option>Choose a City</option>
                {cities?.map((city) => (
                  <option key={`city-${city.id}`} value={city.id}>
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
                Please enter your complete address including house number,
                street name, and any other relevant details.
              </Form.Text>
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                onClick={handleClose}
                className="me-2"
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {shippingCostMutation.isPending ? "Loading..." : "Save"}
              </Button>
            </div>
          </fieldset>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default DeliveryAddressModal;
