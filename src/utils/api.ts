import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import { getAuthToken, removeAuthToken } from "./functions";
import { env } from "./config";

const fetchApi = (): AxiosInstance => {
  const token = getAuthToken();

  const client = axios.create({
    baseURL: env.BASE_API_URL,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  client.interceptors.response.use(
    (response) => {
      const length = Object.keys(response.data).length;

      return length > 1 ? response.data : response.data.data;
    },
    (error) => {
      if (error.response?.status === 401) {
        removeAuthToken();
      }
      return Promise.reject(error);
    }
  );

  return client;
};

export default fetchApi;

export const fetchApi2 = async (url: string, options?: AxiosRequestConfig) => {
  const response = await axios({
    ...options,
    url: `${env.BASE_API_URL}${url}`,
    method: options?.method || "GET",
    headers: {
      ...(getAuthToken() && { Authorization: `Bearer ${getAuthToken()}` }),
      ...options?.headers,
    },
  });

  return response.data;
};
