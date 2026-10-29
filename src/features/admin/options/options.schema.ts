import { z } from "zod"
import type { MoneyDraft } from "@/components/shared/MoneyInput"
import { requiredText } from "@/lib/validation"
import { parseSyp, parseUsd } from "../products/products.schema"
import type { AdminOptionChoice, ProductOptions } from "./options.types"

export type ChoiceDraft = {
  id: string
  nameAr: string
  nameEn: string
  price: MoneyDraft
  isDefault: boolean
}

export type GroupDraft = {
  id: string
  nameAr: string
  nameEn: string
  type: "single" | "multiple"
  required: boolean
  min: string
  max: string // فاضي = بلا حد
  choices: ChoiceDraft[]
}

export type OptionsDraft = { sizes: ChoiceDraft[]; groups: GroupDraft[] }

const parseCount = (value: string): number | null => {
  const text = value.trim().replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
  return /^\d{1,3}$/.test(text) ? Number(text) : null
}

// الزيادة ممكن تكون صفر (مثل الحجم الصغير)
const priceDraft = z.object({ usd: z.string(), syp: z.string() }).superRefine((value, ctx) => {
  if (parseUsd(value.usd) === null) {
    ctx.addIssue({ code: "custom", path: ["usd"], message: "options.errors.usd" })
  }
  if (parseSyp(value.syp) === null) {
    ctx.addIssue({ code: "custom", path: ["syp"], message: "options.errors.syp" })
  }
})

const choiceSchema = z.object({
  id: z.string(),
  nameAr: requiredText(60),
  nameEn: requiredText(60),
  price: priceDraft,
  isDefault: z.boolean(),
})

const groupSchema = z
  .object({
    id: z.string(),
    nameAr: requiredText(60),
    nameEn: requiredText(60),
    type: z.enum(["single", "multiple"]),
    required: z.boolean(),
    min: z.string(),
    max: z.string(),
    choices: z.array(choiceSchema).min(1, "options.errors.noChoices"),
  })
  .superRefine((group, ctx) => {
    const defaults = group.choices.filter((choice) => choice.isDefault).length

    if (group.type === "single") {
      if (defaults > 1) ctx.addIssue({ code: "custom", path: ["choices"], message: "options.errors.oneDefault" })
      return
    }

    const min = group.min.trim() === "" ? 0 : parseCount(group.min)
    const hasMax = group.max.trim() !== ""
    const max = hasMax ? parseCount(group.max) : null

    if (min === null) ctx.addIssue({ code: "custom", path: ["min"], message: "options.errors.count" })
    if (hasMax && max === null) ctx.addIssue({ code: "custom", path: ["max"], message: "options.errors.count" })
    if (max !== null && max < 1) ctx.addIssue({ code: "custom", path: ["max"], message: "options.errors.maxLow" })
    if (min !== null && max !== null && max >= 1 && min > max) {
      ctx.addIssue({ code: "custom", path: ["max"], message: "options.errors.minMax" })
    }
    if (min !== null && min > group.choices.length) {
      ctx.addIssue({ code: "custom", path: ["min"], message: "options.errors.minTooHigh" })
    }
    if (max !== null && max >= 1 && defaults > max) {
      ctx.addIssue({ code: "custom", path: ["choices"], message: "options.errors.tooManyDefaults" })
    }
  })

const optionsSchema = z
  .object({ sizes: z.array(choiceSchema), groups: z.array(groupSchema) })
  .superRefine((value, ctx) => {
    if (value.sizes.filter((choice) => choice.isDefault).length > 1) {
      ctx.addIssue({ code: "custom", path: ["sizes"], message: "options.errors.oneDefault" })
    }
  })

// بيرجّع الأخطاء حسب المسار ("groups.0.choices.1.nameAr")، وفاضي إذا كل شي سليم
export function validateOptions(draft: OptionsDraft): Record<string, string> {
  const result = optionsSchema.safeParse(draft)
  if (result.success) return {}

  const errors: Record<string, string> = {}
  for (const issue of result.error.issues) {
    const path = issue.path.map(String).join(".")
    if (!(path in errors)) errors[path] = issue.message
  }
  return errors
}

export const newChoice = (): ChoiceDraft => ({
  id: crypto.randomUUID(),
  nameAr: "",
  nameEn: "",
  price: { usd: "0", syp: "0" },
  isDefault: false,
})

export const newGroup = (): GroupDraft => ({
  id: crypto.randomUUID(),
  nameAr: "",
  nameEn: "",
  type: "single",
  required: false,
  min: "0",
  max: "",
  choices: [newChoice()],
})

const toChoiceDraft = (choice: AdminOptionChoice): ChoiceDraft => ({
  id: choice.id,
  nameAr: choice.name.ar,
  nameEn: choice.name.en,
  price: { usd: String(choice.price.usd), syp: String(choice.price.syp) },
  isDefault: choice.isDefault,
})

export function toDraft(options: ProductOptions): OptionsDraft {
  return {
    sizes: options.sizes.map(toChoiceDraft),
    groups: options.groups.map((group) => ({
      id: group.id,
      nameAr: group.name.ar,
      nameEn: group.name.en,
      type: group.type,
      required: group.required,
      min: String(group.min),
      max: group.max === null ? "" : String(group.max),
      choices: group.choices.map(toChoiceDraft),
    })),
  }
}

const toChoice = (choice: ChoiceDraft): AdminOptionChoice => ({
  id: choice.id,
  name: { ar: choice.nameAr.trim(), en: choice.nameEn.trim() },
  price: { usd: parseUsd(choice.price.usd) ?? 0, syp: parseSyp(choice.price.syp) ?? 0 },
  isDefault: choice.isDefault,
})

export function toInput(draft: OptionsDraft): ProductOptions {
  return {
    sizes: draft.sizes.map(toChoice),
    groups: draft.groups.map((group) => {
      const single = group.type === "single"
      return {
        id: group.id,
        name: { ar: group.nameAr.trim(), en: group.nameEn.trim() },
        type: group.type,
        required: group.required,
        min: single ? (group.required ? 1 : 0) : (parseCount(group.min) ?? 0),
        max: single ? 1 : group.max.trim() === "" ? null : parseCount(group.max),
        choices: group.choices.map(toChoice),
      }
    }),
  }
}