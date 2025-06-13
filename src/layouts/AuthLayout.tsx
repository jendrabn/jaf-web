import { Link, Navigate } from "react-router";
import { useAuthState } from "../contexts/AuthContext";
import { useLocation } from "react-router";
import { type PropsWithChildren, useEffect } from "react";
import Loading from "../components/Loading";
import { Helmet } from "react-helmet-async";

type AuthLayoutProps = PropsWithChildren & {
  title: string;
  description?: string;
};

function AuthLayout({ children, title, description }: AuthLayoutProps) {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuthState();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  if (isLoading) return <Loading className="min-vh-100" />;

  if (isAuthenticated)
    return <Navigate to={location.state?.from?.pathname || "/"} />;

  return (
    <>
      <Helmet>
        <title>
          {title} | {import.meta.env.VITE_APP_NAME}
        </title>

        {description && <meta name="description" content={description} />}
      </Helmet>

      <main className="d-flex align-items-center min-vh-100 py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-6 col-lg-4">
              <Link to="/" className="mb-4 d-block text-center">
                <figure style={{ maxWidth: 200 }} className="mx-auto">
                  <img
                    src="/img/logo.png"
                    alt="Logo"
                    className="img-fluid w-100"
                  />
                </figure>
              </Link>

              <div className="card bg-gray-100 shadow">
                <div className="card-body px-4 py-5">
                  <h4 className="card-title mb-4 text-center">{title}</h4>
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default AuthLayout;
