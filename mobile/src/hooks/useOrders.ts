import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Order } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useOrders = () => {
    const { token } = useAuthStore();

    const {
        data,
        isLoading,
        error,
        isRefetching,
        refetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: ["orders"],
        queryFn: async ({ pageParam }) => {
            const res = await authApi.get("/orders",
                { params: { page: pageParam } }
            );

            return res.data
        },
        enabled: !!token,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            return lastPage.pagination.page < lastPage.pagination.total_pages
                ? lastPage.pagination.page + 1
                : undefined
        },
    });

    const orders = (
        data?.pages.flatMap(page => page?.orders ?? []) ?? []
    ) as Order[];

    return {
        data: orders,
        isLoading,
        error,
        isRefetching,
        refetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    }
}
