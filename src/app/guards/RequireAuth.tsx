import type { ReactNode } from "react"
import { Navigate, useLocation } from "react-router"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { useAuth, type Role } from "@/features/auth/auth.store"

export function RequireAuth({ roles, children }: { roles: Role[]; children: ReactNode }) {
  const { t } = useTranslation()
  const { token, user, logout } = useAuth()
  const location = useLocation()

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (!roles.includes(user.role)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
        <p>{t("auth.forbidden")}</p>
        <Button variant="outline" onClick={logout}>
          {t("common.logout")}
        </Button>
      </div>
    )
  }

  return <>{children}</>
}