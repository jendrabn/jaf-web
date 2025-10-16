import { NavLink } from "react-router";

const Footer = () => {
  return (
    <footer className="footer bg-dark text-white mt-auto">
      <div className="container">
        <div className="row pt-5">
          <div className="col-lg-4 col-md-12 mb-5 pr-3 pr-xl-5">
            <h5 className=" text-uppercase mb-4">Visit Us</h5>
            <p className="mb-4">
              Jl. Letjen Panjaitan No. 147, Gumuk Kerang, Kel. Sumbersari, Kec.
              Sumbersari, Kab. Jember, Jawa Timur 68121
            </p>
            <p className="mb-2">
              <i className="bi bi-envelope-fill me-3"></i>cs.jaf.co.id
            </p>
            <p className="mb-2">
              <i className="bi bi-whatsapp me-3"></i>+62 811 3132 502
            </p>
            <p className="mb-0">
              <i className="bi bi-telephone-fill me-3"></i>0331 322070
            </p>
          </div>
          <div className="col-lg-8 col-md-12">
            <div className="row">
              <div className="col-md-4 mb-5">
                <h5 className=" text-uppercase mb-4">Quick Shop</h5>
                <div className="d-flex flex-column justify-content-start">
                  <a className=" mb-2" href="#">
                    <i className="bi bi-chevron-right me-2"></i>Home
                  </a>
                  <a className=" mb-2" href="#">
                    <i className="bi bi-chevron-right me-2"></i>Our Shop
                  </a>
                  <a className=" mb-2" href="#">
                    <i className="bi bi-chevron-right me-2"></i>Shop Detail
                  </a>
                  <a className=" mb-2" href="#">
                    <i className="bi bi-chevron-right me-2"></i>Shopping Cart
                  </a>
                  <a className=" mb-2" href="#">
                    <i className="bi bi-chevron-right me-2"></i>Checkout
                  </a>
                  <a className="" href="#">
                    <i className="bi bi-chevron-right me-2"></i>Contact Us
                  </a>
                </div>
              </div>
              <div className="col-md-4 mb-5">
                <h5 className=" text-uppercase mb-4">My Account</h5>
                <div className="d-flex flex-column justify-content-start">
                  <a className=" mb-2" href="#">
                    <i className="bi bi-chevron-right me-2"></i>Home
                  </a>
                  <a className=" mb-2" href="#">
                    <i className="bi bi-chevron-right me-2"></i>Our Shop
                  </a>
                  <a className=" mb-2" href="#">
                    <i className="bi bi-chevron-right me-2"></i>Shop Detail
                  </a>
                  <a className=" mb-2" href="#">
                    <i className="bi bi-chevron-right me-2"></i>Shopping Cart
                  </a>
                  <a className=" mb-2" href="#">
                    <i className="bi bi-chevron-right me-2"></i>Checkout
                  </a>
                  <a className="" href="#">
                    <i className="bi bi-chevron-right me-2"></i>Contact Us
                  </a>
                </div>
              </div>
              <div className="col-md-4 mb-5">
                <h5 className=" text-uppercase mb-4">Follow Us</h5>
                <div className="d-flex" style={{ fontSize: "1.5rem" }}>
                  <NavLink className="me-3" to={"/"}>
                    <i className="bi bi-facebook"></i>
                  </NavLink>
                  <NavLink className="me-3" to={"/"}>
                    <i className="bi bi-twitter-x"></i>
                  </NavLink>
                  <NavLink className="me-3" to={"/"}>
                    <i className="bi bi-instagram"></i>
                  </NavLink>
                  <NavLink to={"/"}>
                    <i className="bi bi-tiktok"></i>
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="row border-top py-3"
          style={{ borderColor: "rgba(256, 256, 256, .1) !important" }}
        >
          <div className="col-md-6 px-xl-0">
            <p className="mb-md-0 text-center text-md-start ">
              © 2024 <a href="#">jaf.co.id</a>. All Rights Reserved.
            </p>
          </div>
          <div className="col-md-6 px-xl-0 text-center text-md-end"></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
