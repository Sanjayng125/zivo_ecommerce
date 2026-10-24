import { authApi } from "@/lib/api"
import { clearToken } from "@/lib/secureStore"
import { useAuthStore } from "@/store/authStore"
import { useCartStore } from "@/store/cartStore"
import { useQueryClient } from "@tanstack/react-query"
import { router } from "expo-router"
import Toast from "react-native-toast-message"

export const useSignOut = () => {
    const { token, logout } = useAuthStore()
    const clearCart = useCartStore(state => state.clearCart)
    const queryClient = useQueryClient()

    const signOut = async () => {
        if (!token) return
        try {
            await authApi.delete("/auth/sign-out")
            await clearToken()
            logout()
            clearCart()
            queryClient.clear()
            router.replace("/(tabs)")
            Toast.show({
                type: "success",
                text1: "Signed out successfully"
            })
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Something went wrong while signing out"
            })
        }
    }

    return signOut
}
