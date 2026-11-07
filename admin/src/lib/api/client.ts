import { useAuthStore } from "@/store/auth-store";
import axios from "axios";

export type ApiError = {
    message?: string
    code?: string
}

export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
    withCredentials: true,
});

apiClient.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error.response?.status === 401) {
            useAuthStore().clearUser()
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);
