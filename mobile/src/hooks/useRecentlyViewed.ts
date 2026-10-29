import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Product } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useRecentlyViewed = () => {
    const { token, hydrated } = useAuthStore();

    const { data = [], isLoading, error, isRefetching, refetch } = useQuery<
        Product[]
    >({
        queryKey: ["recently-viewed"],
        queryFn: async () => {
            const res = await authApi.get("/profile/recently-viewed");

            return res.data?.products ?? [];
        },
        enabled: hydrated && !!token,
    });

    return {
        data,
        isLoading,
        error,
        isRefetching,
        refetch,
    }
}
