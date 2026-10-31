import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useQuery } from "@tanstack/react-query";
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
    } = useQuery({
        queryKey: ["cart"],
        queryFn: async () => {
            const res = await authApi.get("/cart"
            );

            return res.data?.cart_items ?? []
        },
        enabled: hydrated && !!token,
    });

    useEffect(() => {
        if (data?.length) state.setItems(data);
    }, [data]);

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
    }
}
