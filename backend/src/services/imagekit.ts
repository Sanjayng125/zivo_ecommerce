import ImageKit from "@imagekit/nodejs";
import jwt from "jsonwebtoken";

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
});

export const generateUploadAuth = (folder: string, fileName: string, expiresIn: number = 300) => {
    const uploadPayload = {
        fileName,
        folder: `/zivo/${folder}`,
        useUniqueFileName: "true",
        isPrivateFile: "false",
    };

    const token = jwt.sign(uploadPayload, process.env.IMAGEKIT_PRIVATE_KEY!, {
        expiresIn: expiresIn, // default 5mins
        header: {
            alg: "HS256",
            typ: "JWT",
            kid: process.env.IMAGEKIT_PUBLIC_KEY,
        }
    });

    return ({ token, uploadPayload });
};

export const deleteImage = async (fileId: string) => {
    try {
        await imagekit.files.delete(fileId)
    } catch (e) {
        console.error("ImageKit delete failed:", e)
    }
}

export default imagekit;
