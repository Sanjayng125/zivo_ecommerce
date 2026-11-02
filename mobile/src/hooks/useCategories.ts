import { api } from "@/lib/api";
import { CategoryWithSubcategories } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useCategories = () => {
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
        queryKey: ["categories"],
        queryFn: async ({ pageParam }) => {
            const res = await api.get("/categories",
                { params: { page: pageParam } }
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
