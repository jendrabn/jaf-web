import { useQuery } from "@tanstack/react-query";
import { callApi } from "../../utils/functions";
import {
  ProductBrandTypes,
  ProductCategoryTypes,
  ProductDetailTypes,
  ProductItemTypes,
} from "../../types/product";
import { PageTypes } from "../../types";

export const useFetchProductCategories = () =>
  useQuery<ProductCategoryTypes[]>({
    queryKey: ["product_categories"],
    queryFn: () =>
      callApi({
        method: "GET",
        url: "/categories",
      }),
    staleTime: Infinity,
  });

export const useFetchProductBrands = () =>
  useQuery<ProductBrandTypes[]>({
    queryKey: ["product_brands"],
    queryFn: () =>
      callApi({
        method: "GET",
        url: "/brands",
      }),
    staleTime: Infinity,
  });

export const useFetchProducts = (queryString?: string) =>
  useQuery<{ data: ProductItemTypes[]; page: PageTypes }>({
    queryKey: ["producs", queryString],
    queryFn: () =>
      callApi({
        method: "GET",
        url: `/products${queryString ? `?${queryString}` : ""}`,
      }),
  });

export const useFetchProduct = (productId: number) =>
  useQuery<ProductDetailTypes>({
    queryKey: ["product", productId],
    queryFn: () =>
      callApi({
        method: "GET",
        url: `/products/${productId}`,
      }),
  });

export const useFetchRelatedProducts = (productId: number) =>
  useQuery<ProductItemTypes[]>({
    queryKey: ["related_products", productId],
    queryFn: () =>
      callApi({
        method: "GET",
        url: `/products/${productId}/similars`,
      }),
  });
