import { useQuery } from "@tanstack/react-query";
import { callApi } from "../../utils/functions";
import {
  BlogCategoryTypes,
  BlogDetailTypes,
  BlogItemTypes,
  BlogTagTypes,
} from "../../types/blog";
import { PageTypes } from "../../types";

export const useFetchBlogCategories = () =>
  useQuery<BlogCategoryTypes[]>({
    queryKey: ["blog_categories"],
    queryFn: () =>
      callApi({
        method: "GET",
        url: "/blogs/categories",
      }),
    staleTime: Infinity,
  });

export const useFetchBlogTags = () =>
  useQuery<BlogTagTypes[]>({
    queryKey: ["blog_tags"],
    queryFn: () =>
      callApi({
        method: "GET",
        url: "/blogs/tags",
      }),
    staleTime: Infinity,
  });

export const useFetchBlogs = (queryString?: string) =>
  useQuery<{
    data: BlogItemTypes[];
    page: PageTypes;
  }>({
    queryKey: ["blogs", queryString],
    queryFn: () =>
      callApi({
        method: "GET",
        url: `/blogs${queryString ? `?${queryString}` : ""}`,
      }),
    staleTime: Infinity,
  });

export const useFetchBlog = (slug: string) =>
  useQuery<BlogDetailTypes>({
    queryKey: ["blog", slug],
    queryFn: () =>
      callApi({
        method: "GET",
        url: `/blogs/${slug}`,
      }),
    staleTime: Infinity,
  });
