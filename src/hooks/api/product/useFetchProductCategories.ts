import { useQuery } from "@tanstack/react-query";
import fetchApi from "@/utils/api";
import type { ProductCategoryTypes } from "@/types/product";
import { QUERY_KEYS } from "@/utils/constans";

export const useFetchProductCategories = () =>
  useQuery<ProductCategoryTypes[]>({
    queryKey: [QUERY_KEYS.PRODUCT_CATEGORIES],
    queryFn: () => fetchApi().get("/categories"),
    staleTime: Infinity,
  });
