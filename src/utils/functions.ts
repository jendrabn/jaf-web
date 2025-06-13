import Cookie from "js-cookie";
import axios, { type AxiosRequestConfig } from "axios";
import { KEY_SELECTED_CART_IDS } from "./constans";

export const formatPrice = (value: number = 0) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

export const formatDate = (date: string) => new Date(date).toLocaleString();

export const formatDateTime = (date: string) => {
  if (!date) return "";

  const d = new Date(date);
  const day = d.getDate();
  const month = d.toLocaleString("default", { month: "2-digit" });
  const year = d.getFullYear();
  const hours = d.getHours();
  const minutes = d.getMinutes();

  return `${day}-${month}-${year} ${hours}:${minutes}`;
};

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
  }).catch((err) => {
    if (err.response.status === 401) {
      removeAuthToken();
    }

    throw err;
  });

  const { length } = Object.keys(response.data);

  return length > 1 ? response.data : response.data.data;
};

export const getAuthToken = () => Cookie.get("token");
export const setAuthToken = (token: string) =>
  Cookie.set("token", token, { expires: 7 });
export const removeAuthToken = () => Cookie.remove("token");

// set selected cart ids to local storage
export const setSelectedCartIds = (selectedIds: number[]) =>
  localStorage.setItem(KEY_SELECTED_CART_IDS, JSON.stringify(selectedIds));

// get selected cart ids from local storage
export const getSelectedCartIds = () =>
  JSON.parse(localStorage.getItem(KEY_SELECTED_CART_IDS) || "[]");
