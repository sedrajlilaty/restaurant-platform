import type { ReactNode } from "react"
import { Clock, ExternalLink, MapPin, MessageCircle, Phone, type LucideIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { EmptyState } from "@/components/shared/EmptyState"
import { RestaurantLogo } from "@/components/shared/RestaurantLogo"
import { Reveal } from "@/components/shared/Reveal"
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
  "inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-muted hover:shadow-sm active:scale-95 motion-reduce:transition-none motion-reduce:hover:translate-y-0"

type SectionProps = {
  icon: LucideIcon
  title: string
  index: number
  children: ReactNode
}

function Section({ icon: Icon, title, index, children }: SectionProps) {
  return (
    <Reveal index={index} step={90}>
      <section className="space-y-4 rounded-3xl border bg-card p-5 shadow-sm transition-shadow duration-300 hover:shadow-lg motion-reduce:transition-none">
        <h2 className="flex items-center gap-3 font-bold">
          <span className="grid size-9 place-items-center rounded-full bg-primary/10 text-primary">
            <Icon className="size-5" />
          </span>
          {title}
        </h2>
        {children}
      </section>
    </Reveal>
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
    <div className="space-y-6">
      <Reveal>
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
          <div className="relative flex items-center gap-4 p-6 pt-28 md:p-10 md:pt-44">
            <RestaurantLogo name={name} logoUrl={restaurant.logoUrl} className="size-16 rounded-3xl text-2xl md:size-20" />
            <div className="min-w-0 space-y-1.5">
              <h1 className="truncate text-2xl font-bold md:text-4xl">{name}</h1>
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
      </Reveal>

      {settings.isPending ? (
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-36 animate-pulse rounded-3xl bg-muted" />
          ))}
        </div>
      ) : settings.isError ? (
        <EmptyState title={t("menu.loadError")} />
      ) : !hasAnything ? (
        <EmptyState title={t("about.empty")} />
      ) : (
        <>
          {description && (
            <Reveal index={1}>
              <p className="max-w-3xl px-1 text-base leading-relaxed text-muted-foreground md:text-lg">{description}</p>
            </Reveal>
          )}

          <div className="grid items-start gap-6 md:grid-cols-2">
            {hasContact && data && (
              <Section icon={Phone} title={t("about.contact")} index={2}>
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
              <Section icon={MapPin} title={t("about.address")} index={3}>
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
              <Section icon={Clock} title={t("about.hours")} index={4}>
                <ul className="space-y-1 text-sm">
                  {dayOrder(lang).map((day) => {
                    const slots = slotsOfDay(hours, day)
                    return (
                      <li
                        key={day}
                        className={cn(
                          "flex items-center justify-between gap-3 rounded-xl px-3 py-2",
                          day === today && "bg-primary/10 font-semibold text-primary",
                        )}
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
              <Section icon={ExternalLink} title={t("about.social")} index={5}>
                <div className="flex flex-wrap gap-2">
                  {socials.map((link) => (
                    <a key={`${link.platform}-${link.url}`} href={link.url} target="_blank" rel="noopener noreferrer" className={pill}>
                      {SOCIAL_LABELS[link.platform] ?? link.platform}
                    </a>
                  ))}
                </div>
              </Section>
            )}
          </div>
        </>
      )}
    </div>
  )
}