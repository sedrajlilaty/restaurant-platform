import { z } from "zod"

export const requiredText = (max = 100) =>
  z.string().trim().min(1, "validation.required").max(max, "validation.tooLong")

// 09xxxxxxxx أو +9639xxxxxxxx، مع أو بدون مسافات وشرطات
export const phone = z
  .string()
  .trim()
  .transform((value) => value.replace(/[\s-]/g, ""))
  .refine((value) => /^(\+?963|0)?9\d{8}$/.test(value), "validation.phone")