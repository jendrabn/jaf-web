import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../utils/api";
import type { ProductDetailTypes } from "../../../types/product";
import { QUERY_KEYS } from "../../../utils/constans";

export const useFetchProduct = (productId?: string) =>
  useQuery<ProductDetailTypes>({
    queryKey: [QUERY_KEYS.PRODUCT, productId],
    queryFn: () => apiClient().get(`/products/${productId}`),
    enabled: !!productId,
    retry: 3,
  });
