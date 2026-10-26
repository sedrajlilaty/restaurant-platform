import type { AuthUser } from "@/features/auth"
import { persistentValue } from "./db"

type MockAccount = AuthUser & { email: string; password: string; token: string }

// الحسابات التجريبية بتنحفظ بـ localStorage: الاسم وكلمة السر المعدّلين بيضلوا بعد تحديث الصفحة
const accounts = persistentValue<MockAccount[]>("accounts", () => [
  { id: "u1", email: "admin@demo.com", password: "123456", name: "Demo Owner", role: "owner", token: "mock-owner-token" },
  { id: "u0", email: "super@platform.com", password: "123456", name: "Platform Admin", role: "superadmin", token: "mock-super-token" },
])

const toUser = ({ id, name, role }: MockAccount): AuthUser => ({ id, name, role })

export const tokenFrom = (request: Request) => request.headers.get("Authorization")?.replace("Bearer ", "") ?? ""

export function findAccount(email: string, password: string) {
  const account = accounts.value.find((a) => a.email === email && a.password === password)
  return account ? { token: account.token, user: toUser(account) } : null
}

export function renameAccount(token: string, name: string): AuthUser | null {
  const list = accounts.value
  const account = list.find((a) => a.token === token)
  if (!account) return null
  account.name = name
  accounts.value = list
  return toUser(account)
}

export function changeAccountPassword(
  token: string,
  currentPassword: string,
  newPassword: string,
): "ok" | "wrong_password" | "unauthorized" {
  const list = accounts.value
  const account = list.find((a) => a.token === token)
  if (!account) return "unauthorized"
  if (account.password !== currentPassword) return "wrong_password"
  account.password = newPassword
  accounts.value = list
  return "ok"
}