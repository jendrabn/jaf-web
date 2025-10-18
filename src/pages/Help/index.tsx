import { Helmet } from "react-helmet-async";
import Layout from "@/components/layouts/Layout";
import CustomerServiceContact from "@/components/parts/CustomerServiceContact";
import { env } from "@/utils/config";

function HelpPage() {
  return (
    <Layout>
      <Helmet>
        <meta name="description" content="Pusat Bantuan JAF Parfums" />
        <title>Pusat Bantuan | {env.APP_NAME}</title>
      </Helmet>

      <div className="container">
        <h1 className="mb-5 fw-bold text-center">Pusat Bantuan</h1>

        <div className="row g-4">
          <div className="col-md-6">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Panduan Penggunaan</h5>
                <ul className="mb-0">
                  <li>Cara mendaftar dan login akun</li>
                  <li>Cara mencari dan membeli parfum</li>
                  <li>Cara menambah produk ke keranjang</li>
                  <li>Cara melakukan pembayaran</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Pelacakan & Pengiriman</h5>
                <ul className="mb-0">
                  <li>Cara melacak status pesanan dan nomor resi</li>
                  <li>Estimasi waktu pengiriman 2-5 hari kerja</li>
                  <li>Jasa ekspedisi: JNE, J&T, SiCepat, dll</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Pengembalian & Penukaran</h5>
                <ul className="mb-0">
                  <li>Retur/tukar produk maksimal 2x24 jam setelah diterima</li>
                  <li>Hubungi customer service untuk proses retur</li>
                  <li>Produk harus dalam kondisi asli & belum digunakan</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Bantuan Lainnya</h5>
                <ul className="mb-0">
                  <li>Cara reset password & update profil</li>
                  <li>Informasi promo & diskon</li>
                  <li>Layanan gift wrapping & pesan hadiah</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <CustomerServiceContact />
        </div>
      </div>
    </Layout>
  );
}

export default HelpPage;
