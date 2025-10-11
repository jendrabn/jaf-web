import { useQuery } from "@tanstack/react-query";
import type { CartItemTypes } from "../../../types/cart";
import { getAuthToken } from "../../../utils/functions";
import { QUERY_KEYS } from "../../../utils/constans";
import apiClient from "../../../utils/api";

export const useFetchCarts = () =>
  useQuery<CartItemTypes[]>({
    queryKey: [QUERY_KEYS.CARTS],
    queryFn: () => apiClient().get("/carts"),
    enabled: !!getAuthToken(),
    retry: 3,
  });
