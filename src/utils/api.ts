import axios, { type AxiosInstance } from "axios";
import { getAuthToken, removeAuthToken } from "./functions";

const apiClient = (): AxiosInstance => {
  const token = getAuthToken();

  const client = axios.create({
    baseURL: import.meta.env.VITE_BASE_API_URL,
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

export default apiClient;
