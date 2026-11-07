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
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";
import { Controller, Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";

type FormValues = z.infer<typeof updateSchema>;

const EditProductPage = ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = use(params);

  const router = useRouter();

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["product"],
    queryFn: async () => {
      const res = await apiClient.get(`/admin/products/${slug}`);
      return res.data?.product;
    },
    enabled: !!slug,
  });

  const { control, reset, handleSubmit, formState } = useForm<FormValues>({
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
    if (product) {
      reset({
        title: product?.title,
        description: product?.description,
        base_price: product?.base_price,
        category_id: product?.category_id,
        cover_image: product?.cover_image,
        cover_image_file_id: product?.cover_image_file_id,
        is_active: product?.is_active,
      });
    }
  }, [product]);

  const { mutate: update, isPending } = useMutation({
    mutationFn: async (values: FormValues) => {
      const res = await apiClient.patch("/admin/products", values);

      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Product updated");
    },
    onError: (err: AxiosError<ApiError>) => {
      const message = err.response?.data?.message ?? "Failed to update product";

      toast.error(message);
    },
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Product</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
      </div>

      <form onSubmit={handleSubmit((v) => update(v))} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                  <Textarea
                    {...field}
                    placeholder="Product description"
                    rows={5}
                  />
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
                    <FieldLabel>Base Price (₹)</FieldLabel>
                    <Input
                      type="number"
                      min={0}
                      placeholder="0"
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
                      onChange={(val) =>
                        val ? field.onChange(val) : field.onChange("")
                      }
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
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Update
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProductPage;
