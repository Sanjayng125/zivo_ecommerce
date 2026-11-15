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
import { Category } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DeleteCategoryModalProps {
  category: Category;
}

export function DeleteCategoryModal({ category }: DeleteCategoryModalProps) {
  const queryClient = useQueryClient();

  const { mutate: deleteCategory, isPending: deleting } = useMutation({
    mutationFn: async () => {
      await apiClient.delete(`/admin/categories/${category.id}`);
    },
    onSuccess: () => {
      toast.success("Category deleted");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (err: AxiosError<ApiError>) => {
      toast.error(err.response?.data?.message ?? "Failed to delete category");
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
            disabled={deleting}
          >
            {deleting ? <Loader2 className="animate-spin" /> : <Trash2 />}
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Category</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this Category?. This action is
            irreversible!.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button
            variant={"destructive"}
            onClick={() => deleteCategory()}
            disabled={deleting}
          >
            Delete{" "}
            {deleting ? <Loader2 className="animate-spin" /> : <Trash2 />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
