import { env } from "@/utils/config";

export type MidtransEnv = "sandbox" | "production";

type LoadSnapOptions = {
  env?: MidtransEnv | string;
  clientKey: string;
};

type SnapCallbacks = {
  onSuccess?: (result: unknown) => void;
  onPending?: (result: unknown) => void;
  onError?: (result: unknown) => void;
  onClose?: () => void;
};

declare global {
  interface Window {
    snap?: {
      pay: (token: string, callbacks?: SnapCallbacks) => void;
    };
  }
}

/**
 * Memuat Midtrans Snap.js sekali dengan clientKey dan environment yang sesuai.
 * Mengembalikan Promise yang resolve saat script siap.
 */
export function loadSnapScript(options: LoadSnapOptions): Promise<void> {
  const providedEnv = options.env as MidtransEnv | string | undefined;
  const defaultEnv: MidtransEnv | string =
    (env.MIDTRANS_ENV as MidtransEnv | string) || "sandbox";
  const mode: MidtransEnv | string = providedEnv ?? defaultEnv;
  const clientKey = options.clientKey;

  return new Promise<void>((resolve, reject) => {
    // Jika sudah ada window.snap dan terdapat script dengan data-client-key, anggap sudah terpasang
    const existing = document.querySelector("script[data-client-key]");
    if (window.snap && existing) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src =
      mode === "production"
        ? "https://app.midtrans.com/snap/snap.js"
        : "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", clientKey);

    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Snap.js"));

    document.body.appendChild(script);
  });
}

/**
 * Membuka popup pembayaran Midtrans Snap dengan token yang diberikan.
 */
export function payWithSnap(token: string, callbacks?: SnapCallbacks) {
  if (!window.snap || typeof window.snap.pay !== "function") {
    throw new Error("Snap.js is not loaded. Call loadSnapScript() first.");
  }
  window.snap.pay(token, callbacks);
}
