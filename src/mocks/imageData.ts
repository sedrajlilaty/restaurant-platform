const MAX_SIDE = 1400
const MAX_SIDE_PNG = 800

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

// بالباك الحقيقي الرابط بيكون دائم. هون منحوّل الصورة لرابط data ومنصغّرها
// حتى تضل محفوظة بالـ localStorage بعد تحديث الصفحة
export async function fileToDataUrl(file: File): Promise<string> {
  try {
    const png = file.type === "image/png"
    const bitmap = await createImageBitmap(file)
    const limit = png ? MAX_SIDE_PNG : MAX_SIDE
    const scale = Math.min(1, limit / Math.max(bitmap.width, bitmap.height))

    const canvas = document.createElement("canvas")
    canvas.width = Math.max(1, Math.round(bitmap.width * scale))
    canvas.height = Math.max(1, Math.round(bitmap.height * scale))

    const context = canvas.getContext("2d")
    if (!context) {
      bitmap.close()
      return await readAsDataUrl(file)
    }

    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()
    return canvas.toDataURL(png ? "image/png" : "image/jpeg", 0.82)
  } catch {
    return readAsDataUrl(file)
  }
}