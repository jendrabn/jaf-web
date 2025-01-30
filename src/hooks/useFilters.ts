import { useSearchParams } from "react-router";

function useFilters<T = Record<string, string | number>>() {
  const [searchParams, setSearchParams] = useSearchParams();

  const params = Object.fromEntries(searchParams.entries()) as T;

  const queryString = searchParams.toString();

  const clearFilters = (...names: string[]): void => {
    if (names && names.length > 0) {
      names.forEach((name) => searchParams.delete(name));
      setSearchParams(searchParams);
    } else {
      setSearchParams({});
    }
  };

  const setFilter = (name: string, value: string | number): void => {
    if (value) {
      searchParams.set(name, value as string);
      setSearchParams(searchParams);
    } else {
      searchParams.delete(name);
      setSearchParams(searchParams);
    }
  };

  return { params, queryString, clearFilters, setFilter };
}

export default useFilters;
