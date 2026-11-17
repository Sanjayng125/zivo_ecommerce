"use client";
import { ImageUploadBox } from "@/components/image-upload-box";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { apiClient, ApiError } from "@/lib/api/client";
import {
  UpdateCategoryImageValues,
  updateCategorySchema,
  UpdateCategoryValues,
} from "@/schemas/category";
import { Category } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader2, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import { InfiniteCategorySelect } from "../infinite-category-select";

interface EditCategoryDialogProps {
  category: Category;
}

export function EditCategoryDialog({ category }: EditCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isValid },
  } = useForm<UpdateCategoryValues>({
    resolver: zodResolver(
      updateCategorySchema,
    ) as Resolver<UpdateCategoryValues>,
    defaultValues: {
      name: category.name,
      sort_order: category.sort_order,
      parent_id: category?.parent_id,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: category.name,
        sort_order: category.sort_order,
        parent_id: category?.parent_id,
      });
    }
  }, [open, category, reset]);

  const { mutate: update, isPending } = useMutation({
    mutationFn: async (values: UpdateCategoryValues) => {
      await apiClient.patch(`/admin/categories/${category.id}`, values);
    },
    onSuccess: () => {
      toast.success("Category updated");
      qc.invalidateQueries({ queryKey: ["categories"] });
      setOpen(false);
    },
    onError: (err: AxiosError<ApiError>) => {
      toast.error(err.response?.data?.message ?? "Failed to update category");
    },
  });

  const { mutate: updateImage, isPending: imageUpdating } = useMutation({
    mutationFn: async (values: UpdateCategoryImageValues) => {
      await apiClient.patch(`/admin/categories/${category.id}/image`, values);
    },
    onSuccess: () => {
      toast.success("Category image updated");
      qc.invalidateQueries({ queryKey: ["categories"] });
      setOpen(false);
    },
    onError: (err: AxiosError<ApiError>) => {
      toast.error(
        err.response?.data?.message ?? "Failed to update category image",
      );
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon">
            <Pencil />
          </Button>
        }
      />
      <DialogContent className="max-w-sm h-dvh max-h-dvh">
        <DialogHeader>
          <DialogTitle>Edit "{category.name}"</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((v) => update(v))}
          className="space-y-4 pt-2 overflow-y-auto no-scrollbar"
        >
          <Field>
            <FieldLabel>Image</FieldLabel>
            <ImageUploadBox
              entityId={category.id}
              existingUrl={category.image_url}
              type="category_image"
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
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Name</FieldLabel>
                <Input {...field} />
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

          <Controller
            name="parent_id"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Parent Category</FieldLabel>
                <InfiniteCategorySelect
                  value={field.value ?? ""}
                  onChange={(categoryId) => field.onChange(categoryId)}
                  excludeId={category.id}
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
            <Button type="submit" disabled={isPending || !isDirty || !isValid}>
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
