import { z } from "zod"
import { requiredText } from "@/lib/validation"
import type { AdminProduct, ProductInput } from "./products.types"

// الأرقام العربية (٠١٢٣) بتتحول للاتينية قبل التحقق
const latinDigits = (value: string) =>
  value.trim().replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))

// دولار: حتى منزلتين عشريتين
export function parseUsd(value: string): number | null {
  const text = latinDigits(value).replace(/[٫,]/g, ".")
  return /^\d+(\.\d{1,2})?$/.test(text) ? Number(text) : null
}

// ليرة: رقم صحيح، والفواصل والمسافات بتنشال (110,500)
export function parseSyp(value: string): number | null {
  const text = latinDigits(value).replace(/[,٬\s]/g, "")
  return /^\d+$/.test(text) ? Number(text) : null
}

const priceDraft = z
  .object({ usd: z.string(), syp: z.string() })
  .superRefine((value, ctx) => {
    const usd = parseUsd(value.usd)
    const syp = parseSyp(value.syp)
    if (usd === null || usd <= 0) {
      ctx.addIssue({ code: "custom", path: ["usd"], message: "products.errors.usd" })
    }
    if (syp === null || syp <= 0) {
      ctx.addIssue({ code: "custom", path: ["syp"], message: "products.errors.syp" })
    }
  })

export const productSchema = z
  .object({
    nameAr: requiredText(80),
    nameEn: requiredText(80),
    descriptionAr: z.string().trim().max(300, "validation.tooLong"),
    descriptionEn: z.string().trim().max(300, "validation.tooLong"),
    categoryId: z.string().min(1, "validation.required"),
    price: priceDraft,
    oldPrice: z.object({ usd: z.string(), syp: z.string() }),
    imageUrl: z.string().nullable(),
    isAvailable: z.boolean(),
  })
  .superRefine((value, ctx) => {
    // السعر القديم اختياري، بس إذا انكتب لازم يكون بالعملتين وأعلى من الحالي
    if (value.oldPrice.usd.trim() === "" && value.oldPrice.syp.trim() === "") return

    const usd = parseUsd(value.price.usd)
    const syp = parseSyp(value.price.syp)
    const oldUsd = parseUsd(value.oldPrice.usd)
    const oldSyp = parseSyp(value.oldPrice.syp)

    if (oldUsd === null || (usd !== null && oldUsd <= usd)) {
      ctx.addIssue({ code: "custom", path: ["oldPrice", "usd"], message: "products.errors.oldUsd" })
    }
    if (oldSyp === null || (syp !== null && oldSyp <= syp)) {
      ctx.addIssue({ code: "custom", path: ["oldPrice", "syp"], message: "products.errors.oldSyp" })
    }
  })

export type ProductFormValues = z.infer<typeof productSchema>

export function toFormValues(product?: AdminProduct): ProductFormValues {
  return {
    nameAr: product?.name.ar ?? "",
    nameEn: product?.name.en ?? "",
    descriptionAr: product?.description.ar ?? "",
    descriptionEn: product?.description.en ?? "",
    categoryId: product?.categoryId ?? "",
    price: {
      usd: product ? String(product.price.usd) : "",
      syp: product ? String(product.price.syp) : "",
    },
    oldPrice: {
      usd: product?.oldPrice ? String(product.oldPrice.usd) : "",
      syp: product?.oldPrice ? String(product.oldPrice.syp) : "",
    },
    imageUrl: product?.imageUrl ?? null,
    isAvailable: product?.isAvailable ?? true,
  }
}

export function toInput(values: ProductFormValues): ProductInput {
  const hasOldPrice = values.oldPrice.usd.trim() !== "" || values.oldPrice.syp.trim() !== ""

  return {
    categoryId: values.categoryId,
    name: { ar: values.nameAr, en: values.nameEn },
    description: { ar: values.descriptionAr, en: values.descriptionEn },
    price: { usd: parseUsd(values.price.usd) ?? 0, syp: parseSyp(values.price.syp) ?? 0 },
    oldPrice: hasOldPrice
      ? { usd: parseUsd(values.oldPrice.usd) ?? 0, syp: parseSyp(values.oldPrice.syp) ?? 0 }
      : null,
    imageUrl: values.imageUrl,
    isAvailable: values.isAvailable,
  }
}