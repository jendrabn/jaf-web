import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../utils/api";
import type { CityTypes } from "../../../types/region";
import { QUERY_KEYS } from "../../../utils/constans";

export const useFetchCities = (provinceId?: number | null) =>
  useQuery<CityTypes[]>({
    queryKey: [QUERY_KEYS.CITIES, provinceId],
    queryFn: () => apiClient().get(`/region/cities/${provinceId}`),
    staleTime: Infinity,
    enabled: !!provinceId,
    retry: 3,
  });
