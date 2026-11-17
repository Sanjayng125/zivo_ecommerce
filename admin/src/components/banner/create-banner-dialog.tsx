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
import { createBannerSchema, CreateBannerValues } from "@/schemas/banner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { Controller, Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";

export function CreateBannerDialog() {
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid, isDirty },
  } = useForm<CreateBannerValues>({
    resolver: zodResolver(createBannerSchema) as Resolver<CreateBannerValues>,
    defaultValues: {
      link: "",
      sort_order: 0,
      is_active: true,
      group_name: "main",
    },
  });

  const { mutate: create, isPending } = useMutation({
    mutationFn: async (values: CreateBannerValues) => {
      const payload = {
        ...values,
        link: values.link || undefined,
      };
      await apiClient.post("/admin/banners", payload);
    },
    onSuccess: () => {
      toast.success("Banner created");
      qc.invalidateQueries({ queryKey: ["banners"] });
      reset();
      setOpen(false);
    },
    onError: (err: AxiosError<ApiError>) => {
      toast.error(err.response?.data?.message ?? "Failed to create banner");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Banner
          </Button>
        }
      />
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>New Banner</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((v) => create(v))}
          className="space-y-4 pt-2"
        >
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
            <Button type="submit" disabled={!isValid || isPending}>
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
