import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import Loading from "./components/Loading";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback={<Loading className="min-vh-100" />}>
      <App />
    </Suspense>
  </StrictMode>
);
