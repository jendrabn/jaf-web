import { useQuery } from "@tanstack/react-query";
import { callApi } from "../../utils/functions";
import {
  BlogCategoryTypes,
  BlogDetailTypes,
  BlogItemTypes,
  BlogTagTypes,
} from "../../types/blog";
import { PageTypes } from "../../types";
import { QUERY_KEYS } from "../../utils/constans";

export const useFetchBlogCategories = () =>
  useQuery<BlogCategoryTypes[]>({
    queryKey: [QUERY_KEYS.BLOG_CATEGORIES],
    queryFn: () =>
      callApi({
        method: "GET",
        url: "/blogs/categories",
      }),
    staleTime: Infinity,
  });

export const useFetchBlogTags = () =>
  useQuery<BlogTagTypes[]>({
    queryKey: [QUERY_KEYS.BLOG_TAGS],
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
    queryKey: [QUERY_KEYS.BLOGS, queryString],
    queryFn: () =>
      callApi({
        method: "GET",
        url: `/blogs${queryString ? `?${queryString}` : ""}`,
      }),
    staleTime: Infinity,
  });

export const useFetchBlog = (slug?: string) =>
  useQuery<BlogDetailTypes>({
    queryKey: [QUERY_KEYS.BLOG, slug],
    queryFn: () =>
      callApi({
        method: "GET",
        url: `/blogs/${slug}`,
      }),
    staleTime: Infinity,
    enabled: !!slug,
  });
