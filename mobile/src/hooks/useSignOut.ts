import { ApiError, authApi } from "@/lib/api"
import { clearToken } from "@/lib/secureStore"
import { useAuthStore } from "@/store/authStore"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { router } from "expo-router"
import { toast } from "sonner-native"
import { useCart } from "./useCart"

export const useSignOut = () => {
    const { token, logout } = useAuthStore()
    const { clearCart } = useCart()
    const queryClient = useQueryClient()

    const { mutate: signOutMutation, isPending: isSigningOut } = useMutation({
        mutationFn: async () => {
            const res = await authApi.delete("/auth/sign-out")
            return res.data
        },
        onSuccess: async () => {
            await clearToken()
            logout()
            clearCart()
            queryClient.clear()
            router.replace("/(tabs)")
            toast.success("Signed out successfully")
        },
        onError: (error: AxiosError<ApiError>) => {
            const message = error.response?.data?.message ?? "Something went wrong while signing out"
            toast.error(message)
        },
    })

    const handleSignOut = async () => {
        if (!token) return

        signOutMutation()
    }

    return { signOut: handleSignOut, isSigningOut }
}
