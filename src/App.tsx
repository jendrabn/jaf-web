import { BrowserRouter, Route, Routes } from "react-router";
import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/shared/ProtectedRoute.tsx";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AxiosError } from "axios";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { CartProvider } from "./contexts/CartContext.tsx";
import { WishlistProvider } from "./contexts/WishlistContext.tsx";
import { CheckoutProvider } from "./contexts/CheckoutContext.tsx";
import Loading from "./components/ui/Loading.tsx";
import "bootstrap";
import "./styles/style.scss";

const HomePage = lazy(() => import("./pages/Home/index.tsx"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetail/index.tsx"));
const NotFoundPage = lazy(() => import("./pages/NotFound/index.tsx"));
const ProductPage = lazy(() => import("./pages/Product/index.tsx"));
const ForgotPasswordPage = lazy(
  () => import("./pages/auth/ForgotPassword/index.tsx")
);
const LoginPage = lazy(() => import("./pages/auth/Login/index.tsx"));
const RegisterPage = lazy(() => import("./pages/auth/Register/index.tsx"));
const ResetPasswordPage = lazy(
  () => import("./pages/auth/ResetPassword/index.tsx")
);
const CartPage = lazy(() => import("./pages/Cart/index.tsx"));
const WishlistPage = lazy(() => import("./pages/account/Wishlist/index.tsx"));
const ProfilePage = lazy(() => import("./pages/account/Profile/index.tsx"));
const OrderPage = lazy(() => import("./pages/account/Order/index.tsx"));
const ChangePassword = lazy(
  () => import("./pages/account/ChangePassword/index.tsx")
);
const AddressPage = lazy(() => import("./pages/account/Address/index.tsx"));
const BlogPage = lazy(() => import("./pages/Blog/index.tsx"));
const BlogDetailPage = lazy(() => import("./pages/BlogDetail/index.tsx"));
const CheckoutPage = lazy(() => import("./pages/Checkout/index.tsx"));
const OrderDetailPage = lazy(
  () => import("./pages/account/OrderDetail/index.tsx")
);
const ContactPage = lazy(() => import("./pages/Contact/index.tsx"));
const AboutPage = lazy(() => import("./pages/About/index.tsx"));
const FaqPage = lazy(() => import("./pages/Faq/index.tsx"));
const HelpPage = lazy(() => import("./pages/Help/index.tsx"));

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
      <ToastContainer
        limit={10}
        theme="colored"
        position="top-right"
        closeButton={false}
        autoClose={1000}
        pauseOnHover={false}
        hideProgressBar={true}
        newestOnTop
      />

      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={true} />
        <BrowserRouter>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <CheckoutProvider>
                  <Suspense fallback={<Loading className="min-vh-100" />}>
                    <Routes>
                      <Route path="*" element={<NotFoundPage />} />
                      <Route index element={<HomePage />} />
                      <Route path="products" element={<ProductPage />} />
                      <Route
                        path="products/:productId"
                        element={<ProductDetailPage />}
                      />
                      <Route path="blog" element={<BlogPage />} />
                      <Route path="blog/:slug" element={<BlogDetailPage />} />
                      <Route path="contact" element={<ContactPage />} />
                      <Route path="about" element={<AboutPage />} />
                      <Route path="faq" element={<FaqPage />} />
                      <Route path="help" element={<HelpPage />} />

                      {/* Protected Routes */}
                      <Route element={<ProtectedRoute />}>
                        <Route path="cart" element={<CartPage />} />
                        <Route path="checkout" element={<CheckoutPage />} />
                        <Route
                          path="account/profile"
                          element={<ProfilePage />}
                        />
                        <Route path="account/orders" element={<OrderPage />} />
                        <Route
                          path="account/orders/:id"
                          element={<OrderDetailPage />}
                        />
                        <Route
                          path="account/wishlist"
                          element={<WishlistPage />}
                        />
                        <Route
                          path="account/address"
                          element={<AddressPage />}
                        />
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
                      {/* Auth */}
                    </Routes>
                  </Suspense>
                </CheckoutProvider>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </>
  );
}

export default App;
