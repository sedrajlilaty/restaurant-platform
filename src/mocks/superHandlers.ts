import { delay, http, HttpResponse } from "msw"
import type { PlanInput } from "@/features/superadmin"
import { plansDb } from "./plansData"

export const superHandlers = [
  // الباقات
  http.get("/api/super/plans", async () => {
    await delay(300)
    return HttpResponse.json(plansDb.list())
  }),

  http.post("/api/super/plans", async ({ request }) => {
    await delay(400)
    const input = (await request.json()) as PlanInput
    return HttpResponse.json(plansDb.create(input), { status: 201 })
  }),

  http.patch("/api/super/plans/:id", async ({ params, request }) => {
    await delay(300)
    const patch = (await request.json()) as Partial<PlanInput>
    const updated = plansDb.update(String(params.id), patch)
    if (!updated) return HttpResponse.json({ message: "Not found" }, { status: 404 })
    return HttpResponse.json(updated)
  }),
]