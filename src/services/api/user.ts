import { useMutation, useQuery } from "@tanstack/react-query";
import { PasswordReqTypes, UserTypes } from "../../types/user";
import { callApi, getAuthToken } from "../../utils/functions";
import { useLocation } from "react-router";
import { QUERY_KEYS } from "../../utils/constans";

export const useFetchUser = () => {
  const location = useLocation();

  return useQuery<UserTypes>({
    queryKey: [QUERY_KEYS.USER, location.pathname],
    queryFn: () =>
      callApi({
        method: "GET",
        url: "/user",
        token: true,
      }),
    enabled: !!getAuthToken(),
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
