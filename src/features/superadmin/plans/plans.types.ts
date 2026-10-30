import type { Money } from "@/types"

// أعمدة جدول Plan: الاسم والوصف نص عادي (مو عربي وإنكليزي)
export type Plan = {
  id: string
  name: string
  description: string
  price: Money
  durationMonths: number
  type: string // Plan_Type، قيمو بتتحدد مع الباك
  isActive: boolean
}

export type PlanInput = Omit<Plan, "id">