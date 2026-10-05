import axios from "axios";
import { router } from "expo-router";
import { clearTokens, getToken } from "./secureStore";

const SERVER_BASE_URL = process.env.EXPO_PUBLIC_SERVER_BASE_URL

export const api = axios.create({
    baseURL: SERVER_BASE_URL,
    timeout: 5000
});

export const authApi = axios.create({
    baseURL: SERVER_BASE_URL,
    timeout: 5000
});

authApi.interceptors.request.use(async (config) => {
    const token = await getToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

authApi.interceptors.response.use(
    function (response) {
        return response;
    },
    async function (error) {
        if (error.response?.status === 401) {
            await clearTokens()
            router.replace("/(auth)/sign-in")
        }
        return Promise.reject(error)
    }
)

export type ApiError = {
    message?: string
}
