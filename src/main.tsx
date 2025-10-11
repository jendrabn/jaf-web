import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import Loading from "./components/ui/Loading";
import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback={<Loading className="min-vh-100" />}>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </Suspense>
  </StrictMode>
);
