import { useQuery } from "@tanstack/react-query";
import fetchApi from "@/utils/api";
import type { ProductItemTypes } from "@/types/product";
import { QUERY_KEYS } from "@/utils/constans";

export const useFetchRelatedProducts = (productId?: string) =>
  useQuery<ProductItemTypes[]>({
    queryKey: [QUERY_KEYS.RELATED_PRODUCTS, productId],
    queryFn: () => fetchApi().get(`/products/${productId}/similars`),
    enabled: !!productId,
  });
