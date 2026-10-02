import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "/api/v1";
// const BASE_URL = "http://localhost:3001/api/v1";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

export const apiClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

let isRefreshing = false;

type FailedRequest = {
    resolve: (value: unknown) => void;
    reject: (error: unknown) => void;
    config: CustomAxiosRequestConfig;
};
let failedRequestsQueue: FailedRequest[] = [];

const processQueue = (error: Error | null, tokenSuccess = false) => {
    failedRequestsQueue.forEach((prom) => {
        if (tokenSuccess) {
            prom.config._retry = true;
            apiClient(prom.config)
                .then((res) => prom.resolve(res))
                .catch((err) => prom.reject(err));
        } else {
            prom.reject(error);
        }
    });

    failedRequestsQueue = [];
};

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        if (!originalRequest) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            const url = originalRequest.url || "";

            if (url.includes("/auth/login") || url.includes("/auth/refresh")) {
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedRequestsQueue.push({
                        resolve,
                        reject,
                        config: originalRequest,
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await apiClient.post("/auth/refresh");

                isRefreshing = false;

                const response = await apiClient(originalRequest);

                processQueue(null, true);

                return response;
            } catch (refreshError) {
                isRefreshing = false;
                processQueue(refreshError as Error, false);

                window.dispatchEvent(new Event("auth-session-expired"));

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    },
);
