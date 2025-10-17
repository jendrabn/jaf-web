import { type PropsWithChildren, useEffect } from "react";
import Navbar from "@/components/parts/Navbar";
import Footer from "@/components/parts/Footer";
import { Accordion, Card, Nav } from "react-bootstrap";
import { NavLink, useLocation } from "react-router";

type AuthLayoutProps = PropsWithChildren & {
  title: string;
};

const NavAccount = () => {
  const location = useLocation();

  const menus = [
    { to: "/account/profile", label: "Profil" },
    { to: "/account/orders", label: "Pesanan" },
    { to: "/account/wishlist", label: "Wishlist" },
    { to: "/account/address", label: "Alamat" },
    { to: "/account/change-password", label: "Ubah Password" },
  ];

  return (
    <Nav
      defaultActiveKey={location.pathname}
      className="flex-column"
      variant="pills"
      as={"ul"}
    >
      {menus.map((menu) => (
        <Nav.Item key={menu.to} as={"li"}>
          <NavLink
            to={menu.to}
            className={({ isActive }) =>
              `nav-link link-body-emphasis fw-medium active-text-white ${
                isActive ? "active" : ""
              }`
            }
          >
            <i className="bi bi-chevron-right me-2"></i> {menu.label}
          </NavLink>
        </Nav.Item>
      ))}
    </Nav>
  );
};

const AccountLayout = ({ children, title }: AuthLayoutProps) => {
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

      <main className="main-content">
        <div className="container">
          <div className="row">
            <div className="col-lg-2 mb-3 ">
              {/* Mobile Only */}
              <Accordion
                defaultActiveKey="0"
                className="mb-3 d-lg-none accordion-menu-account"
              >
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Menu Saya</Accordion.Header>
                  <Accordion.Body>
                    <NavAccount />
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
              {/* End Mobile Only */}

              {/* Desktop Only */}
              <div className="d-none d-lg-block">
                <NavAccount />
              </div>
              {/* End Desktop Only */}
            </div>

            <div className="col-lg-10">
              <Card className="" body border="primary">
                <Card.Header>
                  <h5 className="fw-bold" style={{ letterSpacing: 1.125 }}>
                    {title}
                  </h5>
                </Card.Header>
                <Card.Body>{children}</Card.Body>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default AccountLayout;
