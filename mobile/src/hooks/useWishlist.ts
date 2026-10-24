import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Product } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useWishlist = () => {
    const { token } = useAuthStore();

    const { data = [], isLoading, error, isRefetching, refetch } = useQuery<
        Product[]
    >({
        queryKey: ["wishlist"],
        queryFn: async () => {
            const res = await authApi.get("/wishlist");

            return res.data?.wishlist_items ?? [];
        },
        enabled: !!token,
    });

    return {
        data,
        isLoading,
        error,
        isRefetching,
        refetch,
    }
}
