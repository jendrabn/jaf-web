import Cookie from "js-cookie";
import axios, { AxiosRequestConfig } from "axios";

export const formatToRupiah = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(value);
};

export const formatDate = (date: string) => new Date(date).toLocaleString();

export const getGenderLabel = (gender: number) => {
  switch (gender) {
    case 1:
      return "Man";
    case 2:
      return "Woman";
    case 3:
      return "Unisex";
    default:
      return "";
  }
};

export const callApi = async ({
  method,
  url,
  data,
  token = false,
}: {
  token?: boolean;
} & AxiosRequestConfig) => {
  const response = await axios({
    method,
    url: `${import.meta.env.VITE_BASE_API_URL}${url}`,
    data,
    headers: {
      ...(token && {
        Authorization: `Bearer ${Cookie.get("token")}`,
      }),
    },
  });

  const { length } = Object.keys(response.data);

  return length > 1 ? response.data : response.data.data;
};

export const getAuthToken = () => Cookie.get("token");
export const setAuthToken = (token: string) =>
  Cookie.set("token", token, { expires: 30 });
export const removeAuthToken = () => Cookie.remove("token");
