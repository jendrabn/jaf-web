import { BrowserRouter, Route, Routes } from "react-router";
import { lazy, Suspense, useEffect } from "react";
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
import { ThemeProvider } from "./contexts/ThemeContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { env } from "./utils/config";
import { subscribeToForegroundMessages } from "./lib/firebase";

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
const NotificationsPage = lazy(() => import("@/pages/_account/Notifications"));
const FlashSalePage = lazy(() => import("@/pages/FlashSale"));

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
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let mounted = true;

    subscribeToForegroundMessages((payload) => {
      const notification = payload.notification ?? {};
      const title = notification.title || "JAF Parfum's";
      const body = notification.body;
      const tag = payload.collapseKey || payload.messageId || undefined;

      if ("Notification" in window && Notification.permission === "granted") {
        navigator.serviceWorker.ready
          .then((registration) => {
            if (!registration) {
              throw new Error("Service worker registration belum siap.");
            }

            const notificationOptions: NotificationOptions = {
              body,
              icon: notification.icon || "/images/favicon-96x96.png",
              data: payload.data,
              tag,
            };

            if (notification.image) {
              (notificationOptions as NotificationOptions & {
                image?: string;
              }).image = notification.image;
            }

            if (tag) {
              (notificationOptions as NotificationOptions & {
                renotify?: boolean;
              }).renotify = true;
            }

            return registration.showNotification(title, notificationOptions);
          })
          .catch((error) => {
            console.error(
              "[Firebase] Gagal menampilkan Chrome notification:",
              error,
              payload,
            );
          });
      } else {
        console.warn(
          "[Firebase] Notifikasi foreground diterima tetapi izin belum granted atau Notification API tidak tersedia.",
          payload,
        );
      }
    })
      .then((unsub) => {
        if (!mounted) {
          unsub();
          return;
        }
        unsubscribe = unsub;
      })
      .catch((error) => {
        console.error("Failed to subscribe to foreground messages", error);
      });

    return () => {
      mounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    const handleSwMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || typeof data !== "object") {
        return;
      }

      if (data.type === "FCM_NOTIFICATION_SHOWN") {
        console.info("[Firebase] Notifikasi OS ditampilkan:", data);
      } else if (data.type === "FCM_NOTIFICATION_ERROR") {
        console.error("[Firebase] Gagal menampilkan notifikasi OS:", data);
      }
    };

    navigator.serviceWorker.addEventListener("message", handleSwMessage);
    return () => {
      navigator.serviceWorker.removeEventListener("message", handleSwMessage);
    };
  }, []);

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
                  <Suspense fallback={<Loading className="min-dvh-100" />}>
                    <ThemeProvider>
                      <GoogleOAuthProvider clientId={env.GOOGLE_CLIENT_ID}>
            <Routes>
              <Route path="*" element={<NotFoundPage />} />
              <Route index element={<HomePage />} />
              <Route path="flash-sale" element={<FlashSalePage />} />
              <Route path="products" element={<ProductPage />} />
                          <Route
                            path="products/:slug"
                            element={<ProductDetailPage />}
                          />
                          <Route path="blog" element={<BlogPage />} />
                          <Route
                            path="blog/:slug"
                            element={<BlogDetailPage />}
                          />
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
                            <Route
                              path="account/orders"
                              element={<OrderPage />}
                            />
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
                            <Route
                              path="account/notifications"
                              element={<NotificationsPage />}
                            />
                          </Route>

                          {/* Auth */}
                          <Route path="auth/login" element={<LoginPage />} />
                          <Route
                            path="auth/verify-login"
                            element={<VerifyLoginPage />}
                          />
                          <Route
                            path="auth/register"
                            element={<RegisterPage />}
                          />
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
                      </GoogleOAuthProvider>
                    </ThemeProvider>
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
