import { useState, type FormEvent } from "react"
import { Plus } from "lucide-react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { SectionCard, SectionFooter } from "@/components/shared/SectionCard"
import { Button } from "@/components/ui/button"
import { ChoicesEditor } from "./ChoicesEditor"
import { GroupCard } from "./GroupCard"
import { useSaveProductOptions } from "./options.api"
import { newGroup, toDraft, toInput, validateOptions, type OptionsDraft } from "./options.schema"
import type { ProductOptions } from "./options.types"

type Props = { productId: string; initial: ProductOptions }

export function OptionsEditor({ productId, initial }: Props) {
  const { t } = useTranslation()
  const save = useSaveProductOptions(productId)

  const [draft, setDraft] = useState<OptionsDraft>(() => toDraft(initial))
  const [baseline, setBaseline] = useState(() => JSON.stringify(toDraft(initial)))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const dirty = JSON.stringify(draft) !== baseline

  const update = (next: OptionsDraft) => {
    setErrors({})
    setDraft(next)
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const found = validateOptions(draft)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    const input = toInput(draft)
    save.mutate(input, {
      onSuccess: () => {
        // منرجّع القيم بصيغتها المحفوظة، حتى ما يضل الزر شغّال بسبب فرق شكلي (1.50 و1.5)
        const saved = toDraft(input)
        setDraft(saved)
        setBaseline(JSON.stringify(saved))
        toast.success(t("options.saved"))
      },
      onError: () => toast.error(t("options.saveError")),
    })
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <SectionCard title={t("options.sizes.title")} description={t("options.sizes.desc")}>
        {draft.sizes.length === 0 && <p className="text-sm text-muted-foreground">{t("options.sizes.empty")}</p>}
        <ChoicesEditor
          choices={draft.sizes}
          prefix="sizes"
          errors={errors}
          single
          onChange={(sizes) => update({ ...draft, sizes })}
        />
      </SectionCard>

      <SectionCard title={t("options.groups.title")} description={t("options.groups.desc")}>
        {draft.groups.length === 0 && <p className="text-sm text-muted-foreground">{t("options.groups.empty")}</p>}

        {draft.groups.map((group, index) => (
          <GroupCard
            key={group.id}
            group={group}
            index={index}
            errors={errors}
            onChange={(next) => update({ ...draft, groups: draft.groups.map((g, i) => (i === index ? next : g)) })}
            onRemove={() => update({ ...draft, groups: draft.groups.filter((_, i) => i !== index) })}
          />
        ))}

        <Button
          type="button"
          variant="outline"
          className="gap-2"
          onClick={() => update({ ...draft, groups: [...draft.groups, newGroup()] })}
        >
          <Plus className="size-4" />
          {t("options.groups.add")}
        </Button>

        <SectionFooter
          pending={save.isPending}
          disabled={!dirty}
          error={Object.keys(errors).length > 0 ? "options.errors.fix" : null}
        />
      </SectionCard>
    </form>
  )
}