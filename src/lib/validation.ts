import { z } from "zod"

export const requiredText = (max = 100) =>
  z.string().trim().min(1, "validation.required").max(max, "validation.tooLong")

// يقبل 09xxxxxxxx أو +9639xxxxxxxx مع مسافات أو شرطات
export const phone = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s-]/g, ""))
  .refine((v) => /^(\+?963|0)?9\d{8}$/.test(v), "validation.phone")

export const price = z.coerce.number({ invalid_type_error: "validation.number" }).min(0, "validation.priceMin")