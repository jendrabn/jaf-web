import { requestFcmToken } from "@/lib/firebase";
import { updateFcmToken } from "@/hooks/api/notification";

// Fungsi untuk menginisialisasi dan menyinkronkan token FCM
export const initializeFcmToken = async (
  silent = false
): Promise<string | null> => {
  try {
    // Periksa apakah browser mendukung notifikasi
    if (typeof window === "undefined" || !("Notification" in window)) {
      console.log("[FCM] Browser tidak mendukung notifikasi");
      return null;
    }

    // Periksa izin notifikasi
    const permission = Notification.permission;

    // Jika izin belum diberikan, coba minta izin
    if (permission === "default") {
      try {
        await Notification.requestPermission();
      } catch (error) {
        console.error("[FCM] Gagal meminta izin notifikasi:", error);
        return null;
      }
    }

    // Jika izin diberikan, dapatkan token FCM
    if (Notification.permission === "granted") {
      const token = await requestFcmToken();

      if (token) {
        // Kirim token ke server
        await updateFcmToken(token);
        console.log("[FCM] Token berhasil disinkronkan dengan server");
        return token;
      } else {
        console.warn("[FCM] Token tidak dapat diperoleh");
        // Hapus token dari server jika tidak ada token
        await updateFcmToken(null);
        return null;
      }
    } else {
      console.log("[FCM] Izin notifikasi tidak diberikan");
      // Hapus token dari server jika izin tidak diberikan
      await updateFcmToken(null);
      return null;
    }
  } catch (error) {
    console.error("[FCM] Gagal menginisialisasi token FCM:", error);
    if (!silent) {
      // Hapus token dari server jika terjadi kesalahan
      try {
        await updateFcmToken(null);
      } catch (updateError) {
        console.error("[FCM] Gagal menghapus token dari server:", updateError);
      }
    }
    return null;
  }
};

// Fungsi untuk memeriksa dan memperbarui token FCM jika diperlukan
export const refreshFcmToken = async (): Promise<string | null> => {
  try {
    const token = await requestFcmToken();
    if (token) {
      await updateFcmToken(token);
      console.log("[FCM] Token berhasil diperbarui");
      return token;
    } else {
      console.warn("[FCM] Token tidak dapat diperoleh saat refresh");
      await updateFcmToken(null);
      return null;
    }
  } catch (error) {
    console.error("[FCM] Gagal memperbarui token FCM:", error);
    try {
      await updateFcmToken(null);
    } catch (updateError) {
      console.error(
        "[FCM] Gagal menghapus token dari server saat refresh:",
        updateError
      );
    }
    return null;
  }
};
