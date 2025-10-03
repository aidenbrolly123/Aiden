import axios, { AxiosInstance } from "axios";

const DEFAULT_API_BASE_URL = "https://x8ki-letl-twmt.n7.xano.io/api:hpskjcSO";

export const API_BASE_URL: string =
  process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL;

let bearerToken: string | null = null;

export function setAuthToken(token: string | null): void {
  bearerToken = token;
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  if (bearerToken) {
    config.headers = config.headers ?? {};
    config.headers["Authorization"] = `Bearer ${bearerToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Surface the error for now; can add centralized handling later
    return Promise.reject(error);
  }
);

export default apiClient;
