import { Button, Card } from "react-bootstrap";
import { useCheckoutState } from "../../contexts/CheckoutContext";
import NoData from "../NoData";

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
        <Card.Title>Alamat Pengiriman</Card.Title>
        <div className="d-flex flex-column flex-lg-row align-items-center">
          {address ? (
            <address className="flex-grow-1 mb-0 pe-2 lh-sm">
              <strong>{`${address?.name} (${address?.phone})`}</strong>
              <br />
              {address?.address} <br />
              {`${address?.subdistrict?.name}, ${address?.district?.name}, ${address?.city?.name}, ${address?.province?.name}, ${address.zip_code}`}
            </address>
          ) : (
            <NoData className="flex-grow-1 w-auto" />
          )}
          <div className="mt-3 mt-lg-0 align-self-start">
            <Button
              variant="outline-primary"
              onClick={handleShowAddressModal}
              size="sm"
            >
              <i className="bi bi-pencil-square"></i> Ubah
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default DeliveryAddress;
