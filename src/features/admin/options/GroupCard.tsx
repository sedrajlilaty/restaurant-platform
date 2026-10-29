import { Trash2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ChoicesEditor, FieldError } from "./ChoicesEditor"
import type { GroupDraft } from "./options.schema"

const SELECT =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"

type Props = {
  group: GroupDraft
  index: number
  errors: Record<string, string>
  onChange: (group: GroupDraft) => void
  onRemove: () => void
}

export function GroupCard({ group, index, errors, onChange, onRemove }: Props) {
  const { t } = useTranslation()
  const at = `groups.${index}`
  const multiple = group.type === "multiple"

  // لما المجموعة بتصير وحيدة الاختيار منخلّي أول خيار افتراضي بس
  function changeType(type: GroupDraft["type"]) {
    let kept = false
    const choices =
      type === "single"
        ? group.choices.map((choice) => {
            const keep = choice.isDefault && !kept
            if (keep) kept = true
            return { ...choice, isDefault: keep }
          })
        : group.choices
    onChange({ ...group, type, choices })
  }

  return (
    <div className="space-y-4 rounded-3xl border bg-card p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold">{t("options.group.title", { number: index + 1 })}</h3>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-destructive"
          aria-label={t("common.delete")}
          onClick={onRemove}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor={`${at}-nameAr`}>{t("options.group.nameAr")}</Label>
          <Input
            id={`${at}-nameAr`}
            dir="rtl"
            value={group.nameAr}
            onChange={(e) => onChange({ ...group, nameAr: e.target.value })}
          />
          <FieldError message={errors[`${at}.nameAr`]} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${at}-nameEn`}>{t("options.group.nameEn")}</Label>
          <Input
            id={`${at}-nameEn`}
            dir="ltr"
            value={group.nameEn}
            onChange={(e) => onChange({ ...group, nameEn: e.target.value })}
          />
          <FieldError message={errors[`${at}.nameEn`]} />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor={`${at}-type`}>{t("options.group.type")}</Label>
          <select
            id={`${at}-type`}
            className={SELECT}
            value={group.type}
            onChange={(e) => changeType(e.target.value as GroupDraft["type"])}
          >
            <option value="single">{t("options.group.single")}</option>
            <option value="multiple">{t("options.group.multiple")}</option>
          </select>
        </div>
        <label className="flex items-center justify-between gap-3 self-end rounded-2xl border p-3">
          <span>
            <span className="block text-sm font-medium">{t("options.group.required")}</span>
            <span className="block text-xs text-muted-foreground">{t("options.group.requiredHint")}</span>
          </span>
          <Switch checked={group.required} onCheckedChange={(required) => onChange({ ...group, required })} />
        </label>
      </div>

      {multiple && (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor={`${at}-min`}>{t("options.group.min")}</Label>
            <Input
              id={`${at}-min`}
              dir="ltr"
              inputMode="numeric"
              value={group.min}
              onChange={(e) => onChange({ ...group, min: e.target.value })}
            />
            <FieldError message={errors[`${at}.min`]} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`${at}-max`}>{t("options.group.max")}</Label>
            <Input
              id={`${at}-max`}
              dir="ltr"
              inputMode="numeric"
              placeholder="∞"
              value={group.max}
              onChange={(e) => onChange({ ...group, max: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">{t("options.group.maxHint")}</p>
            <FieldError message={errors[`${at}.max`]} />
          </div>
        </div>
      )}

      <ChoicesEditor
        choices={group.choices}
        prefix={`${at}.choices`}
        errors={errors}
        single={!multiple}
        onChange={(choices) => onChange({ ...group, choices })}
      />
    </div>
  )
}