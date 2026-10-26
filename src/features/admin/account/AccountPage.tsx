import { useTranslation } from "react-i18next"
import { PageHeader } from "@/components/shared/PageHeader"
import { useAuth } from "@/features/auth"
import { PasswordSection } from "./sections/PasswordSection"
import { ProfileSection } from "./sections/ProfileSection"

export function AccountPage() {
  const { t } = useTranslation()
  const user = useAuth((s) => s.user)

  return (
    <div className="space-y-6">
      <PageHeader title={t("account.title")} description={t("account.desc")} />
      <div className="max-w-2xl space-y-6">
        {user && <ProfileSection key={user.id} initialName={user.name} />}
        <PasswordSection />
      </div>
    </div>
  )
}