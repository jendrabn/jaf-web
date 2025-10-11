import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../utils/api";
import type { ProductCategoryTypes } from "../../../types/product";
import { QUERY_KEYS } from "../../../utils/constans";

export const useFetchProductCategories = () =>
  useQuery<ProductCategoryTypes[]>({
    queryKey: [QUERY_KEYS.PRODUCT_CATEGORIES],
    queryFn: () => apiClient().get("/categories"),
    staleTime: Infinity,
    retry: 3,
  });
