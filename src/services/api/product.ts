import { useQuery } from "@tanstack/react-query";
import { callApi } from "../../utils/functions";
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
    queryFn: () =>
      callApi({
        method: "GET",
        url: "/categories",
      }),
    staleTime: Infinity,
  });

export const useFetchProductBrands = () =>
  useQuery<ProductBrandTypes[]>({
    queryKey: [QUERY_KEYS.PRODUCT_BRANDS],
    queryFn: () =>
      callApi({
        method: "GET",
        url: "/brands",
      }),
    staleTime: Infinity,
  });

export const useFetchProducts = (queryString?: string) =>
  useQuery<{ data: ProductItemTypes[]; page: PageTypes }>({
    queryKey: [QUERY_KEYS.PRODUCTS, queryString],
    queryFn: () =>
      callApi({
        method: "GET",
        url: `/products${queryString ? `?${queryString}` : ""}`,
      }),
  });

export const useFetchProduct = (productId?: string) =>
  useQuery<ProductDetailTypes>({
    queryKey: [QUERY_KEYS.PRODUCT, productId],
    queryFn: () =>
      callApi({
        method: "GET",
        url: `/products/${productId}`,
      }),
    enabled: !!productId,
  });

export const useFetchRelatedProducts = (productId?: string) =>
  useQuery<ProductItemTypes[]>({
    queryKey: [QUERY_KEYS.RELATED_PRODUCTS, productId],
    queryFn: () =>
      callApi({
        method: "GET",
        url: `/products/${productId}/similars`,
      }),
    enabled: !!productId,
  });
