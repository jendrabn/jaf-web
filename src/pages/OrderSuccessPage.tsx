import { useEffect } from "react";
import Layout from "../layouts/Layout";
import { useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import type { OrderSuccessTypes } from "../types/order";
import { formatDate } from "../utils/functions";

function OrderSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!location.state) {
      toast.info("Please place an order first.");

      navigate("/cart", { replace: true });
    }
  }, [location.state, navigate]);

  const {
    id,
    payment_info,
    payment_due_date,
    payment_method,
    total_amount,
    created_at,
  }: OrderSuccessTypes = location.state || {};
  return (
    <Layout title="Order Success">
      <div className="container py-5">
        <div className="text-center mb-4">
          <h1 className="display-5 fw-bold">Order Successful</h1>
          <p className="text-muted">
            Thank you for your purchase! Below are your order details.
          </p>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card mb-3">
              <div className="card-body text-center">
                <h5 className="card-title">Order Details</h5>
                <p className="card-text">
                  Order ID: <strong>{id}</strong>
                </p>
                <p className="card-text">
                  Total Amount: <strong>${total_amount}</strong>
                </p>
                <p className="card-text">
                  Order Date: <strong>{formatDate(created_at)}</strong>
                </p>
              </div>
            </div>

            <div className="card mb-3">
              <div className="card-body text-center">
                <h5 className="card-title">Payment Information</h5>
                <p className="card-text">
                  Payment Method: <strong>{payment_method}</strong>
                </p>
                <p className="card-text">
                  Bank Name: <strong>{payment_info?.name}</strong>
                </p>
                <p className="card-text">
                  Bank Code: <strong>{payment_info?.code}</strong>
                </p>
                <p className="card-text">
                  Account Name: <strong>{payment_info?.account_name}</strong>
                </p>
                <p className="card-text">
                  Account Number:{" "}
                  <strong>{payment_info?.account_number}</strong>
                </p>
                <p className="card-text text-danger">
                  Payment Due Date:{" "}
                  <strong>{formatDate(payment_due_date)}</strong>
                </p>
              </div>
            </div>

            <div className="text-center mt-4">
              <a href="/orders" className="btn btn-primary">
                View My Orders
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default OrderSuccessPage;
