import { useQuery } from "@tanstack/react-query";
import fetchApi from "@/utils/api";
import type { BlogCategoryTypes } from "@/types/blog";
import { QUERY_KEYS } from "@/utils/constans";

export const useFetchBlogCategories = () =>
  useQuery<BlogCategoryTypes[]>({
    queryKey: [QUERY_KEYS.BLOG_CATEGORIES],
    queryFn: () => fetchApi().get("/blogs/categories"),
    staleTime: Infinity,
    retry: 3,
  });
