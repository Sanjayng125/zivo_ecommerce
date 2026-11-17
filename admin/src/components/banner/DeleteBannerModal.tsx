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
import { Banner } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DeleteBannerModalProps {
  banner: Banner;
}

export function DeleteBannerModal({ banner }: DeleteBannerModalProps) {
  const queryClient = useQueryClient();

  const { mutate: deleteBanner, isPending: deleting } = useMutation({
    mutationFn: async () => {
      await apiClient.delete(`/admin/banners/${banner.id}`);
    },
    onSuccess: () => {
      toast.success("Banner deleted");
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
    onError: (err: AxiosError<ApiError>) => {
      toast.error(err.response?.data?.message ?? "Failed to delete banner");
    },
  });

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="destructive" size="xs" disabled={deleting}>
            Delete{" "}
            {deleting ? <Loader2 className="animate-spin" /> : <Trash2 />}
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Banner</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this Banner?. This action is
            irreversible!.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button
            variant={"destructive"}
            onClick={() => deleteBanner()}
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
