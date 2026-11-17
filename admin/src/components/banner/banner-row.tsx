"use client";
import { apiClient, ApiError } from "@/lib/api/client";
import { Banner } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { DeleteBannerModal } from "./DeleteBannerModal";
import { EditBannerDialog } from "./edit-banner-dialog";
import ToggleIsActive from "./ToggleIsActive";

export function BannerRow({ banner }: { banner: Banner }) {
  const qc = useQueryClient();

  const { mutate: toggleActive } = useMutation({
    mutationFn: async () => {
      await apiClient.patch(`/admin/banners/${banner.id}/toggle-is-active`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["banners"] });
    },
    onError: (err: AxiosError<ApiError>) => {
      toast.error(err.response?.data?.message ?? "Failed to update banner");
    },
  });

  const { mutate: deleteBanner } = useMutation({
    mutationFn: async () => {
      await apiClient.delete(`/admin/banners/${banner.id}`);
    },
    onSuccess: () => {
      toast.success("Banner deleted");
      qc.invalidateQueries({ queryKey: ["banners"] });
    },
    onError: (err: AxiosError<ApiError>) => {
      toast.error(err.response?.data?.message ?? "Failed to delete banner");
    },
  });

  return (
    <div className="flex max-md:flex-col md:items-center gap-3 p-3 border rounded-md hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-24 h-12 rounded-md border bg-muted shrink-0 overflow-hidden relative">
          {banner.image_url ? (
            <Image
              src={banner.image_url}
              alt="Banner"
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs bg-amber-100/80 text-amber-700 border border-amber-400/70 rounded-md">
              Add image
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">
              {banner.group_name}
            </span>
            <span className="text-xs text-muted-foreground">
              #{banner.sort_order}
            </span>
          </div>
          {banner.link && (
            <p className="text-xs text-primary flex items-center gap-1 truncate max-w-fit min-w-0">
              <ExternalLink className="w-3 h-3 shrink-0" />
              <span className="truncate min-w-0">{banner.link}</span>
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <ToggleIsActive banner={banner} />
        <EditBannerDialog banner={banner} />
        <DeleteBannerModal banner={banner} />
      </div>
    </div>
  );
}
