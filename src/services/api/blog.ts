import { useQuery } from "@tanstack/react-query";
import apiClient from "../../utils/api";
import type {
  BlogCategoryTypes,
  BlogDetailTypes,
  BlogItemTypes,
  BlogTagTypes,
} from "../../types/blog";
import type { PageTypes } from "../../types";
import { QUERY_KEYS } from "../../utils/constans";

export const useFetchBlogCategories = () =>
  useQuery<BlogCategoryTypes[]>({
    queryKey: [QUERY_KEYS.BLOG_CATEGORIES],
    queryFn: () => apiClient().get("/blogs/categories"),
    staleTime: Infinity,
    retry: 3,
  });

export const useFetchBlogTags = () =>
  useQuery<BlogTagTypes[]>({
    queryKey: [QUERY_KEYS.BLOG_TAGS],
    queryFn: () => apiClient().get("/blogs/tags"),
    staleTime: Infinity,
    retry: 3,
  });

export const useFetchBlogs = (queryString?: string) =>
  useQuery<{
    data: BlogItemTypes[];
    page: PageTypes;
  }>({
    queryKey: [QUERY_KEYS.BLOGS, queryString],
    queryFn: () =>
      apiClient().get(`/blogs${queryString ? `?${queryString}` : ""}`),
    staleTime: Infinity,
    retry: 3,
  });

export const useFetchBlog = (slug?: string) =>
  useQuery<BlogDetailTypes>({
    queryKey: [QUERY_KEYS.BLOG, slug],
    queryFn: () => apiClient().get(`/blogs/${slug}`),
    staleTime: Infinity,
    enabled: !!slug,
    retry: 3,
  });
