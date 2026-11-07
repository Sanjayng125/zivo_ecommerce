import { apiClient, ApiError } from "@/lib/api/client";
import { Product } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface ToggleIsActiveProps {
  product: Product;
  isLoading?: boolean;
}

export default function ToggleIsActive({
  product,
  isLoading,
}: ToggleIsActiveProps) {
  const queryClient = useQueryClient();

  const { mutate: toggleActive, isPending } = useMutation({
    mutationFn: async (product_id: string) => {
      await apiClient.patch(`/admin/products/${product_id}/toggle-is-active`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err: AxiosError<ApiError>) => {
      toast.error(err.response?.data?.message ?? "Failed to update product");
    },
  });

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            size={"xs"}
            variant={product.is_active ? "default" : "secondary"}
            className="cursor-pointer"
            onClick={() => toggleActive(product.id)}
            disabled={isPending || isLoading}
          >
            {product.is_active ? "Active" : "Inactive"}
            {(isPending || isLoading) && <Loader2 className="animate-spin" />}
          </Button>
        }
      />
      <TooltipContent>
        <p>Toggle Is Product Active</p>
      </TooltipContent>
    </Tooltip>
  );
}
