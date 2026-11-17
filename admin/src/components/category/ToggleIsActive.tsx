import { apiClient, ApiError } from "@/lib/api/client";
import { Category } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface ToggleIsActiveProps {
  category: Category;
  isLoading?: boolean;
}

export default function ToggleIsActive({
  category,
  isLoading,
}: ToggleIsActiveProps) {
  const queryClient = useQueryClient();

  const { mutate: toggleActive, isPending } = useMutation({
    mutationFn: async () => {
      await apiClient.patch(
        `/admin/categories/${category.id}/toggle-is-active`,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (err: AxiosError<ApiError>) => {
      toast.error(
        err.response?.data?.message ?? "Failed to update category status",
      );
    },
  });

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            size={"xs"}
            variant={category.is_active ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => toggleActive()}
            disabled={isPending || isLoading}
          >
            {category.is_active ? "Active" : "Inactive"}
            {(isPending || isLoading) && <Loader2 className="animate-spin" />}
          </Button>
        }
      />
      <TooltipContent>
        <p>Toggle Is Category Active</p>
      </TooltipContent>
    </Tooltip>
  );
}
