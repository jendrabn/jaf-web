import { Link, NavLink } from "react-router";
import SearchBar from "./SearchBar";
import { useAuthState } from "../../contexts/AuthContext";
import {
  useFetchProductBrands,
  useFetchProductCategories,
} from "../../hooks/api/product";
import { useLogout } from "../../hooks/api/auth";
import type { MouseEvent } from "react";
import { useCartState } from "../../contexts/CartContext";
import { removeAuthToken } from "../../utils/functions";

export default function Navbar() {
  const { isAuthenticated, user } = useAuthState();

  const logoutMutation = useLogout();

  const { data: categories } = useFetchProductCategories();
  const { data: brands } = useFetchProductBrands();
  const { carts } = useCartState();

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
    <header className="sticky-top bg-body-tertiary">
      <div className="top__bar d-none d-lg-block">
        <div className="container">
          <div className="d-flex justify-content-between">
            <div className="top__bar-left">
              <NavLink className="me-3" to="/about">
                Tentang Kami
              </NavLink>
              <NavLink className="me-3" to="/contact">
                Kontak
              </NavLink>
              <NavLink className="me-3" to="/help">
                Bantuan
              </NavLink>
              <NavLink to="/faq">FAQs</NavLink>
            </div>
            <div className="top__bar-right">
              <p>Gratis ongkir untuk semua pesanan di atas 100k</p>
            </div>
          </div>
        </div>
      </div>
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <NavLink className="navbar-brand d-none d-md-block" to="/">
            <img src="/img/logo.png" alt="Logo" className="img-fluid" />
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
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <SearchBar className="me-2 d-none d-lg-block" />
            <ul className="navbar-nav mb-2 mb-lg-0">
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
                  to="/blogs"
                >
                  Blog
                </NavLink>
              </li>
            </ul>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {isAuthenticated ? (
                <>
                  <li className="nav-item me-2">
                    <NavLink className="nav-link" to={"/cart"}>
                      <div className="position-relative">
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
                    >
                      <i className="bi bi-person fs-5"></i>
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <h6 className="dropdown-header">Hai, {user?.name}</h6>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/account/profile">
                          <i className="bi bi-person me-2"></i> Akun Saya
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/account/orders">
                          <i className="bi bi-box-seam me-2"></i> Pesanan Saya
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/account/wishlist">
                          <i className="bi bi-heart me-2"></i> Wishlist Saya
                        </Link>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <Link
                          className="dropdown-item text-danger"
                          onClick={handleLogout}
                          to="/"
                        >
                          <i className="bi bi-box-arrow-right me-2"></i>
                          Logout
                        </Link>
                      </li>
                    </ul>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/auth/login">
                      Login
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/auth/register">
                      Register
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
