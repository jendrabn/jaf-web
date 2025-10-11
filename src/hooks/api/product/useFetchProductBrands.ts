import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../utils/api";
import type { ProductBrandTypes } from "../../../types/product";
import { QUERY_KEYS } from "../../../utils/constans";

export const useFetchProductBrands = () =>
  useQuery<ProductBrandTypes[]>({
    queryKey: [QUERY_KEYS.PRODUCT_BRANDS],
    queryFn: () => apiClient().get("/brands"),
    staleTime: Infinity,
    retry: 3,
  });
