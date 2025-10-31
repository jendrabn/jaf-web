import { Link, NavLink } from "react-router";
import SearchBar from "./SearchBar";
import { useAuthState } from "@/contexts/AuthContext";
import {
  useFetchProductBrands,
  useFetchProductCategories,
} from "@/hooks/api/product";
import { useLogout } from "@/hooks/api/auth";
import { useGetUnreadCount } from "@/hooks/api/notification/useFetchNotifications";
import type { MouseEvent } from "react";
import { useCartState } from "@/contexts/CartContext";
import { removeAuthToken } from "@/utils/functions";
import ThemeToggle from "@/components/parts/ThemeToggle";
import Logo from "@/components/parts/Logo";
import { Image } from "react-bootstrap";
import { env } from "@/utils/config";

const Navbar = () => {
  const { isAuthenticated, user } = useAuthState();

  const logoutMutation = useLogout();

  const { data: categories } = useFetchProductCategories();
  const { data: brands } = useFetchProductBrands();
  const { carts } = useCartState();
  const { data: unreadCount } = useGetUnreadCount();
  const unreadTotal = typeof unreadCount === "number" ? unreadCount : 0;

  const handleLogout = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    logoutMutation.mutate(undefined, {
      onSettled: () => {
        removeAuthToken();

        window.location.reload();
      },
    });
  };

  return (
    <>
      <a
        href="#main-content"
        className="skip-link"
        onClick={() => {
          const el = document.getElementById("main-content");
          if (el) {
            el.focus();
          }
        }}
      >
        Lewati ke konten utama
      </a>

      <header className="sticky-top">
        <div className="d-none d-lg-block py-2 border-bottom topbar">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center small">
              <div>
                <NavLink className="me-3 text-muted" to="/about">
                  Tentang Kami
                </NavLink>
                <NavLink className="me-3 text-muted" to="/contact">
                  Kontak
                </NavLink>
                <NavLink className="me-3 text-muted" to="/help">
                  Bantuan
                </NavLink>
                <NavLink className="text-muted" to="/faq">
                  FAQs
                </NavLink>
              </div>
              {env.FREE_SHIPPING_100K && env.FREE_SHIPPING_100K === "true" && (
                <div>
                  <p className="mb-0 text-muted">
                    Gratis ongkir untuk semua pesanan di atas 100k
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <nav className="navbar navbar-expand-lg border-bottom">
          <div className="container">
            <NavLink className="navbar-brand d-none d-md-block" to="/">
              <Logo className="img-fluid" />
            </NavLink>

            <SearchBar className="flex-grow-1 me-2 d-lg-none" />

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse align-items-center"
              id="navbarSupportedContent"
            >
              <SearchBar className="mx-4 d-none d-lg-block" />

              <ul className="navbar-nav mb-2 mb-lg-0 gap-1">
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      "nav-link " + (isActive ? "active" : "")
                    }
                    to="/"
                  >
                    Home
                  </NavLink>
                </li>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Kategori
                  </a>
                  <ul className="dropdown-menu">
                    {categories?.map((category) => (
                      <li key={category.id}>
                        <Link
                          className="dropdown-item"
                          to={`/products?category_id=${category.id}`}
                        >
                          {category.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Brand
                  </a>
                  <ul className="dropdown-menu">
                    {brands?.map((brand) => (
                      <li key={brand.id}>
                        <Link
                          className="dropdown-item"
                          to={`/products?brand_id=${brand.id}`}
                        >
                          {brand.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      "nav-link " + (isActive ? "active" : "")
                    }
                    to="/products"
                  >
                    Produk
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      "nav-link " + (isActive ? "active" : "")
                    }
                    to="/blog"
                  >
                    Blog
                  </NavLink>
                </li>
              </ul>

              <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
                {isAuthenticated ? (
                  <>
                    <li className="nav-item me-2">
                      <NavLink
                        className="nav-link"
                        to={"/account/notifications"}
                        title="Notifikasi"
                      >
                        <div className="position-relative d-inline-block">
                          <i className="bi bi-bell fs-5"></i>
                          {unreadTotal > 0 && (
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                              {unreadTotal > 99 ? "99+" : unreadTotal}
                            </span>
                          )}
                        </div>
                      </NavLink>
                    </li>
                    <li className="nav-item me-2">
                      <NavLink
                        className="nav-link"
                        to={"/cart"}
                        title="Keranjang Belanja"
                      >
                        <div className="position-relative d-inline-block">
                          <i className="bi bi-cart2 fs-5"></i>
                          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
                            {carts?.length}
                          </span>
                        </div>
                      </NavLink>
                    </li>
                    <li className="nav-item dropdown">
                      <a
                        className="nav-link dropdown-toggle"
                        href="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        title="Akun Saya"
                      >
                        <Image
                          src={user?.avatar}
                          width={32}
                          height={32}
                          roundedCircle
                          className="border border-primary border-2"
                        />
                      </a>

                      <ul
                        className="dropdown-menu dropdown-menu-end p-2"
                        style={{ minWidth: 225 }}
                      >
                        <li>
                          <Link
                            to={"/account/profile"}
                            className="dropdown-item"
                          >
                            <div className="d-flex align-items-center">
                              <Image
                                src={user?.avatar}
                                width={35}
                                height={35}
                                roundedCircle
                                className="border border-2 border-primary"
                              />

                              <span className="ms-2 fw-medium">
                                {user?.name}
                              </span>
                            </div>
                          </Link>
                        </li>

                        <li>
                          <hr className="dropdown-divider" />
                        </li>

                        <li>
                          <Link
                            className="dropdown-item text-muted fs-6 d-flex gap-3"
                            to="/account/profile"
                          >
                            <i className="bi bi-gear"></i>Pengaturan Akun
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item text-muted fs-6 d-flex gap-3"
                            to="/account/orders"
                          >
                            <i className="bi bi-box-seam"></i>Pesanan Saya
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item text-muted fs-6 d-flex gap-3 position-relative"
                            to="/account/notifications"
                          >
                            <i className="bi bi-bell"></i>Notifikasi
                            {unreadCount && unreadCount > 0 && (
                              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger ms-1">
                                {unreadCount > 99 ? "99+" : unreadCount}
                              </span>
                            )}
                          </Link>
                        </li>
                        <li>
                          <a
                            href={`https://wa.me/${env.STORE_WHATSAPP}?text=Hai,%20Admin%20JAF,%20Saya%20ingin%20bertanya%20tentang%20sesuatu%20bisakah%20kamu%20membantu?`}
                            className="dropdown-item text-muted fs-6 d-flex gap-3"
                            target="_blank"
                            rel="noreferrer"
                          >
                            <i className="bi bi-headset"></i>Chat Admin JAF
                          </a>
                        </li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li>
                          <Link
                            className="dropdown-item text-muted fs-6 d-flex gap-3"
                            onClick={handleLogout}
                            to="/"
                          >
                            <i className="bi bi-box-arrow-right"></i>Keluar Akun
                          </Link>
                        </li>
                      </ul>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item d-flex flex-column flex-lg-row gap-2">
                      <Link
                        className="btn btn-outline-primary px-lg-3 py-lg-1 rounded-pill"
                        to="/auth/login"
                      >
                        Masuk
                      </Link>

                      <Link
                        className="btn btn-primary text-white px-lg-3 py-lg-1 rounded-pill"
                        to="/auth/register"
                      >
                        Daftar
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>

            <div className="position-relative d-none d-lg-block">
              <ThemeToggle className="position-absolute top-50 start-50 ms-5 translate-middle" />
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
