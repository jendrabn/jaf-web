import { Helmet } from "react-helmet-async";
import AccountLayout from "../../layouts/AccountLayout";

function AddressPage() {
  return (
    <AccountLayout title="Alamat">
      <Helmet>
        <title>Alamat | {import.meta.env.VITE_APP_NAME}</title>
      </Helmet>
    </AccountLayout>
  );
}

export default AddressPage;
