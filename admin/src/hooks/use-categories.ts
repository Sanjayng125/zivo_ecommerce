import { apiClient } from "@/lib/api/client";
import { CategoryWithSubcategories } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useCategories = (excludeId?: string) => {
    const queryKeys = ["categories"]
    if (excludeId) queryKeys.push(excludeId)

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
        queryKey: queryKeys,
        queryFn: async ({ pageParam }) => {
            const res = await apiClient.get("/admin/categories",
                { params: { page: pageParam, ...(excludeId && { exclude: excludeId }) } }
            );

            return res.data
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            return lastPage.pagination.page < lastPage.pagination.total_pages
                ? lastPage.pagination.page + 1
                : undefined
        },
    });

    const categories = (
        data?.pages.flatMap(page => page?.categories ?? []) ?? []
    ) as CategoryWithSubcategories[];

    return {
        data: categories,
        isLoading,
        error,
        isRefetching,
        refetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    }
}
