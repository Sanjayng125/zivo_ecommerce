"use client";
import { apiClient } from "@/lib/api/client";
import { useAuthStore } from "@/store/auth-store";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export function useSession() {
    const { setUser, clearUser } = useAuthStore();

    const query = useQuery({
        queryKey: ["session"],
        queryFn: async () => {
            const res = await apiClient.get("/auth/me")

            return res.data?.user
        },
        retry: false,
        staleTime: 1000 * 60 * 5,
    });

    useEffect(() => {
        if (query.data) {
            setUser(query.data);
        } else if (!query.isPending) {
            clearUser();
        }
    }, [query.data, query.isPending]);

    return query;
}
