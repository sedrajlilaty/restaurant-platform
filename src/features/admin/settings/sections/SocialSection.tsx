import { useState, type FormEvent } from "react"
import { ExternalLink, Link2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { z } from "zod"
import { FormField } from "@/components/shared/FormField"
import { SectionCard, SectionFooter } from "@/components/shared/SectionCard"
import { Input } from "@/components/ui/input"
import { useSaveSettings } from "../settings.api"
import type { SocialLinkSetting, SocialPlatform } from "../settings.types"

const PLATFORMS: SocialPlatform[] = ["facebook", "instagram", "tiktok", "telegram", "whatsapp_channel"]
const LABELS: Record<SocialPlatform, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
  telegram: "Telegram",
  whatsapp_channel: "WhatsApp Channel",
}

const urlSchema = z
  .string()
  .trim()
  .refine((value) => value === "" || /^https:\/\/\S+$/i.test(value), "settings.errors.url")

const isValidUrl = (value: string) => /^https:\/\/\S+$/i.test(value.trim())

export function SocialSection({ initial }: { initial: SocialLinkSetting[] }) {
  const { t } = useTranslation()
  const save = useSaveSettings<SocialLinkSetting[]>("social-links")

  const original = Object.fromEntries(
    PLATFORMS.map((platform) => [platform, initial.find((l) => l.platform === platform)?.url ?? ""]),
  ) as Record<SocialPlatform, string>
  const [values, setValues] = useState(original)
  const [errors, setErrors] = useState<Partial<Record<SocialPlatform, string>>>({})
  const dirty = JSON.stringify(values) !== JSON.stringify(original)

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const found: Partial<Record<SocialPlatform, string>> = {}
    for (const platform of PLATFORMS) {
      const result = urlSchema.safeParse(values[platform])
      if (!result.success) found[platform] = result.error.issues[0].message
    }
    setErrors(found)
    if (Object.keys(found).length > 0) return

    save.mutate(
      PLATFORMS.filter((platform) => values[platform].trim() !== "").map((platform) => ({
        platform,
        url: values[platform].trim(),
      })),
      {
        onSuccess: () => toast.success(t("settings.saved")),
        onError: () => toast.error(t("settings.saveError")),
      },
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <SectionCard title={t("settings.social.title")} description={t("settings.social.desc")}>
        <div className="grid gap-5 md:grid-cols-2">
          {PLATFORMS.map((platform) => {
            const value = values[platform]
            return (
              <FormField key={platform} label={LABELS[platform]} htmlFor={platform} error={errors[platform]}>
                <div className="group relative">
                  <Link2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    id={platform}
                    type="url"
                    dir="ltr"
                    placeholder="https://..."
                    value={value}
                    className="ps-10 pe-10"
                    onChange={(e) => {
                      setErrors({})
                      setValues((v) => ({ ...v, [platform]: e.target.value }))
                    }}
                  />
                  {isValidUrl(value) && (
                    <a
                      href={value.trim()}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={LABELS[platform]}
                      className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-muted-foreground transition-all duration-200 animate-in fade-in zoom-in-75 hover:scale-110 hover:bg-primary/10 hover:text-primary motion-reduce:animate-none motion-reduce:transition-none"
                    >
                      <ExternalLink className="size-4" />
                    </a>
                  )}
                </div>
              </FormField>
            )
          })}
        </div>
        <SectionFooter pending={save.isPending} disabled={!dirty} />
      </SectionCard>
    </form>
  )
}