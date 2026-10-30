import { z } from "zod"
import { parseCount, parseSyp, parseUsd } from "@/lib/money"
import { requiredText } from "@/lib/validation"
import type { Plan, PlanInput } from "./plans.types"

// المبلغ ممكن يكون صفر (باقة مجانية)، بس لازم يكون رقم صحيح
const priceDraft = z.object({ usd: z.string(), syp: z.string() }).superRefine((value, ctx) => {
  if (parseUsd(value.usd) === null) {
    ctx.addIssue({ code: "custom", path: ["usd"], message: "plans.errors.usd" })
  }
  if (parseSyp(value.syp) === null) {
    ctx.addIssue({ code: "custom", path: ["syp"], message: "plans.errors.syp" })
  }
})

export const planSchema = z.object({
  name: requiredText(60),
  description: z.string().trim().max(300, "validation.tooLong"),
  type: requiredText(30),
  price: priceDraft,
  durationMonths: z.string().refine((value) => {
    const months = parseCount(value)
    return months !== null && months >= 1 && months <= 120
  }, "plans.errors.months"),
  isActive: z.boolean(),
})

export type PlanFormValues = z.infer<typeof planSchema>

export function toFormValues(plan?: Plan): PlanFormValues {
  return {
    name: plan?.name ?? "",
    description: plan?.description ?? "",
    type: plan?.type ?? "",
    price: {
      usd: plan ? String(plan.price.usd) : "",
      syp: plan ? String(plan.price.syp) : "",
    },
    durationMonths: plan ? String(plan.durationMonths) : "1",
    isActive: plan?.isActive ?? true,
  }
}

export function toInput(values: PlanFormValues): PlanInput {
  return {
    name: values.name,
    description: values.description,
    type: values.type,
    price: { usd: parseUsd(values.price.usd) ?? 0, syp: parseSyp(values.price.syp) ?? 0 },
    durationMonths: parseCount(values.durationMonths) ?? 1,
    isActive: values.isActive,
  }
}