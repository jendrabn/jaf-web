import { Helmet } from "react-helmet-async";
import AccountLayout from "@/components/layouts/AccountLayout";
import { env } from "@/utils/config";

const AddressPage = () => {
  return (
    <AccountLayout title="Alamat">
      <Helmet>
        <title>Alamat | {env.APP_NAME}</title>
        <meta
          name="description"
          content="Kelola dan perbarui alamat pengiriman Anda untuk pengalaman belanja yang lebih mudah."
        />
      </Helmet>

      {/* coming soon feature with icon*/}
      <div className="text-center py-5">
        <i
          className="bi bi-geo-alt mb-3 text-muted"
          style={{ fontSize: "64px" }}
        ></i>
        <h3 className="mb-3">Fitur ini segera hadir!</h3>
        <p className="text-muted">
          Kami sedang mengerjakan fitur pengelolaan alamat. Nantikan pembaruan
          selanjutnya.
        </p>
      </div>
    </AccountLayout>
  );
};

export default AddressPage;
