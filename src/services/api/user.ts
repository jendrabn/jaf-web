import { useMutation, useQuery } from "@tanstack/react-query";
import type { PasswordReqTypes, UserTypes } from "../../types/user";
import { callApi } from "../../utils/functions";
import { QUERY_KEYS } from "../../utils/constans";

export const useFetchUser = () => {
  return useQuery<UserTypes>({
    queryKey: [QUERY_KEYS.USER],
    queryFn: () =>
      callApi({
        method: "GET",
        url: "/user",
        token: true,
      }),
    staleTime: 0,
  });
};

export const useUpdateUser = () =>
  useMutation({
    mutationFn: (data: FormData) =>
      callApi({
        method: "POST",
        url: "/user?_method=PUT",
        data,
        token: true,
      }),
  });

export const useUpdatePassword = () =>
  useMutation({
    mutationFn: (data: PasswordReqTypes) =>
      callApi({
        method: "PUT",
        url: "/user/change_password",
        data,
        token: true,
      }),
  });
