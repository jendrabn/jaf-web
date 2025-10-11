import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../utils/api";
import type { CityTypes } from "../../../types/region";
import { QUERY_KEYS } from "../../../utils/constans";

export const useFetchDistricts = (cityId?: number | null) =>
  useQuery<CityTypes[]>({
    queryKey: [QUERY_KEYS.DISTRICTS, cityId],
    queryFn: () => apiClient().get(`/region/districts/${cityId}`),
    staleTime: Infinity,
    enabled: !!cityId,
    retry: 3,
  });
