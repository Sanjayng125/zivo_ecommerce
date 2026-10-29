import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { CartItem } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const useCart = () => {
    const { token, hydrated } = useAuthStore();
    const state = useCartStore();

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
        queryKey: ["cart"],
        queryFn: async ({ pageParam }) => {
            const res = await authApi.get("/cart",
                { params: { page: pageParam } }
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

    const cartItems = (
        data?.pages.flatMap(page => page?.cart_items ?? []) ?? []
    ) as CartItem[];

    useEffect(() => {
        if (data?.pages.length) state.setItems(cartItems);
    }, [data?.pages]);

    const subTotal = state.items?.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
    );
    const shipping = subTotal <= 50000 ? 4000 : 0;
    const total = subTotal + shipping;

    const cartCount = state.items.length;

    return {
        isLoading,
        error,
        isRefetching,
        refetch,
        subTotal,
        shipping,
        total,
        ...state,
        cartCount,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    }
}
