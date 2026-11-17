import { apiClient, ApiError } from "@/lib/api/client";
import { Banner } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface ToggleIsActiveProps {
  banner: Banner;
  isLoading?: boolean;
}

export default function ToggleIsActive({
  banner,
  isLoading,
}: ToggleIsActiveProps) {
  const queryClient = useQueryClient();

  const { mutate: toggleActive, isPending } = useMutation({
    mutationFn: async () => {
      await apiClient.patch(`/admin/banners/${banner.id}/toggle-is-active`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
    onError: (err: AxiosError<ApiError>) => {
      toast.error(
        err.response?.data?.message ?? "Failed to update banner status",
      );
    },
  });

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            size={"xs"}
            variant={banner.is_active ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => toggleActive()}
            disabled={isPending || isLoading}
          >
            {banner.is_active ? "Active" : "Inactive"}
            {(isPending || isLoading) && <Loader2 className="animate-spin" />}
          </Button>
        }
      />
      <TooltipContent>
        <p>Toggle Is Banner Active</p>
      </TooltipContent>
    </Tooltip>
  );
}
