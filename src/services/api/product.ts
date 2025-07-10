import { useQuery } from "@tanstack/react-query";
import apiClient from "../../utils/api";
import type {
  ProductBrandTypes,
  ProductCategoryTypes,
  ProductDetailTypes,
  ProductItemTypes,
} from "../../types/product";
import type { PageTypes } from "../../types";
import { QUERY_KEYS } from "../../utils/constans";

export const useFetchProductCategories = () =>
  useQuery<ProductCategoryTypes[]>({
    queryKey: [QUERY_KEYS.PRODUCT_CATEGORIES],
    queryFn: () => apiClient().get("/categories"),
    staleTime: Infinity,
    retry: 3,
  });

export const useFetchProductBrands = () =>
  useQuery<ProductBrandTypes[]>({
    queryKey: [QUERY_KEYS.PRODUCT_BRANDS],
    queryFn: () => apiClient().get("/brands"),
    staleTime: Infinity,
    retry: 3,
  });

export const useFetchProducts = (queryString?: string) =>
  useQuery<{ data: ProductItemTypes[]; page: PageTypes }>({
    queryKey: [QUERY_KEYS.PRODUCTS, queryString],
    queryFn: () =>
      apiClient().get(`/products${queryString ? `?${queryString}` : ""}`),
    retry: 3,
  });

export const useFetchProduct = (productId?: string) =>
  useQuery<ProductDetailTypes>({
    queryKey: [QUERY_KEYS.PRODUCT, productId],
    queryFn: () => apiClient().get(`/products/${productId}`),
    enabled: !!productId,
    retry: 3,
  });

export const useFetchRelatedProducts = (productId?: string) =>
  useQuery<ProductItemTypes[]>({
    queryKey: [QUERY_KEYS.RELATED_PRODUCTS, productId],
    queryFn: () => apiClient().get(`/products/${productId}/similars`),
    enabled: !!productId,
    retry: 3,
  });
