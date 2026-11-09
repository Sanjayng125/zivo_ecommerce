"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiClient, ApiError } from "@/lib/api/client";
import { variantUpdateSchema } from "@/schemas/product";
import { ProductVariant } from "@/types";
import { formatPrice } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader2, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Field, FieldError, FieldLabel } from "../ui/field";

type VariantFormValues = z.infer<typeof variantUpdateSchema>;

export function VariantRow({
  variant,
  productId,
}: {
  variant: ProductVariant;
  productId: string;
}) {
  const qc = useQueryClient();
  const [stock, setStock] = useState(variant.stock);

  const {
    reset,
    control,
    handleSubmit,
    formState: { isDirty, isValid },
    getValues,
  } = useForm<VariantFormValues>({
    resolver: zodResolver(variantUpdateSchema) as Resolver<VariantFormValues>,
    defaultValues: { size: "", color: "", price: 0 },
  });

  useEffect(() => {
    reset({
      price: variant?.price ?? 0,
      color: variant?.color ?? "",
      size: variant?.size ?? "",
    });
  }, [variant, reset]);

  const { mutate: updateVariant, isPending: updatingVariant } = useMutation({
    mutationFn: async (values: VariantFormValues) => {
      const res = await apiClient.patch(
        `/admin/products/${productId}/variants/${variant.id}`,
        values,
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Product variant updated");
      qc.refetchQueries({ queryKey: ["product-variants", productId] });
    },
    onError: (err: AxiosError<ApiError>) => {
      toast.error(
        err.response?.data?.message ?? "Failed to update product variant",
      );
    },
  });

  const { mutate: deleteVariant, isPending: deletingVariant } = useMutation({
    mutationFn: async () => {
      await apiClient.delete(
        `/admin/products/${productId}/variants/${variant.id}`,
      );
    },
    onSuccess: () => {
      toast.success("Variant deleted");
      qc.refetchQueries({ queryKey: ["product-variants", productId] });
    },
    onError: (err: AxiosError<ApiError>) => {
      toast.error(err.response?.data?.message ?? "Failed to delete variant");
    },
  });

  const { mutate: updateStock, isPending: updatingStock } = useMutation({
    mutationFn: async (newStock: number) => {
      await apiClient.patch(
        `/admin/products/${productId}/variants/${variant.id}/stock`,
        { stock: newStock },
      );
    },
    onSuccess: (_, newStock) => {
      setStock(newStock);
      qc.refetchQueries({ queryKey: ["product-variants", productId] });
      toast.success("Stock updated");
    },
    onError: (err: AxiosError<ApiError>) => {
      toast.error(err.response?.data?.message ?? "Failed to update stock");
      setStock(variant.stock);
    },
  });

  return (
    <div className="flex flex-col p-3 border rounded-md gap-2">
      <div className="flex flex-row items-center gap-2 flex-wrap min-w-0">
        <span className="text-xs font-mono text-muted-foreground shrink-0">
          {variant.sku}
        </span>
        {variant.size && <Badge variant="outline">{variant.size}</Badge>}
        {variant.color && <Badge variant="outline">{variant.color}</Badge>}
        <span className="text-sm font-medium">
          {formatPrice(variant.price)}
        </span>

        <Field>
          <FieldLabel>Stock</FieldLabel>
          <div className="flex flex-row items-center gap-2">
            <Input
              type="number"
              min={0}
              value={stock}
              onChange={(e) => setStock(e.target.valueAsNumber)}
              onBlur={() => {
                if (stock !== variant.stock) updateStock(stock);
              }}
              disabled={updatingStock}
              className="max-w-20 h-8"
            />
            {updatingStock && <Loader2 className="animate-spin opacity-80" />}
          </div>
        </Field>
      </div>

      <form
        onSubmit={handleSubmit((v) => updateVariant(v))}
        className="space-y-4"
      >
        <div className="grid sm:grid-cols-2 gap-2">
          <Controller
            name="color"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Color</FieldLabel>
                <Input {...field} placeholder="Variant Color" />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="size"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Size</FieldLabel>
                <Input {...field} placeholder="Variant Size" />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="price"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Price - {formatPrice(field.value)}</FieldLabel>
                <Input
                  {...field}
                  placeholder="Variant Price"
                  type="number"
                  value={field.value}
                  onChange={(e) =>
                    !isNaN(Number(e.target.value)) &&
                    field.onChange(Number(e.target.value))
                  }
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <div className="flex flex-row items-center gap-2 shrink-0">
          <Button
            variant="secondary"
            type="submit"
            size={"sm"}
            disabled={
              deletingVariant ||
              updatingStock ||
              updatingVariant ||
              !isValid ||
              !isDirty
            }
          >
            Save{" "}
            {updatingVariant ? <Loader2 className="animate-spin" /> : <Save />}
          </Button>
          <Button
            type="button"
            variant="destructive"
            size={"sm"}
            onClick={() => deleteVariant()}
            disabled={deletingVariant || updatingStock || updatingVariant}
          >
            Delete{" "}
            {deletingVariant ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Trash2 />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
