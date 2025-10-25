import { Navigate } from "react-router";
import { useAuthState } from "@/contexts/AuthContext";
import { useLocation } from "react-router";
import { type PropsWithChildren } from "react";
import Loading from "@/components/ui/Loading";
import Navbar from "../parts/Navbar";
import Footer from "../parts/Footer";
import { Card } from "react-bootstrap";

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
    <>
      <Navbar />
      <main
        id="main-content"
        className="main-content"
        role="main"
        tabIndex={-1}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-6 col-lg-4">
              <Card body className="border-0 shadow p-3">
                <h1 className="h3 mb-5 text-center">{title}</h1>
                {children}
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default AuthLayout;
