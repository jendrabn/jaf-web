import { type PropsWithChildren, useEffect } from "react";
import Navbar from "@/components/parts/Navbar";
import Footer from "@/components/parts/Footer";

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
      <main
        id="main-content"
        className="main-content"
        role="main"
        tabIndex={-1}
      >
        {children}
      </main>
      <Footer />
    </>
  );
}

export default Layout;
