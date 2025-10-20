import { useQuery } from "@tanstack/react-query";
import fetchApi from "@/utils/api";
import type { ProductDetailTypes } from "@/types/product";
import { QUERY_KEYS } from "@/utils/constans";

export const useFetchProduct = (slug?: string) =>
  useQuery<ProductDetailTypes>({
    queryKey: [QUERY_KEYS.PRODUCT, slug],
    queryFn: () => fetchApi().get(`/products/${slug}`),
    enabled: !!slug,
  });
