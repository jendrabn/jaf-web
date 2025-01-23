import { useSearchParams } from "react-router";

function useFetchBlogFilters() {
  const { searchParams, setSearchParams } = useSearchParams();

  const params = {
    page: searchParams.get("page") || undefined,
    search: searchParams.get("search") || undefined,
    category_id: searchParams.get("category_id") || undefined,
    tag_id: searchParams.get("tag_id") || undefined,
    sort_by: searchParams.get("sort_by") || undefined,
  };

  return {
    params,
  };
}

export default useFetchBlogFilters;
