import { ApiError, authApi } from "@/lib/api"
import { clearToken } from "@/lib/secureStore"
import { useAuthStore } from "@/store/authStore"
import { useCartStore } from "@/store/cartStore"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { router } from "expo-router"
import Toast from "react-native-toast-message"

export const useSignOut = () => {
    const { token, logout } = useAuthStore()
    const clearCart = useCartStore(state => state.clearCart)
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
            Toast.show({
                type: "success",
                text1: "Signed out successfully"
            })
        },
        onError: (error: AxiosError<ApiError>) => {
            const message = error.response?.data?.message ?? "Something went wrong while signing out"
            Toast.show({
                type: "error",
                text1: message
            })
        },
    })

    const handleSignOut = async () => {
        if (!token) return

        signOutMutation()
    }

    return { signOut: handleSignOut, isSigningOut }
}
