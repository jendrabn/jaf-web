import { useQuery } from "@tanstack/react-query";
import fetchApi from "@/utils/api";
import type { OrderTypes } from "@/types/order";
import type { PageTypes } from "@/types";
import { QUERY_KEYS } from "@/utils/constans";

export const useFetchOrders = (queryString?: string) =>
  useQuery<{ data: OrderTypes[]; page: PageTypes }>({
    queryKey: [QUERY_KEYS.ORDERS, queryString],
    queryFn: () =>
      fetchApi().get(`/orders${queryString ? `?${queryString}` : ""}`),
  });
