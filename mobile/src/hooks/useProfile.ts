import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Profile } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useProfile = () => {
    const { token } = useAuthStore();

    const {
        data: profile,
        isLoading,
        error,
        isRefetching,
        refetch,
    } = useQuery<Profile>({
        queryKey: ["profile"],
        queryFn: async () => {
            const res = await authApi.get("/profile");
            return res.data?.profile;
        },
        enabled: !!token,
    });

    return {
        profile,
        isLoading,
        error,
        isRefetching,
        refetch,
    }
}
