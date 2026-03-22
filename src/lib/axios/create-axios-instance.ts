import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import { tokenStorage } from "@/lib/auth/tokens";

interface RetryableAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export function createAxiosInstance(baseURL: string): AxiosInstance {
  const instance = axios.create({
    baseURL,
    timeout: 30_000,
  });

  instance.interceptors.request.use(
    async (config: RetryableAxiosRequestConfig) => {
      const token = tokenStorage.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as RetryableAxiosRequestConfig;

      const is401 = error.response?.status === 401;
      const alreadyRetried = originalRequest._retry;

      if (!is401 || alreadyRetried || !originalRequest) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      const newToken = await tokenStorage.refresh();

      if (!newToken) {
        window.dispatchEvent(new CustomEvent("auth:session-expired"));
        return Promise.reject(error);
      }

      window.dispatchEvent(new CustomEvent("auth:mqtt-reauth"));

      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return instance(originalRequest);
    },
  );

  return instance;
}

export const apiClient = createAxiosInstance(
  process.env.NEXT_PUBLIC_API_URL ?? "",
);
