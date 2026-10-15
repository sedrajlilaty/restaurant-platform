import type { ReactNode } from "react"
import { Clock, ExternalLink, MapPin, MessageCircle, Phone, type LucideIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { EmptyState } from "@/components/shared/EmptyState"
import { RestaurantLogo } from "@/components/shared/RestaurantLogo"
import { useRestaurant, useStoreSettings } from "@/features/tenant"
import { useLang } from "@/hooks/useLang"
import { cn } from "@/lib/utils"
import { whatsappLink } from "@/lib/whatsapp"
import { dayOrder, isOpenNow, slotsOfDay } from "../hours"

const SOCIAL_LABELS: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
  telegram: "Telegram",
  whatsapp_channel: "WhatsApp",
}

const pill =
  "inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"

function Section({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: ReactNode }) {
  return (
    <section className="space-y-3 rounded-3xl border bg-card p-4 shadow-sm">
      <h2 className="flex items-center gap-2 font-bold">
        <Icon className="size-5 text-primary" />
        {title}
      </h2>
      {children}
    </section>
  )
}

export function AboutPage() {
  const { t } = useTranslation()
  const lang = useLang()
  const restaurant = useRestaurant()
  const settings = useStoreSettings()

  const name = restaurant.name[lang]
  const hasCover = Boolean(restaurant.coverUrl)
  const data = settings.data

  const hours = data?.workingHours ?? []
  const open = hours.length > 0 ? isOpenNow(hours) : null
  const dayName = (day: number) =>
    new Intl.DateTimeFormat(lang, { weekday: "long" }).format(new Date(2024, 0, 7 + day)) // 7 كانون الثاني 2024 = أحد
  const today = new Date().getDay()

  const description = data?.description ? data.description[lang] || data.description.ar : ""
  const address = data?.address ? data.address[lang] || data.address.ar : ""
  const socials = (data?.socialLinks ?? []).filter((link) => /^https?:\/\//.test(link.url))
  const hasContact = Boolean(data?.phoneNumber || data?.whatsappNumber)
  const hasAnything = Boolean(description || hasContact || address || hours.length > 0 || socials.length > 0)

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <header
        className={cn(
          "relative overflow-hidden rounded-3xl border shadow-sm",
          hasCover ? "text-white" : "bg-primary text-primary-foreground",
        )}
      >
        {restaurant.coverUrl && (
          <>
            <img src={restaurant.coverUrl} alt="" className="absolute inset-0 size-full object-cover" />
            <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          </>
        )}
        <div className="relative flex items-center gap-4 p-6 pt-28 md:pt-40">
          <RestaurantLogo name={name} logoUrl={restaurant.logoUrl} className="size-16 rounded-3xl text-2xl" />
          <div className="min-w-0 space-y-1">
            <h1 className="truncate text-2xl font-bold">{name}</h1>
            {open !== null && (
              <span
                className={cn(
                  "inline-block rounded-full px-3 py-0.5 text-xs font-semibold",
                  open ? "bg-brand-accent text-brand-accent-foreground" : "bg-black/40 text-white",
                )}
              >
                {open ? t("about.openNow") : t("about.closedNow")}
              </span>
            )}
          </div>
        </div>
      </header>

      {settings.isPending ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-3xl bg-muted" />
          ))}
        </div>
      ) : settings.isError ? (
        <EmptyState title={t("menu.loadError")} />
      ) : !hasAnything ? (
        <EmptyState title={t("about.empty")} />
      ) : (
        <>
          {description && <p className="px-1 leading-relaxed text-muted-foreground">{description}</p>}

          {hasContact && data && (
            <Section icon={Phone} title={t("about.contact")}>
              <div className="flex flex-wrap gap-2">
                {data.phoneNumber && (
                  <a href={`tel:${data.phoneNumber.replace(/\s/g, "")}`} className={pill}>
                    <Phone className="size-4" />
                    <span dir="ltr">{data.phoneNumber}</span>
                  </a>
                )}
                {data.whatsappNumber && (
                  <a href={whatsappLink(data.whatsappNumber)} target="_blank" rel="noopener noreferrer" className={pill}>
                    <MessageCircle className="size-4" />
                    {t("about.whatsapp")}
                  </a>
                )}
              </div>
            </Section>
          )}

          {address && (
            <Section icon={MapPin} title={t("about.address")}>
              <p>{address}</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={pill}
              >
                <ExternalLink className="size-4" />
                {t("about.openMap")}
              </a>
            </Section>
          )}

          {hours.length > 0 && (
            <Section icon={Clock} title={t("about.hours")}>
              <ul className="divide-y text-sm">
                {dayOrder(lang).map((day) => {
                  const slots = slotsOfDay(hours, day)
                  return (
                    <li
                      key={day}
                      className={cn("flex items-center justify-between gap-3 py-2", day === today && "font-semibold text-primary")}
                    >
                      <span>{dayName(day)}</span>
                      <span dir="ltr" className="text-end">
                        {slots.length > 0
                          ? slots.map((slot) => `${slot.openTime} - ${slot.closeTime}`).join("  |  ")
                          : t("about.closed")}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </Section>
          )}

          {socials.length > 0 && (
            <Section icon={ExternalLink} title={t("about.social")}>
              <div className="flex flex-wrap gap-2">
                {socials.map((link) => (
                  <a key={`${link.platform}-${link.url}`} href={link.url} target="_blank" rel="noopener noreferrer" className={pill}>
                    {SOCIAL_LABELS[link.platform] ?? link.platform}
                  </a>
                ))}
              </div>
            </Section>
          )}
        </>
      )}
    </div>
  )
}