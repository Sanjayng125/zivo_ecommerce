export const uploadToImageKit = (file: any, token: string, uploadPayload: any): Promise<{ url: string, fileId: string }> => {
    return new Promise((resolve, reject) => {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("token", token)
        Object.keys(uploadPayload).forEach(key => formData.append(key, uploadPayload[key]))

        const xhr = new XMLHttpRequest()
        xhr.open("POST", "https://upload.imagekit.io/api/v2/files/upload")
        xhr.onload = () => {
            const data = JSON.parse(xhr.responseText)
            if (xhr.status === 200) resolve({ url: data.url, fileId: data.fileId })
            else reject(new Error(data.message))
        }
        xhr.onerror = () => reject(new Error("Upload failed"))
        xhr.send(formData)
    })
}
