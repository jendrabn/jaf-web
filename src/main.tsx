import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import Loading from "./components/ui/Loading";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "./contexts/ThemeContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { env } from "./utils/config";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback={<Loading className="min-vh-100" />}>
      <HelmetProvider>
        <ThemeProvider>
          <GoogleOAuthProvider clientId={env.GOOGLE_CLIENT_ID}>
            <App />
          </GoogleOAuthProvider>
        </ThemeProvider>
      </HelmetProvider>
    </Suspense>
  </StrictMode>
);
