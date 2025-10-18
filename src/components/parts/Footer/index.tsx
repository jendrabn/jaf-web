import { env } from "@/utils/config";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="footer bg-dark text-white mt-auto">
      <div className="container">
        <div className="row pt-5">
          <div className="col-lg-4 col-md-12 mb-5 pr-3 pr-xl-5">
            <h5 className=" text-uppercase mb-4">Kunjungi Kami</h5>
            <p className="mb-4">{env.STORE_ADDRESS}</p>
            <p className="mb-2">
              <i className="bi bi-envelope-fill me-3"></i>
              {env.STORE_EMAIL}
            </p>
            <p className="mb-2">
              <i className="bi bi-whatsapp me-3"></i>
              {env.STORE_WHATSAPP}
            </p>
            <p className="mb-0">
              <i className="bi bi-telephone-fill me-3"></i>
              {env.STORE_PHONE}
            </p>
          </div>
          <div className="col-lg-8 col-md-12">
            <div className="row">
              <div className="col-md-4 mb-5">
                <h5 className=" text-uppercase mb-4">Belanja Cepat</h5>
                <div className="d-flex flex-column justify-content-start">
                  <Link className=" mb-2" to="/">
                    <i className="bi bi-chevron-right me-2"></i>Beranda
                  </Link>
                  <Link className=" mb-2" to="/products">
                    <i className="bi bi-chevron-right me-2"></i>Produk
                  </Link>
                  <Link className=" mb-2" to="/blog">
                    <i className="bi bi-chevron-right me-2"></i>Blog
                  </Link>
                  <Link className=" mb-2" to="/contact">
                    <i className="bi bi-chevron-right me-2"></i>Kontak
                  </Link>
                  <Link className=" mb-2" to="/about">
                    <i className="bi bi-chevron-right me-2"></i>Tentang Kami
                  </Link>
                  <Link className=" mb-2" to="/faq">
                    <i className="bi bi-chevron-right me-2"></i>FAQ
                  </Link>
                  <Link className=" mb-2" to="/help">
                    <i className="bi bi-chevron-right me-2"></i>Bantuan
                  </Link>
                  <Link className="" to="/cart">
                    <i className="bi bi-chevron-right me-2"></i>Keranjang
                  </Link>
                </div>
              </div>
              <div className="col-md-4 mb-5">
                <h5 className=" text-uppercase mb-4">Akun Saya</h5>
                <div className="d-flex flex-column justify-content-start">
                  <Link className=" mb-2" to="/auth/login">
                    <i className="bi bi-chevron-right me-2"></i>Masuk
                  </Link>
                  <Link className=" mb-2" to="/auth/register">
                    <i className="bi bi-chevron-right me-2"></i>Daftar
                  </Link>
                  <Link className=" mb-2" to="/account/profile">
                    <i className="bi bi-chevron-right me-2"></i>Profil
                  </Link>
                  <Link className=" mb-2" to="/account/orders">
                    <i className="bi bi-chevron-right me-2"></i>Pesanan
                  </Link>
                  <Link className=" mb-2" to="/account/wishlist">
                    <i className="bi bi-chevron-right me-2"></i>Wishlist
                  </Link>
                  <Link className=" mb-2" to="/account/address">
                    <i className="bi bi-chevron-right me-2"></i>Alamat
                  </Link>
                  <Link className="" to="/account/change-password">
                    <i className="bi bi-chevron-right me-2"></i>Ubah Kata Sandi
                  </Link>
                </div>
              </div>
              <div className="col-md-4 mb-5">
                <h5 className=" text-uppercase mb-4">Ikuti Kami</h5>
                <div className="d-flex" style={{ fontSize: "1.5rem" }}>
                  {env.FACEBOOK_URL && (
                    <a
                      className="me-3"
                      href={env.FACEBOOK_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                    >
                      <i className="bi bi-facebook"></i>
                    </a>
                  )}
                  {env.TWITTER_URL && (
                    <a
                      className="me-3"
                      href={env.TWITTER_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Twitter/X"
                    >
                      <i className="bi bi-twitter"></i>
                    </a>
                  )}
                  {env.INSTAGRAM_URL && (
                    <a
                      className="me-3"
                      href={env.INSTAGRAM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                    >
                      <i className="bi bi-instagram"></i>
                    </a>
                  )}
                  {env.YOUTUBE_URL && (
                    <a
                      className="me-3"
                      href={env.YOUTUBE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="YouTube"
                    >
                      <i className="bi bi-youtube"></i>
                    </a>
                  )}
                  {env.TIKTOK_URL && (
                    <a
                      className="me-3"
                      href={env.TIKTOK_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="TikTok"
                    >
                      <i className="bi bi-tiktok"></i>
                    </a>
                  )}
                  {env.LINKEDIN_URL && (
                    <a
                      className="me-3"
                      href={env.LINKEDIN_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                    >
                      <i className="bi bi-linkedin"></i>
                    </a>
                  )}
                  {env.TELEGRAM_URL && (
                    <a
                      className="me-3"
                      href={env.TELEGRAM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Telegram"
                    >
                      <i className="bi bi-telegram"></i>
                    </a>
                  )}
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
              © {new Date().getFullYear()}{" "}
              {env.APP_URL ? (
                <a
                  href={env.APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white text-decoration-underline"
                >
                  {new URL(env.APP_URL).host}
                </a>
              ) : (
                <span>{env.APP_NAME}</span>
              )}{" "}
              . Hak Cipta Dilindungi.
            </p>
          </div>
          <div className="col-md-6 px-xl-0 text-center text-md-end"></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
