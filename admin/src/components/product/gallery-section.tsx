"use client";
import { ImageUploadBox } from "@/components/image-upload-box";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient, ApiError } from "@/lib/api/client";
import { ProductImage } from "@/types";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { GripVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function SortableImageItem({
  image,
  productId,
  onDelete,
  deleting,
}: {
  image: ProductImage;
  productId: string;
  onDelete: (id: string) => void;
  deleting: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <button
        {...attributes}
        {...listeners}
        type="button"
        className="absolute top-1 left-1 z-10 bg-black/50 text-white rounded p-0.5 cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-3 h-3" />
      </button>
      <ImageUploadBox
        entityId={productId}
        existingUrl={image.url}
        onRemove={() => onDelete(image.id)}
        type="product_image"
        loading={deleting}
      />
    </div>
  );
}

interface GallerySectionProps {
  productId: string;
  images: ProductImage[];
  loading: boolean;
}

export function GallerySection({
  productId,
  images,
  loading,
}: GallerySectionProps) {
  const qc = useQueryClient();
  const [orderedImages, setOrderedImages] = useState<ProductImage[]>(images);

  useEffect(() => {
    setOrderedImages(images);
  }, [images]);

  const sensors = useSensors(useSensor(PointerSensor));

  const { mutate: reorder, isPending: reordering } = useMutation({
    mutationFn: async (reordered: ProductImage[]) => {
      await apiClient.patch(`/admin/products/${productId}/images/reorder`, {
        new_sort_order: reordered.map((img, index) => ({
          product_image_id: img.id,
          sort_order: index,
        })),
      });
    },
    onSuccess: () => {
      toast.success("Product images reordered");
    },
    onError: (err: AxiosError<ApiError>) => {
      toast.error(err.response?.data?.message ?? "Failed to reorder images");
      qc.invalidateQueries({ queryKey: ["product-images", productId] });
    },
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id || reordering) return;

    const oldIndex = orderedImages.findIndex((img) => img.id === active.id);
    const newIndex = orderedImages.findIndex((img) => img.id === over.id);
    const reordered = arrayMove(orderedImages, oldIndex, newIndex);

    setOrderedImages(reordered);
    reorder(reordered);
  }

  const { mutate: addImage, isPending: addingImage } = useMutation({
    mutationFn: async (result: { url: string; fileId: string }) => {
      await apiClient.post(`/admin/products/${productId}/images`, {
        url: result.url,
        file_id: result.fileId,
        sort_order: orderedImages.length,
      });
    },
    onSuccess: () => {
      toast.success("Image added");
      qc.invalidateQueries({ queryKey: ["product-images", productId] });
    },
    onError: (err: AxiosError<ApiError>) => {
      toast.error(err.response?.data?.message ?? "Failed to add image");
    },
  });

  const { mutate: deleteImage, isPending: deletingImage } = useMutation({
    mutationFn: async (image_id: string) => {
      await apiClient.delete(`/admin/products/${productId}/images/${image_id}`);
    },
    onSuccess: () => {
      toast.success("Image removed");
      qc.invalidateQueries({ queryKey: ["product-images", productId] });
    },
    onError: (err: AxiosError<ApiError>) => {
      toast.error(err.response?.data?.message ?? "Failed to remove image");
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gallery</CardTitle>
        <CardDescription>
          {!loading && orderedImages.length === 0
            ? "Add product images to make the product visible to customers"
            : "Drag to reorder. Add/Remove product images."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-md" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={orderedImages.map((img) => img.id)}
                strategy={rectSortingStrategy}
                disabled={reordering}
              >
                <div className="grid grid-cols-2 gap-3">
                  {orderedImages.map((img) => (
                    <SortableImageItem
                      key={img.id}
                      image={img}
                      productId={productId}
                      onDelete={(id) => deleteImage(id)}
                      deleting={deletingImage}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            <ImageUploadBox
              entityId={productId}
              existingUrl={null}
              onUploaded={(result) => addImage(result)}
              type="product_image"
              loading={addingImage}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
