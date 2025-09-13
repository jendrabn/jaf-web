import { useQuery } from "@tanstack/react-query";
import apiClient from "../../utils/api";
import type { CityTypes, ProvinceTypes } from "../../types/region";
import { QUERY_KEYS } from "../../utils/constans";

export const useFetchProvinces = () =>
  useQuery<ProvinceTypes[]>({
    queryKey: [QUERY_KEYS.PROVINCES],
    queryFn: () => apiClient().get("/region/provinces"),
    staleTime: Infinity,
    retry: 3,
  });

export const useFetchCities = (provinceId?: number | null) =>
  useQuery<CityTypes[]>({
    queryKey: [QUERY_KEYS.CITIES, provinceId],
    queryFn: () => apiClient().get(`/region/cities/${provinceId}`),
    staleTime: Infinity,
    enabled: !!provinceId,
    retry: 3,
  });

export const useFetchDistricts = (cityId?: number | null) =>
  useQuery<CityTypes[]>({
    queryKey: [QUERY_KEYS.DISTRICTS, cityId],
    queryFn: () => apiClient().get(`/region/districts/${cityId}`),
    staleTime: Infinity,
    enabled: !!cityId,
    retry: 3,
  });

export const useFetchSubDistricts = (districtId?: number | null) =>
  useQuery<CityTypes[]>({
    queryKey: [QUERY_KEYS.SUBDISTRICTS, districtId],
    queryFn: () => apiClient().get(`/region/sub-districts/${districtId}`),
    staleTime: Infinity,
    enabled: !!districtId,
    retry: 3,
  });
