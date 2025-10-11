import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../utils/api";
import type { ProductItemTypes } from "../../../types/product";
import { QUERY_KEYS } from "../../../utils/constans";

export const useFetchRelatedProducts = (productId?: string) =>
  useQuery<ProductItemTypes[]>({
    queryKey: [QUERY_KEYS.RELATED_PRODUCTS, productId],
    queryFn: () => apiClient().get(`/products/${productId}/similars`),
    enabled: !!productId,
    retry: 3,
  });
