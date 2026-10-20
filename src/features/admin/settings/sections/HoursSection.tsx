import { useState, type FormEvent } from "react"
import { Plus, Trash2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { SectionCard, SectionFooter } from "@/components/shared/SectionCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useLang } from "@/hooks/useLang"
import { dayOrder, weekdayName } from "@/lib/week"
import { useSaveSettings } from "../settings.api"
import type { WorkingHourSlot } from "../settings.types"

type Slot = { id: string; open: string; close: string }
type Days = Record<number, Slot[]>

const MAX_SLOTS = 3
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/
const toMinutes = (value: string) => {
  const [hours, minutes] = value.split(":").map(Number)
  return hours * 60 + minutes
}

function validateDay(slots: Slot[]): string | null {
  for (const slot of slots) {
    if (!TIME.test(slot.open) || !TIME.test(slot.close)) return "settings.hours.errors.invalid"
    if (slot.open === slot.close) return "settings.hours.errors.same"
  }
  // إذا الإغلاق أقل من الفتح فهو بيسكّر بعد منتصف الليل
  const ranges = slots
    .map((slot) => {
      const start = toMinutes(slot.open)
      const end = toMinutes(slot.close)
      return [start, end <= start ? end + 1440 : end] as const
    })
    .sort((a, b) => a[0] - b[0])
  for (let i = 1; i < ranges.length; i++) {
    if (ranges[i][0] < ranges[i - 1][1]) return "settings.hours.errors.overlap"
  }
  return null
}

const toDays = (hours: WorkingHourSlot[]): Days => {
  const days: Days = {}
  for (const slot of hours) {
    days[slot.dayOfWeek] = [
      ...(days[slot.dayOfWeek] ?? []),
      { id: crypto.randomUUID(), open: slot.openTime, close: slot.closeTime },
    ]
  }
  return days
}

const flatten = (days: Days): WorkingHourSlot[] =>
  Object.entries(days).flatMap(([day, slots]) =>
    slots.map((slot) => ({ dayOfWeek: Number(day), openTime: slot.open, closeTime: slot.close })),
  )

export function HoursSection({ initial }: { initial: WorkingHourSlot[] }) {
  const { t } = useTranslation()
  const lang = useLang()
  const save = useSaveSettings<WorkingHourSlot[]>("working-hours")

  const [days, setDays] = useState<Days>(() => toDays(initial))
  const [errors, setErrors] = useState<Record<number, string>>({})

  const sortKey = (list: WorkingHourSlot[]) =>
    JSON.stringify([...list].sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.openTime.localeCompare(b.openTime)))
  const dirty = sortKey(flatten(days)) !== sortKey(initial)

  const setSlots = (day: number, slots: Slot[]) => {
    setErrors({})
    setDays((d) => ({ ...d, [day]: slots }))
  }
  const updateSlot = (day: number, id: string, patch: Partial<Slot>) =>
    setSlots(day, (days[day] ?? []).map((slot) => (slot.id === id ? { ...slot, ...patch } : slot)))

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const found: Record<number, string> = {}
    for (const [day, slots] of Object.entries(days)) {
      const problem = validateDay(slots)
      if (problem) found[Number(day)] = problem
    }
    setErrors(found)
    if (Object.keys(found).length > 0) return

    save.mutate(flatten(days), {
      onSuccess: () => toast.success(t("settings.saved")),
      onError: () => toast.error(t("settings.saveError")),
    })
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <SectionCard title={t("settings.hours.title")} description={t("settings.hours.desc")}>
        <ul className="space-y-2">
          {dayOrder(lang).map((day) => {
            const slots = days[day] ?? []
            const isOpen = slots.length > 0

            return (
              <li key={day} className="space-y-2 rounded-2xl border p-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">{weekdayName(day, lang)}</span>
                  <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    {isOpen ? t("settings.hours.open") : t("settings.hours.closed")}
                    <Switch
                      checked={isOpen}
                      onCheckedChange={(checked) =>
                        setSlots(day, checked ? [{ id: crypto.randomUUID(), open: "10:00", close: "22:00" }] : [])
                      }
                    />
                  </label>
                </div>

                {slots.map((slot) => (
                  <div key={slot.id} dir="ltr" className="flex flex-wrap items-center gap-2">
                    <Input
                      type="time"
                      value={slot.open}
                      aria-label={t("settings.hours.from")}
                      onChange={(e) => updateSlot(day, slot.id, { open: e.target.value })}
                      className="w-32"
                    />
                    <span className="text-muted-foreground">-</span>
                    <Input
                      type="time"
                      value={slot.close}
                      aria-label={t("settings.hours.to")}
                      onChange={(e) => updateSlot(day, slot.id, { close: e.target.value })}
                      className="w-32"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={t("settings.hours.removeSlot")}
                      onClick={() => setSlots(day, slots.filter((s) => s.id !== slot.id))}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}

                {isOpen && slots.length < MAX_SLOTS && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={() => setSlots(day, [...slots, { id: crypto.randomUUID(), open: "17:00", close: "23:00" }])}
                  >
                    <Plus className="size-4" />
                    {t("settings.hours.addSlot")}
                  </Button>
                )}

                {errors[day] && (
                  <p role="alert" className="text-sm text-destructive">
                    {t(errors[day])}
                  </p>
                )}
              </li>
            )
          })}
        </ul>
        <p className="text-xs text-muted-foreground">{t("settings.hours.overnight")}</p>
        <SectionFooter pending={save.isPending} disabled={!dirty} />
      </SectionCard>
    </form>
  )
}