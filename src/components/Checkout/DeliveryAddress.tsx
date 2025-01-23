import { ShippingAddressTypes } from "../../types/checkout";
import { Button } from "react-bootstrap";

interface DeliveryAddressProps {
  address: ShippingAddressTypes;
  className?: string;
  handleShowAddressModal: () => void;
}

function DeliveryAddress({
  address,
  className,
  handleShowAddressModal,
}: DeliveryAddressProps) {
  return (
    <div className={`card ${className}`}>
      <div className="card-body">
        <h5 className="card-title mb-3">Delivery Address</h5>
        <div className="d-flex flex-row align-items-center">
          <address className="flex-grow-1 mb-0 pe-2">
            {address && (
              <>
                <span className="fw-bold">
                  {`${address?.name} (${address?.phone})`}
                </span>
                <br />
                {address?.address} <br />
                {`${address?.district}, ${address?.city?.type} ${address?.city?.name}, ${address?.province?.name}, ${address.postal_code}`}
              </>
            )}
          </address>
          <div>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={handleShowAddressModal}
            >
              <i className="fa-solid fa-pen-to-square"></i>
              Change
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeliveryAddress;
