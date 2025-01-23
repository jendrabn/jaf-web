import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage.tsx";
import "bootstrap";
import "./styles/style.scss";
import ProductDetailPage from "./pages/ProductDetailPage.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import ProductPage from "./pages/ProductPage.tsx";
import { toast, ToastContainer } from "react-toastify";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage.tsx";
import LoginPage from "./pages/auth/LoginPage.tsx";
import RegisterPage from "./pages/auth/RegisterPage.tsx";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import "bootstrap";
import "./styles/style.scss";
import CartPage from "./pages/CartPage.tsx";
import WishlistPage from "./pages/account/WishlistPage.tsx";
import ProfilePage from "./pages/account/ProfilePage.tsx";
import OrderPage from "./pages/account/OrderPage.tsx";
import ChangePassword from "./pages/account/ChangePasswordPage.tsx";
import AddressPage from "./pages/account/AddressPage.tsx";
import BlogPage from "./pages/BlogPage.tsx";
import BlogDetailPage from "./pages/BlogDetailPage.tsx";
import { HelmetProvider } from "react-helmet-async";
import { AxiosError } from "axios";
import { CartProvider } from "./contexts/CartContext.tsx";
import CheckoutPage from "./pages/CheckoutPage.tsx";
import OrderSuccessPage from "./pages/OrderSuccessPage.tsx";
import OrderDetailPage from "./pages/account/OrderDetailPage.tsx";
import { WishlistProvider } from "./contexts/WishlistContext.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
    mutations: {
      onError(error) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data?.message || error.message);
        } else {
          toast.error(error.message || "Something went wrong");
        }
      },
      retry: false,
    },
  },
});

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ToastContainer
          limit={10}
          theme="light"
          position="top-right"
          autoClose={3000}
          newestOnTop
        />
        <ReactQueryDevtools initialIsOpen={true} />
        <BrowserRouter>
          <HelmetProvider>
            <AuthProvider>
              <CartProvider>
                <WishlistProvider>
                  <Routes>
                    <Route path="*" element={<NotFoundPage />} />
                    <Route index element={<HomePage />} />
                    <Route path="products" element={<ProductPage />} />
                    <Route
                      path="products/:productId"
                      element={<ProductDetailPage />}
                    />
                    <Route path="blogs" element={<BlogPage />} />
                    <Route path="blogs/:slug" element={<BlogDetailPage />} />

                    <Route element={<ProtectedRoute />}>
                      <Route path="cart" element={<CartPage />} />
                      <Route path="checkout" element={<CheckoutPage />} />
                      <Route
                        path="order-success"
                        element={<OrderSuccessPage />}
                      />
                      <Route path="account/profile" element={<ProfilePage />} />
                      <Route path="account/orders" element={<OrderPage />} />
                      <Route
                        path="account/orders/:id"
                        element={<OrderDetailPage />}
                      />
                      <Route
                        path="account/wishlist"
                        element={<WishlistPage />}
                      />
                      <Route path="account/address" element={<AddressPage />} />
                      <Route
                        path="account/change-password"
                        element={<ChangePassword />}
                      />
                    </Route>

                    {/* Auth */}
                    <Route path="auth/login" element={<LoginPage />} />
                    <Route path="auth/register" element={<RegisterPage />} />
                    <Route
                      path="auth/reset-password"
                      element={<ResetPasswordPage />}
                    />
                    <Route
                      path="auth/forgot-password"
                      element={<ForgotPasswordPage />}
                    />
                  </Routes>
                </WishlistProvider>
              </CartProvider>
            </AuthProvider>
          </HelmetProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </>
  );
}

export default App;
