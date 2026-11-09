import { apiClient } from "@/lib/api/client";

export type ImageUploadType = "cover_image" | "product_image" | "category_image" | "banner_image" | "home_section_image"

interface uploadToImageKitParams {
    file: File,
    entityId: string,
    type: ImageUploadType
}

export async function uploadToImageKit({ file, entityId, type }: uploadToImageKitParams
): Promise<{ url: string; fileId: string }> {
    const authRes = await apiClient.post(`/admin/upload/${entityId}`, {
        fileName: file.name,
        type
    });
    const { token, uploadPayload } = authRes.data;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("token", token);
    Object.entries(uploadPayload as Record<string, string>).forEach(
        ([key, value]) => formData.append(key, value)
    );

    const ikRes = await fetch("https://upload.imagekit.io/api/v2/files/upload", {
        method: "POST",
        body: formData,
    });

    if (!ikRes.ok) {
        const err = await ikRes.json();
        throw new Error(err?.message ?? "Upload failed");
    }

    const data = await ikRes.json();
    return { url: data.url, fileId: data.fileId };
}
