"use client";
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
import { createCategorySchema, CreateCategoryValues } from "@/schemas/category";
import { CategoryWithSubcategories } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { Controller, Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import { InfiniteCategorySelect } from "../infinite-category-select";

interface CreateCategoryDialogProps {
  parentCategory?: CategoryWithSubcategories;
}

export function CreateCategoryDialog({
  parentCategory,
}: CreateCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();

  const { control, handleSubmit, reset } = useForm<CreateCategoryValues>({
    resolver: zodResolver(
      createCategorySchema,
    ) as Resolver<CreateCategoryValues>,
    defaultValues: {
      name: "",
      parent_id: parentCategory?.id,
      sort_order: 0,
      is_active: true,
    },
  });

  const { mutate: create, isPending } = useMutation({
    mutationFn: async (values: CreateCategoryValues) => {
      await apiClient.post("/admin/categories", values);
    },
    onSuccess: () => {
      toast.success(
        parentCategory
          ? `Subcategory added to ${parentCategory.name}`
          : "Category created",
      );
      qc.invalidateQueries({ queryKey: ["categories"] });
      reset();
      setOpen(false);
    },
    onError: (err: AxiosError<ApiError>) => {
      toast.error(err.response?.data?.message ?? "Failed to create category");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          parentCategory ? (
            <Button variant="ghost" size="sm">
              <Plus className="mr-1" />
              Add Sub
            </Button>
          ) : (
            <Button>
              <Plus className="mr-2" />
              New Category
            </Button>
          )
        }
      />
      <DialogContent className="max-w-sm overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {parentCategory
              ? `Add subcategory to "${parentCategory.name}"`
              : "New Category"}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((v) => create(v))}
          className="space-y-4 pt-2"
        >
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Name</FieldLabel>
                <Input {...field} placeholder="Category name" />
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
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {!parentCategory && (
            <Controller
              name="parent_id"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Parent Category</FieldLabel>
                  <InfiniteCategorySelect
                    value={field.value ?? ""}
                    onChange={(categoryId) => field.onChange(categoryId)}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          )}

          <Controller
            name="is_active"
            control={control}
            render={({ field }) => (
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  className="w-4 h-4"
                />
                <span className="text-sm">Active</span>
              </label>
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
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 animate-spin" />}
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
