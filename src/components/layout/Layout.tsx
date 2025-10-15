import { type PropsWithChildren, useEffect } from "react";
import Navbar from "../shared/Navbar";
import Footer from "../shared/Footer";

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
      <main className="main-content">{children}</main>
      <Footer />
    </>
  );
}

export default Layout;
