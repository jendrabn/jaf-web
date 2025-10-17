import { useQuery } from "@tanstack/react-query";
import fetchApi from "@/utils/api";
import type { ProductBrandTypes } from "@/types/product";
import { QUERY_KEYS } from "@/utils/constans";

export const useFetchProductBrands = () =>
  useQuery<ProductBrandTypes[]>({
    queryKey: [QUERY_KEYS.PRODUCT_BRANDS],
    queryFn: () => fetchApi().get("/brands"),
    staleTime: Infinity,
    retry: 3,
  });
