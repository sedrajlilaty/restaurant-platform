import type { Plan, PlanInput } from "@/features/superadmin"
import { persistentList } from "./db"

// باقات تجريبية، ونوع الباقة قيم مؤقتة لحد ما ينحسم مع الباك
const seed = (): Plan[] => [
  {
    id: "plan-basic",
    name: "Basic",
    description: "For small restaurants that are just starting.",
    price: { usd: 10, syp: 130000 },
    durationMonths: 1,
    type: "basic",
    isActive: true,
  },
  {
    id: "plan-standard",
    name: "Standard",
    description: "Coupons, QR tables and a custom theme.",
    price: { usd: 25, syp: 325000 },
    durationMonths: 3,
    type: "standard",
    isActive: true,
  },
  {
    id: "plan-premium",
    name: "Premium",
    description: "Every feature for a full year.",
    price: { usd: 90, syp: 1170000 },
    durationMonths: 12,
    type: "premium",
    isActive: true,
  },
]

const db = persistentList<Plan>("plans", seed)

export const plansDb = {
  list: (): Plan[] => db.list,

  create(input: PlanInput): Plan {
    const created: Plan = { id: crypto.randomUUID(), ...input }
    db.list = [...db.list, created]
    return created
  },

  update(id: string, patch: Partial<PlanInput>): Plan | null {
    const current = db.list.find((plan) => plan.id === id)
    if (!current) return null
    const updated: Plan = { ...current, ...patch }
    db.list = db.list.map((plan) => (plan.id === id ? updated : plan))
    return updated
  },
}