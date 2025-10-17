import { useMutation } from "@tanstack/react-query";
import fetchApi from "@/utils/api";

export const useUpdateUser = () =>
  useMutation({
    mutationFn: (data: FormData) => fetchApi().post("/user?_method=PUT", data),
  });
