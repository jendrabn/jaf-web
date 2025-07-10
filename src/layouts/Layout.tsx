import { type PropsWithChildren, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Layout({ children }: PropsWithChildren) {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <>
      <Navbar />
      <main className="py-4 py-lg-5">{children}</main>
      <Footer />
    </>
  );
}

export default Layout;
