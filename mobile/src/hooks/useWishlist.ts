import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { WishlistItem } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useWishlist = () => {
    const { token } = useAuthStore();

    const { data = [], isLoading, error, isRefetching, refetch } = useQuery<
        WishlistItem[]
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
