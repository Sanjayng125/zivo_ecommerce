"use client";
import { InfiniteCategorySelect } from "@/components/infinite-category-select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiClient, ApiError } from "@/lib/api/client";
import { updateSchema } from "@/schemas/product";
import { Product } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Controller, Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";

type FormValues = z.infer<typeof updateSchema>;

interface DetailsFormProps {
  product: Product;
  slug: string;
}

export function DetailsForm({ product, slug }: DetailsFormProps) {
  const qc = useQueryClient();

  const {
    control,
    reset,
    handleSubmit,
    formState: { isDirty, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(updateSchema) as Resolver<FormValues>,
    defaultValues: {
      title: "",
      description: "",
      base_price: 0,
      category_id: "",
      cover_image: "",
      cover_image_file_id: "",
      is_active: true,
    },
  });

  useEffect(() => {
    reset({
      title: product.title,
      description: product.description,
      base_price: product.base_price,
      category_id: product.category_id,
      cover_image: product.cover_image ?? "",
      cover_image_file_id: product.cover_image_file_id ?? "",
      is_active: product.is_active,
    });
  }, [product, reset]);

  const { mutate: update, isPending } = useMutation({
    mutationFn: async (values: FormValues) => {
      const res = await apiClient.patch(
        `/admin/products/${product.id}`,
        values,
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Product updated");
      qc.invalidateQueries({ queryKey: ["product", slug] });
    },
    onError: (err: AxiosError<ApiError>) => {
      toast.error(err.response?.data?.message ?? "Failed to update product");
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit((v) => update(v))} className="space-y-4">
          <Controller
            name="title"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Title</FieldLabel>
                <Input {...field} placeholder="Product title" />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Description</FieldLabel>
                <Textarea {...field} rows={5} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="base_price"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Base Price (₹) - in paise</FieldLabel>
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

            <Controller
              name="category_id"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Category</FieldLabel>
                  <InfiniteCategorySelect
                    value={field.value}
                    onChange={(val) => field.onChange(val ?? "")}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

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
                <span className="text-sm">Active (visible to customers)</span>
              </label>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending || !isDirty || !isValid}>
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Details
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
