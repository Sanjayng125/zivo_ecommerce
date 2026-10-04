import axios from "axios";
import { clearTokens, getToken } from "./secureStore";

const SERVER_BASE_URL = process.env.EXPO_PUBLIC_SERVER_BASE_URL

const api = axios.create({
    baseURL: SERVER_BASE_URL,
    timeout: 5000
});

api.interceptors.request.use(async (config) => {
    const token = await getToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
    function (response) {
        return response;
    },
    async function (error) {
        if (error.response?.status === 401) {
            await clearTokens()
            // router.replace("/(auth)/login")
        }
        return Promise.reject(error)
    }
)
