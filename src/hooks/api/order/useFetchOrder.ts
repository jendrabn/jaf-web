import { useQuery } from "@tanstack/react-query";
import fetchApi from "@/utils/api";
import type { OrderDetailTypes } from "@/types/order";
import { QUERY_KEYS } from "@/utils/constans";
import { getAuthToken } from "@/utils/functions";

export const useFetchOrder = (orderId?: number) =>
  useQuery<OrderDetailTypes>({
    queryKey: [QUERY_KEYS.ORDER, orderId],
    queryFn: () => fetchApi().get(`/orders/${orderId}`),
    enabled: !!getAuthToken() && !!orderId,
    retry: 3,
  });
