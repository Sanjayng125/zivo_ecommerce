import { apiClient } from "@/lib/api/client";
import { useQuery } from "@tanstack/react-query";

export interface Profile {
    id: string;
    full_name: string | null;
    phone: string | null;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
}

export function useProfile() {
    return useQuery({
        queryKey: ["profile"],
        queryFn: async () => {
            const res = await apiClient.get<{ profile: Profile }>("/profile");
            return res.data.profile;
        },
        staleTime: 1000 * 60 * 5,
    });
}
