import { BrowserRouter, Route, Routes } from "react-router";
import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import ProtectedRoute from "@/components/parts/ProtectedRoute";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AxiosError } from "axios";
import { AuthProvider } from "@/contexts/AuthContext.tsx";
import { CartProvider } from "@/contexts/CartContext.tsx";
import { WishlistProvider } from "@/contexts/WishlistContext.tsx";
import { CheckoutProvider } from "@/contexts/CheckoutContext.tsx";
import Loading from "@/components/ui/Loading";
import "bootstrap";
import "@/styles/style.scss";

const HomePage = lazy(() => import("@/pages/Home"));
const ProductDetailPage = lazy(() => import("@/pages/ProductDetail"));
const NotFoundPage = lazy(() => import("@/pages/NotFound"));
const ProductPage = lazy(() => import("@/pages/Product"));
const ForgotPasswordPage = lazy(() => import("@/pages/_auth/ForgotPassword"));
const LoginPage = lazy(() => import("@/pages/_auth/Login"));
const RegisterPage = lazy(() => import("@/pages/_auth/Register"));
const ResetPasswordPage = lazy(() => import("@/pages/_auth/ResetPassword"));
const VerifyLoginPage = lazy(() => import("@/pages/_auth/VerifyLogin"));
const CartPage = lazy(() => import("@/pages/Cart"));
const WishlistPage = lazy(() => import("@/pages/_account/Wishlist"));
const ProfilePage = lazy(() => import("@/pages/_account/Profile"));
const OrderPage = lazy(() => import("@/pages/_account/Order"));
const ChangePassword = lazy(() => import("@/pages/_account/ChangePassword"));
const AddressPage = lazy(() => import("@/pages/_account/Address"));
const BlogPage = lazy(() => import("@/pages/Blog"));
const BlogDetailPage = lazy(() => import("@/pages/BlogDetail"));
const CheckoutPage = lazy(() => import("@/pages/Checkout"));
const OrderDetailPage = lazy(() => import("@/pages/_account/OrderDetail"));
const ContactPage = lazy(() => import("@/pages/Contact"));
const AboutPage = lazy(() => import("@/pages/About"));
const FaqPage = lazy(() => import("@/pages/Faq"));
const HelpPage = lazy(() => import("@/pages/Help"));

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
                        path="products/:slug"
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
                      <Route
                        path="auth/verify-login"
                        element={<VerifyLoginPage />}
                      />
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
