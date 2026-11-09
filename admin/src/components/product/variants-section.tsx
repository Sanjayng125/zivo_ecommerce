"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient, ApiError } from "@/lib/api/client";
import { variantSchema } from "@/schemas/product";
import { ProductVariant } from "@/types";
import { formatPrice } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader2, Plus } from "lucide-react";
import { Controller, Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";
import { VariantRow } from "./variant-row";

type VariantFormValues = z.infer<typeof variantSchema>;

interface VariantsSectionProps {
  productId: string;
  variants: ProductVariant[];
  loading: boolean;
}

export function VariantsSection({
  productId,
  variants,
  loading,
}: VariantsSectionProps) {
  const qc = useQueryClient();

  const form = useForm<VariantFormValues>({
    resolver: zodResolver(variantSchema) as Resolver<VariantFormValues>,
    defaultValues: { sku: "", size: "", color: "", price: 0, stock: 0 },
  });

  const { mutate: addVariant, isPending: addingVariant } = useMutation({
    mutationFn: async (values: VariantFormValues) => {
      await apiClient.post(`/admin/products/${productId}/variants`, values);
    },
    onSuccess: () => {
      toast.success("Variant added");
      form.reset();
      qc.refetchQueries({ queryKey: ["product-variants", productId] });
    },
    onError: (err: AxiosError<ApiError>) => {
      toast.error(err.response?.data?.message ?? "Failed to add variant");
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Variants</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : variants.length === 0 ? (
          <p className="text-sm text-muted-foreground">No variants yet.</p>
        ) : (
          <div className="space-y-2">
            {variants.map((v) => (
              <VariantRow key={v.id} variant={v} productId={productId} />
            ))}
          </div>
        )}

        <form
          onSubmit={form.handleSubmit((v) => addVariant(v))}
          className="border rounded-md p-4 space-y-3"
        >
          <p className="text-sm font-medium text-muted-foreground">
            Add Variant
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {(["sku", "size", "color"] as const).map((key) => (
              <Controller
                key={key}
                name={key}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="capitalize">{key}</FieldLabel>
                    <Input {...field} placeholder={key} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            ))}
            {(["price", "stock"] as const).map((key) => (
              <Controller
                key={key}
                name={key}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="capitalize break-all">
                      {key}
                      {key === "price" &&
                        field.value > 0 &&
                        ` - ${formatPrice(field.value)}`}
                    </FieldLabel>
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
            ))}
          </div>
          <div className="flex justify-end">
            <Button type="submit" size="sm" disabled={addingVariant}>
              {addingVariant ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Variant
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
