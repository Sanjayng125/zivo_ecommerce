import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Order } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useOrders = (sort?: string) => {
    const { token, hydrated } = useAuthStore();

    let ordersSort = sort ?? "newest"

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
        queryKey: ["orders", ordersSort],
        queryFn: async ({ pageParam }) => {
            const res = await authApi.get("/orders",
                { params: { page: pageParam, sort: ordersSort } }
            );

            return res.data
        },
        enabled: hydrated && !!token,
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
