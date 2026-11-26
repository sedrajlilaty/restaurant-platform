import { useTranslation } from "react-i18next"
import { PageHeader } from "@/components/shared/PageHeader"
import { Reveal } from "@/components/shared/Reveal"
import { useAuth } from "@/features/auth"
import { useRestaurant } from "@/features/tenant"
import { useLang } from "@/hooks/useLang"
import { PasswordSection } from "./sections/PasswordSection"
import { ProfileSection } from "./sections/ProfileSection"

export function AccountPage() {
  const { t } = useTranslation()
  const lang = useLang()
  const user = useAuth((s) => s.user)
  const restaurant = useRestaurant()

  const initial = user?.name?.trim().charAt(0).toUpperCase() ?? ""

  return (
    <div className="space-y-6">
      <Reveal>
        <PageHeader title={t("account.title")} description={t("account.desc")} />
      </Reveal>

      {user && (
        <Reveal index={1}>
          <section className="group relative flex items-center gap-5 overflow-hidden rounded-3xl border bg-card p-5 shadow-sm transition-shadow duration-300 hover:shadow-lg motion-reduce:transition-none md:p-8">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -end-10 -top-12 size-44 rounded-full bg-primary/10 transition-transform duration-500 group-hover:scale-110 motion-reduce:transition-none"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-16 end-24 size-32 rounded-full bg-brand-accent/15"
            />
            <span className="relative grid size-16 shrink-0 place-items-center rounded-full bg-primary text-2xl font-bold text-primary-foreground shadow-md md:size-20 md:text-3xl">
              {initial}
            </span>
            <div className="relative min-w-0 space-y-1">
              <p className="truncate text-xl font-bold md:text-2xl">{user.name}</p>
              <p className="truncate text-sm text-muted-foreground">{restaurant.name[lang]}</p>
            </div>
          </section>
        </Reveal>
      )}

      {user && (
        <Reveal index={2}>
          <ProfileSection key={user.id} initialName={user.name} />
        </Reveal>
      )}

      <Reveal index={3}>
        <PasswordSection />
      </Reveal>
    </div>
  )
}