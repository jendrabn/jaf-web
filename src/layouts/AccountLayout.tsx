import { type PropsWithChildren, useEffect } from "react";
import { NavLink } from "react-router";
import { Helmet } from "react-helmet-async";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Accordion, Nav } from "react-bootstrap";

type AuthLayoutProps = PropsWithChildren & {
  title: string;
  description?: string;
};

const NavAccount = () => {
  return (
    <Nav
      defaultActiveKey="/account/profile"
      className="flex-column nav__account"
    >
      <Nav.Item>
        <NavLink
          to="/account/profile"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
        >
          <i className="fa-solid fa-angle-right me-2"></i> My Profile
        </NavLink>
      </Nav.Item>

      <Nav.Item>
        <NavLink
          to="/account/orders"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
        >
          <i className="fa-solid fa-angle-right me-2"></i> My Orders
        </NavLink>
      </Nav.Item>

      <Nav.Item>
        <NavLink
          to="/account/wishlist"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
        >
          <i className="fa-solid fa-angle-right me-2"></i> My Wishlist
        </NavLink>
      </Nav.Item>

      <Nav.Item>
        <NavLink
          to="/account/address"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
        >
          <i className="fa-solid fa-angle-right me-2"></i> My Addresses
        </NavLink>
      </Nav.Item>

      <Nav.Item>
        <NavLink
          to="/account/change-password"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
        >
          <i className="fa-solid fa-angle-right me-2"></i> Change Password
        </NavLink>
      </Nav.Item>
    </Nav>
  );
};

function AccountLayout({ children, title, description }: AuthLayoutProps) {
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
        <title>
          {title} | {import.meta.env.VITE_APP_NAME}
        </title>

        {description && <meta name="description" content={description} />}
      </Helmet>

      <Navbar />

      <main className="py-3 py-md-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-2 mb-3 ">
              {/* Mobile */}
              <Accordion
                defaultActiveKey="0"
                className="mb-3 d-lg-none accordion__menu-account"
              >
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Account Menu</Accordion.Header>
                  <Accordion.Body>
                    <NavAccount />
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>

              {/* Desktop */}
              <div className="d-none d-lg-block">
                <NavAccount />
              </div>
            </div>

            <div className="col-lg-10">
              <div className="card border-0 shadow bg-text-white">
                <h5 className="card-header">{title}</h5>
                <div className="card-body p-md-5">{children}</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default AccountLayout;
