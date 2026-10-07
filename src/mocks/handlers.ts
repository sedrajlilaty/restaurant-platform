import { http, HttpResponse } from "msw"
import { tenants } from "./data"

export const handlers = [
  http.get("/api/public/restaurant", ({ request }) => {
    const host = new URL(request.url).searchParams.get("host") ?? ""
    const tenant = tenants[host]
    if (!tenant) return HttpResponse.json({ message: "Not found" }, { status: 404 })
    return HttpResponse.json(tenant)
  }),
]