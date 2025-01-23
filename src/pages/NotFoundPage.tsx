import { Helmet } from "react-helmet-async";
import { Link } from "react-router";

function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>404 | {import.meta.env.VITE_APP_NAME}</title>
      </Helmet>

      <section className="d-flex align-items-center min-vh-100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-6 col-lg-4">
              <div className="card bg-gray-100 shadow">
                <div className="card-body px-4 py-5">
                  <h4
                    className="card-title mb-3 text-center fs-1 fw-bold"
                    style={{ letterSpacing: "10px" }}
                  >
                    404
                  </h4>
                  <p className="card-text text-center">Page Not Found</p>
                  <p className="card-text text-center">
                    The page you are looking for does not exist.
                  </p>
                  <p className="card-text text-center">
                    Please check the URL and try again.
                  </p>
                  <div className="d-flex justify-content-center mt-4">
                    <Link to="/" className="btn btn-primary">
                      Go Back Home
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default NotFoundPage;
