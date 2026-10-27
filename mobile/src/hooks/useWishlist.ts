import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { WishlistItem } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useWishlist = () => {
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
        queryKey: ["wishlist"],
        queryFn: async ({ pageParam }) => {
            const res = await authApi.get("/wishlist",
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

    const wishlistItems = (
        data?.pages.flatMap(page => page?.wishlist_items ?? []) ?? []
    ) as WishlistItem[];

    return {
        data: wishlistItems,
        isLoading,
        error,
        isRefetching,
        refetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    }
}
