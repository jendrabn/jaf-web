import { useQuery } from "@tanstack/react-query";
import fetchApi from "@/utils/api";
import type { CityTypes } from "@/types/region";
import { QUERY_KEYS } from "@/utils/constans";

export const useFetchDistricts = (cityId?: number | null) =>
  useQuery<CityTypes[]>({
    queryKey: [QUERY_KEYS.DISTRICTS, cityId],
    queryFn: () => fetchApi().get(`/region/districts/${cityId}`),
    staleTime: Infinity,
    enabled: !!cityId,
    retry: 3,
  });
