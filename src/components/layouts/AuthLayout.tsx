import { Link, Navigate } from "react-router";
import { useAuthState } from "../../contexts/AuthContext";
import Logo from "../parts/Logo";
import { useLocation } from "react-router";
import { type PropsWithChildren } from "react";
import Loading from "../ui/Loading";

function AuthLayout({
  children,
  title,
}: PropsWithChildren & { title?: string }) {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuthState();

  if (isLoading) {
    return <Loading className="min-dvh-100" />;
  }

  if (isAuthenticated) {
    return <Navigate to={location.state?.from?.pathname || "/"} />;
  }

  return (
    <main className="d-flex align-items-center min-vh-100 py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-4">
            <Link to="/" className="mb-4 d-block text-center">
              <figure style={{ maxWidth: 200 }} className="mx-auto">
                <Logo className="img-fluid w-100" />
              </figure>
            </Link>

            <div className="card bg-body shadow">
              <div className="card-body px-4 py-5">
                <h4 className="card-title mb-4 text-center">{title}</h4>
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AuthLayout;
