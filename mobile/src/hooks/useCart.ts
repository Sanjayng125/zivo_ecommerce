import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { CartItem } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const useCart = () => {
    const { token } = useAuthStore();
    const { items, addItem, removeItem, clearCart, updateQuantity, setItems } = useCartStore();

    const { data, isLoading, error, isRefetching, refetch } = useQuery<
        CartItem[]
    >({
        queryKey: ["cart"],
        queryFn: async () => {
            const res = await authApi.get("/cart");

            return res.data?.cart_items ?? [];
        },
        enabled: !!token,
    });

    useEffect(() => {
        if (data) setItems(data ?? []);
    }, [data]);

    return {
        data,
        isLoading,
        error,
        isRefetching,
        refetch,
        addItem,
        removeItem,
        clearCart,
        updateQuantity,
        setItems,
        items
    }
}
