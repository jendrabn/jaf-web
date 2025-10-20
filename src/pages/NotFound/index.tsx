import { env } from "@/utils/config";
import { Card } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { Link } from "react-router";

const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>Halaman Tidak Ditemukan | {env.APP_NAME}</title>
        <meta
          name="description"
          content="Halaman yang Anda cari tidak tersedia."
        />
      </Helmet>

      <main className="d-flex align-items-center min-dvh-100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-6 col-lg-4">
              <Card>
                <Card.Body className="text-center px-4 py-5">
                  <h1
                    className="card-title mb-3 fw-bold"
                    style={{ letterSpacing: "10px" }}
                  >
                    404
                  </h1>
                  <Card.Text>Halaman Tidak Ditemukan</Card.Text>
                  <Card.Text>Halaman yang Anda cari tidak tersedia.</Card.Text>
                  <Card.Text>
                    Silakan periksa kembali URL atau kembali ke halaman utama.
                  </Card.Text>

                  <Link to="/" className="btn btn-primary">
                    <i className="bi bi-arrow-left me-2"></i>Kembali ke Beranda
                  </Link>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default NotFoundPage;
