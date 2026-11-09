"use client";
import { ImageUploadType, uploadToImageKit } from "@/lib/imagekit";
import { ImageIcon, Loader2, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";

interface ImageUploadBoxProps {
  entityId: string;
  existingUrl?: string | null;
  onUploaded?: (result: { url: string; fileId: string }) => void;
  onRemove?: () => void;
  type: ImageUploadType;
  loading?: boolean;
}

export function ImageUploadBox({
  entityId,
  existingUrl,
  onUploaded,
  onRemove,
  type,
  loading,
}: ImageUploadBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(existingUrl ?? null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setPreview(existingUrl ?? null);
  }, [existingUrl]);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !onUploaded) return;
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const result = await uploadToImageKit({ file, entityId, type });
      onUploaded(result);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setPreview(existingUrl ?? null);
      setUploading(false);
      if (inputRef.current) inputRef.current.files = null;
    }
  }

  return (
    <div className="relative aspect-square group">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
        disabled={uploading}
      />
      {preview ? (
        <>
          <Image
            src={preview}
            alt="preview"
            fill
            className="object-cover rounded-md border"
          />
          {(uploading || loading) && (
            <div className="absolute inset-0 bg-black/50 rounded-md flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            </div>
          )}
          {!uploading && (
            <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center gap-2">
              {onUploaded && (
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => inputRef.current?.click()}
                  disabled={loading}
                >
                  Change
                </Button>
              )}
              {onRemove && (
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={onRemove}
                  disabled={loading}
                >
                  <Trash />
                </Button>
              )}
              {loading && (
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  disabled
                  className={"text-white"}
                >
                  <Loader2 className="animate-spin" />
                </Button>
              )}
            </div>
          )}
        </>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading || loading}
          className="w-full h-full border-2 border-dashed border-muted-foreground/25 rounded-md flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-muted/50 transition-colors"
        >
          {uploading ? (
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          ) : (
            <>
              <ImageIcon className="w-6 h-6 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Upload</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
