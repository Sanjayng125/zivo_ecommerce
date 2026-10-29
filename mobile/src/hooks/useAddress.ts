import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Address } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const useAddress = () => {
    const { token, hydrated } = useAuthStore();
    const [defaultAddress, setDefaultAddress] = useState<string | null>(null);

    const {
        data: addresses = [],
        isLoading,
        refetch,
        isRefetching
    } = useQuery<Address[]>({
        queryKey: ["addresses"],
        queryFn: async () => {
            const res = await authApi.get("/addresses");
            return res.data?.addresses ?? [];
        },
        enabled: hydrated && !!token,
    });

    useEffect(() => {
        if (!addresses) return;

        const defaultAddress = addresses.find(
            (address: Address) => address.is_default,
        );
        if (!defaultAddress) {
            setDefaultAddress(null);
            return;
        }

        const da = `${defaultAddress.line1}, ${defaultAddress.city}, ${defaultAddress.state}, ${defaultAddress.pincode}`;
        setDefaultAddress(da);
    }, [addresses]);

    return {
        addresses,
        defaultAddress,
        isLoading,
        refetch,
        isRefetching,
    }
}
