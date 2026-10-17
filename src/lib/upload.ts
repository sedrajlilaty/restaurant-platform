import { api } from "./api"

export const IMAGE_MAX_BYTES = 2 * 1024 * 1024
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]

// بيرفع الصورة ويرجّع رابطها
export async function uploadImage(file: File) {
  const body = new FormData()
  body.append("file", file)
  const { data } = await api.post<{ url: string }>("/admin/uploads", body)
  return data.url
}