import { z } from "zod"

export const requiredText = (max = 100) =>
  z.string().trim().min(1, "validation.required").max(max, "validation.tooLong")

const PHONE = /^(\+?963|0)?9\d{8}$/
const normalizePhone = (value: string) => value.replace(/[\s-]/g, "")

// 09xxxxxxxx أو +9639xxxxxxxx، مع أو بدون مسافات وشرطات
export const phone = z
  .string()
  .trim()
  .transform(normalizePhone)
  .refine((value) => PHONE.test(value), "validation.phone")

// رقم اختياري: الفاضي مقبول
export const optionalPhone = z
  .string()
  .trim()
  .transform(normalizePhone)
  .refine((value) => value === "" || PHONE.test(value), "validation.phone")