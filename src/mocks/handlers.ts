import { http, HttpResponse } from "msw"
import { tenants } from "./data"

export const handlers = [
  http.get("/api/public/restaurant", ({ request }) => {
    const host = new URL(request.url).searchParams.get("host") ?? ""
    const tenant = tenants[host]
    if (!tenant) return HttpResponse.json({ message: "Not found" }, { status: 404 })
    return HttpResponse.json(tenant)
  }),

  http.post("/api/auth/login", async ({ request }) => {
    const { email, password } = (await request.json()) as { email: string; password: string }
    if (password === "123456" && email === "admin@demo.com") {
      return HttpResponse.json({ token: "mock-owner-token", user: { id: "u1", name: "Demo Owner", role: "owner" } })
    }
    if (password === "123456" && email === "super@platform.com") {
      return HttpResponse.json({ token: "mock-super-token", user: { id: "u0", name: "Platform Admin", role: "superadmin" } })
    }
    return HttpResponse.json({ message: "Invalid credentials" }, { status: 401 })
  }),
]