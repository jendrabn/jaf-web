import { Button, Card } from "react-bootstrap";
import { useCheckoutState } from "../../contexts/CheckoutContext";

interface DeliveryAddressProps {
  className?: string;
  handleShowAddressModal: () => void;
}

function DeliveryAddress({
  className,
  handleShowAddressModal,
}: DeliveryAddressProps) {
  const { address } = useCheckoutState();

  return (
    <Card className={className}>
      <Card.Body>
        <Card.Title>Delivery Address</Card.Title>
        <div className="d-flex align-items-center">
          {address ? (
            <address className="flex-grow-1 mb-0 pe-2">
              <span className="fw-bold">
                {`${address?.name} (${address?.phone})`}
              </span>
              <br />
              {address?.address} <br />
              {`${address?.district}, ${address?.city?.type} ${address?.city?.name}, ${address?.province?.name}, ${address.postal_code}`}
            </address>
          ) : (
            <p className="text-muted text-center flex-grow-1 mb-0">
              No delivery address
            </p>
          )}
          <div>
            <Button variant="outline-primary" onClick={handleShowAddressModal}>
              <i className="fa-solid fa-pen-to-square me-1"></i>Change
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default DeliveryAddress;
