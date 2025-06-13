import { type PropsWithChildren, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Helmet } from "react-helmet-async";
import Footer from "../components/Footer";

interface LayoutProps extends PropsWithChildren {
  title?: string;
  description?: string;
}

function Layout({ children, title, description }: LayoutProps) {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <>
      <Helmet>
        {title ? (
          <title>
            {title} | {import.meta.env.VITE_APP_NAME}
          </title>
        ) : (
          <title>{import.meta.env.VITE_APP_NAME}</title>
        )}

        {description && <meta name="description" content={description} />}
      </Helmet>
      <Navbar />
      <main className="py-4 py-lg-5">{children}</main>
      <Footer />
    </>
  );
}

export default Layout;
