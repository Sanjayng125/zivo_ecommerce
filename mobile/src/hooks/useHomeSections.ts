import { api } from "@/lib/api";
import { HomeSection } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useHomeSections = () => {
    const {
        data = [],
        isLoading,
        error,
        isRefetching,
        refetch,
    } = useQuery<HomeSection[]>({
        queryKey: ["home"],
        queryFn: async () => {
            const res = await api.get("/home");

            return res.data?.home_sections ?? [];
        },
    });

    return {
        data,
        isLoading,
        error,
        isRefetching,
        refetch,
    }
}
