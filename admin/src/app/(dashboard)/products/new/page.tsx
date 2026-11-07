"use client";
import { InfiniteCategorySelect } from "@/components/infinite-category-select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiClient, ApiError } from "@/lib/api/client";
import { creatSchema } from "@/schemas/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";

type FormValues = z.infer<typeof creatSchema>;

const NewProductPage = () => {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(creatSchema) as Resolver<FormValues>,
    defaultValues: {
      title: "",
      description: "",
      base_price: 0,
      category_id: "",
      is_active: true,
    },
  });

  const { mutate: create, isPending } = useMutation({
    mutationFn: async (values: FormValues) => {
      const res = await apiClient.post("/admin/products", values);

      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Product created. Now add images and variants.");
      router.push(`/products/${data?.product.slug}/edit`);
    },
    onError: (err: AxiosError<ApiError>) => {
      const message = err.response?.data?.message ?? "Failed to create product";

      toast.error(message);
    },
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">New Product</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      <form
        onSubmit={form.handleSubmit((v) => create(v))}
        className="space-y-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>Basic Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Controller
              name="title"
              control={form.control}
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
              control={form.control}
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
                control={form.control}
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
                control={form.control}
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
              control={form.control}
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
            Create & Continue
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewProductPage;
