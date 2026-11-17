"use client";
import { ImageUploadBox } from "@/components/image-upload-box";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { apiClient, ApiError } from "@/lib/api/client";
import {
  UpdateBannerImageValues,
  updateBannerSchema,
  UpdateBannerValues,
} from "@/schemas/banner";
import { Banner } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { AlertTriangle, Loader2, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";

export function EditBannerDialog({ banner }: { banner: Banner }) {
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid, isDirty },
  } = useForm<UpdateBannerValues>({
    resolver: zodResolver(updateBannerSchema) as Resolver<UpdateBannerValues>,
    defaultValues: {
      link: banner.link ?? "",
      sort_order: banner.sort_order,
      group_name: banner.group_name,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        link: banner.link ?? "",
        sort_order: banner.sort_order,
        group_name: banner.group_name,
      });
    }
  }, [open, banner, reset]);

  const { mutate: update, isPending } = useMutation({
    mutationFn: async (values: UpdateBannerValues) => {
      const payload = {
        ...values,
        link: values.link || undefined,
      };
      await apiClient.patch(`/admin/banners/${banner.id}`, payload);
    },
    onSuccess: () => {
      toast.success("Banner updated");
      qc.invalidateQueries({ queryKey: ["banners"] });
      setOpen(false);
    },
    onError: (err: AxiosError<ApiError>) => {
      toast.error(err.response?.data?.message ?? "Failed to update banner");
    },
  });

  const { mutate: updateImage, isPending: imageUpdating } = useMutation({
    mutationFn: async (values: UpdateBannerImageValues) => {
      await apiClient.patch(`/admin/banners/${banner.id}/image`, values);
    },
    onSuccess: () => {
      toast.success("Banner image updated");
      qc.invalidateQueries({ queryKey: ["banners"] });
      setOpen(false);
    },
    onError: (err: AxiosError<ApiError>) => {
      toast.error(
        err.response?.data?.message ?? "Failed to update banner image",
      );
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="xs" variant={"outline"}>
            Edit <Pencil />
          </Button>
        }
      />
      <DialogContent className="max-w-sm h-dvh max-h-dvh">
        <DialogHeader>
          <DialogTitle>Edit Banner</DialogTitle>
          {!banner.image_url && (
            <DialogDescription className="flex items-start w-fit gap-2 text-xs font-medium text-amber-700 bg-amber-100/80 border border-amber-400/70 rounded-md px-2 py-1 mt-1 shadow-[0_0_8px_rgba(245,158,11,0.25),inset_0_0_8px_rgba(245,158,11,0.08)]">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 drop-shadow-[0_0_5px_rgba(245,158,11,0.7)]" />

              <span className="wrap-break-word">
                Add banner image to make the banner visible to customers.
              </span>
            </DialogDescription>
          )}
        </DialogHeader>
        <form
          onSubmit={handleSubmit((v) => update(v))}
          className="space-y-4 pt-2 overflow-y-auto no-scrollbar"
        >
          <Field>
            <FieldLabel>Image</FieldLabel>
            <ImageUploadBox
              entityId={banner.id}
              existingUrl={banner.image_url}
              type="banner_image"
              onUploaded={(result) => {
                updateImage({
                  image_url: result.url,
                  image_file_id: result.fileId,
                });
              }}
              loading={imageUpdating}
            />
          </Field>

          <Controller
            name="link"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Link (optional)</FieldLabel>
                <Input
                  {...field}
                  placeholder="/product/[slug] or /category/[slug]"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="group_name"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Group</FieldLabel>
                <Input {...field} placeholder="main" />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="sort_order"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Sort Order</FieldLabel>
                <Input
                  type="number"
                  min={0}
                  value={field.value ?? 0}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid || !isDirty || isPending}>
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
