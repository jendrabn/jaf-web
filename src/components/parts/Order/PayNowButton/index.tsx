import React, { useCallback, useState } from "react";
import { Button } from "react-bootstrap";
import { loadSnapScript, payWithSnap } from "@/lib/midtrans";
import { env } from "@/utils/config";
import { toast } from "react-toastify";
import { useFetchOrder } from "@/hooks/api/order";
import type { OrderDetailTypes, PaymentInfoTypes } from "@/types/order";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/utils/constans";

interface PayNowButtonProps {
  orderId?: number;
  order?: OrderDetailTypes;
  className?: string;
  size?: "sm" | "lg";
  variant?: string;
  disabled?: boolean;
  label?: string;
}

const PayNowButton: React.FC<PayNowButtonProps> = ({
  orderId,
  order: providedOrder,
  className,
  size,
  variant = "primary",
  disabled,
  label = "Bayar Sekarang",
}) => {
  const { data: fetchedOrder, refetch } = useFetchOrder(orderId);
  const order = providedOrder ?? fetchedOrder;
  const [processing, setProcessing] = useState(false);
  const queryClient = useQueryClient();

  const handleClick = useCallback(async () => {
    setProcessing(true);

    let current = order;
    if (!current) {
      const result = await refetch();
      current = result.data;
      if (!current) {
        toast.error("Gagal memuat detail pesanan.");
        setProcessing(false);
        return;
      }
    }

    const info: PaymentInfoTypes | undefined = current?.payment?.info;
    const clientKey: string | undefined = info?.client_key;
    const snapToken: string | undefined = info?.snap_token;
    const redirectUrl: string | undefined = info?.redirect_url;
    const resolvedOrderId: number | undefined = current?.id ?? orderId;

    if (clientKey && snapToken) {
      try {
        await loadSnapScript({
          env: (env.MIDTRANS_ENV as "sandbox" | "production") || "sandbox",
          clientKey,
        });
        payWithSnap(snapToken, {
          onSuccess: async () => {
            if (resolvedOrderId) {
              await refetch();
              queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.ORDER, resolvedOrderId],
              });
            }
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
            setProcessing(false);
          },
          onPending: async () => {
            if (resolvedOrderId) {
              await refetch();
              queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.ORDER, resolvedOrderId],
              });
            }
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
            setProcessing(false);
          },
          onError: () => {
            toast.error(
              "Pembayaran gagal. Silakan coba lagi atau pilih metode lain."
            );
            setProcessing(false);
          },
          onClose: () => {
            setProcessing(false);
          },
        });
      } catch {
        toast.error("Gagal memuat Midtrans Snap.");
        setProcessing(false);
      }
    } else if (redirectUrl) {
      window.location.assign(redirectUrl);
      setProcessing(false);
    } else {
      toast.error("Informasi pembayaran Midtrans tidak tersedia.");
      setProcessing(false);
    }
  }, [order, refetch]);

  return (
    <Button
      className={className}
      size={size}
      variant={variant}
      disabled={disabled || processing || (!orderId && !providedOrder)}
      onClick={handleClick}
    >
      {label}
    </Button>
  );
};

export default PayNowButton;
