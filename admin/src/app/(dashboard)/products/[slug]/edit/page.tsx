"use client";
import { ImageUploadBox } from "@/components/image-upload-box";
import { DetailsForm } from "@/components/product/details-form";
import { GallerySection } from "@/components/product/gallery-section";
import { VariantsSection } from "@/components/product/variants-section";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient, ApiError } from "@/lib/api/client";
import { Product, ProductImage, ProductVariant } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { toast } from "sonner";

const EditProductPage = ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = use(params);
  const router = useRouter();
  const qc = useQueryClient();

  const {
    data: product,
    isLoading: loadingProduct,
    error: productError,
  } = useQuery<Product>({
    queryKey: ["product", slug],
    queryFn: async () => {
      const res = await apiClient.get(`/admin/products/${slug}`);
      return res.data?.product;
    },
    enabled: !!slug,
  });

  const { data: variants = [], isLoading: loadingVariants } = useQuery<
    ProductVariant[]
  >({
    queryKey: ["product-variants", product?.id],
    queryFn: async () => {
      const res = await apiClient.get(
        `/admin/products/${product!.id}/variants`,
      );
      return res.data?.productVariants ?? [];
    },
    enabled: !!product?.id,
  });

  const { data: images = [], isLoading: loadingImages } = useQuery<
    ProductImage[]
  >({
    queryKey: ["product-images", product?.id],
    queryFn: async () => {
      const res = await apiClient.get(`/admin/products/${product!.id}/images`);
      return res.data?.productImages ?? [];
    },
    enabled: !!product?.id,
  });

  const { mutate: saveCover } = useMutation({
    mutationFn: async (result: { url: string; fileId: string }) => {
      await apiClient.patch(`/admin/products/${product!.id}`, {
        cover_image: result.url,
        cover_image_file_id: result.fileId,
      });
    },
    onSuccess: () => {
      toast.success("Cover image updated");
      qc.invalidateQueries({ queryKey: ["product", slug] });
    },
    onError: (err: AxiosError<ApiError>) => {
      toast.error(err.response?.data?.message ?? "Failed to save cover");
    },
  });

  if (loadingProduct) {
    return (
      <div className="mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="mx-auto text-center py-20 space-y-4">
        <p className="text-muted-foreground">Product not found.</p>
        <Button onClick={() => router.push("/products")}>
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Edit Product</h1>
          <p className="text-sm text-muted-foreground">{product.slug}</p>
        </div>
        <Button variant="outline" onClick={() => router.push("/products")}>
          Back
        </Button>
      </div>

      {((!loadingImages && images.length === 0) ||
        (!loadingVariants && variants.length === 0)) && (
        <div className="flex items-start w-fit gap-2 text-sm font-medium text-amber-700 bg-amber-100/80 border border-amber-400/70 rounded-md px-3 py-2 my-3 shadow-[0_0_8px_rgba(245,158,11,0.25),inset_0_0_8px_rgba(245,158,11,0.08)]">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 drop-shadow-[0_0_5px_rgba(245,158,11,0.7)]" />

          <p className="wrap-break-word">
            Add at least one product image and variant to make the product
            visible to customers.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DetailsForm product={product} slug={slug} />
          <VariantsSection
            productId={product.id}
            variants={variants}
            loading={loadingVariants}
          />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cover Image</CardTitle>
              <CardDescription>
                {!loadingProduct && !product?.cover_image
                  ? "Add product cover image to make the product visible to customers"
                  : "Change Product Cover Image"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUploadBox
                entityId={product.id}
                existingUrl={product.cover_image}
                onUploaded={(result) => saveCover(result)}
                type="cover_image"
              />
            </CardContent>
          </Card>

          <GallerySection
            productId={product.id}
            images={images}
            loading={loadingImages}
          />
        </div>
      </div>
    </div>
  );
};

export default EditProductPage;
