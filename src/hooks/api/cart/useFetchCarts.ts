import { useQuery } from "@tanstack/react-query";
import type { CartItemTypes } from "@/types/cart";
import { getAuthToken } from "@/utils/functions";
import { QUERY_KEYS } from "@/utils/constans";
import fetchApi from "@/utils/api";

export const useFetchCarts = () =>
  useQuery<CartItemTypes[]>({
    queryKey: [QUERY_KEYS.CARTS],
    queryFn: () => fetchApi().get("/carts"),
    enabled: !!getAuthToken(),
  });
