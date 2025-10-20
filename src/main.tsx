import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import Loading from "./components/ui/Loading";
import { ThemeProvider } from "./contexts/ThemeContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { env } from "./utils/config";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback={<Loading className="min-dvh-100" />}>
      <ThemeProvider>
        <GoogleOAuthProvider clientId={env.GOOGLE_CLIENT_ID}>
          <App />
        </GoogleOAuthProvider>
      </ThemeProvider>
    </Suspense>
  </StrictMode>
);
