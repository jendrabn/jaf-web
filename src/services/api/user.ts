import { useMutation, useQuery } from "@tanstack/react-query";
import type { PasswordReqTypes, UserTypes } from "../../types/user";
import { QUERY_KEYS } from "../../utils/constans";
import apiClient from "../../utils/api";

export const useFetchUser = () => {
  return useQuery<UserTypes>({
    queryKey: [QUERY_KEYS.USER],
    queryFn: () => apiClient().get("/user"),
    retry: 3,
  });
};

export const useUpdateUser = () =>
  useMutation({
    mutationFn: (data: FormData) => apiClient().post("/user?_method=PUT", data),
  });

export const useUpdatePassword = () =>
  useMutation({
    mutationFn: (data: PasswordReqTypes) =>
      apiClient().put("/user/change_password", data),
  });
