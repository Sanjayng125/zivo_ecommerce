"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { apiClient, ApiError } from "@/lib/api/client";
import { Product } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DeleteProductModalProps {
  product: Product;
}

export function DeleteProductModal({ product }: DeleteProductModalProps) {
  const queryClient = useQueryClient();

  const { mutate: deleteProduct, isPending } = useMutation({
    mutationFn: async (product_id: string) => {
      await apiClient.delete(`/admin/products/${product_id}`);
    },
    onSuccess: () => {
      toast.success("Product deleted");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err: AxiosError<ApiError>) => {
      toast.error(err.response?.data?.message ?? "Failed to delete product");
    },
  });

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive"
            disabled={isPending}
          >
            {isPending ? <Loader2 className="animate-spin" /> : <Trash2 />}
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Product</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this product?. This action is
            irreversible!.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button
            variant={"destructive"}
            onClick={() => deleteProduct(product.id)}
            disabled={isPending}
          >
            Delete{" "}
            {isPending ? <Loader2 className="animate-spin" /> : <Trash2 />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
