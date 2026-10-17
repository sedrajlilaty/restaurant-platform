import { useMemo, useState } from "react"
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import axios from "axios"
import { GripVertical, Pencil, Plus, Tags, Trash2, UtensilsCrossed } from "lucide-react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { EmptyState } from "@/components/shared/EmptyState"
import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useLang } from "@/hooks/useLang"
import { cn } from "@/lib/utils"
import { CategoryForm } from "./CategoryForm"
import { useAdminCategories, useDeleteCategory, useReorderCategories, useUpdateCategory } from "./categories.api"
import type { AdminCategory } from "./categories.types"

type RowProps = { category: AdminCategory; onEdit: () => void; onDelete: () => void }

function SortableRow({ category, onEdit, onDelete }: RowProps) {
  const { t } = useTranslation()
  const lang = useLang()
  const update = useUpdateCategory()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: category.id })

  const primary = category.name[lang] || category.name.ar
  const secondary = lang === "ar" ? category.name.en : category.name.ar

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-center gap-3 rounded-3xl border bg-card p-3 shadow-sm",
        isDragging && "relative z-10 shadow-lg",
        !category.isActive && "opacity-70",
      )}
    >
      <button
        type="button"
        aria-label={t("categories.drag")}
        className="grid size-9 shrink-0 cursor-grab touch-none place-items-center rounded-full text-muted-foreground hover:bg-muted active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-5" />
      </button>

      <div className="size-12 shrink-0 overflow-hidden rounded-2xl bg-muted">
        {category.imageUrl ? (
          <img src={category.imageUrl} alt="" className="size-full object-cover" />
        ) : (
          <span className="grid size-full place-items-center text-muted-foreground">
            <UtensilsCrossed className="size-5" />
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{primary}</p>
        <p className="truncate text-xs text-muted-foreground">{secondary}</p>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          aria-label={t("categories.form.visible")}
          checked={category.isActive}
          disabled={update.isPending}
          onCheckedChange={(checked) =>
            update.mutate(
              { id: category.id, isActive: checked },
              { onError: () => toast.error(t("categories.errors.generic")) },
            )
          }
        />
        <span className="hidden w-20 text-xs text-muted-foreground sm:inline">
          {category.isActive ? t("categories.active") : t("categories.hidden")}
        </span>
      </div>

      <div className="flex">
        <Button variant="ghost" size="icon" onClick={onEdit} aria-label={t("common.edit")}>
          <Pencil className="size-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onDelete} aria-label={t("common.delete")} className="text-destructive">
          <Trash2 className="size-4" />
        </Button>
      </div>
    </li>
  )
}

export function CategoriesPage() {
  const { t } = useTranslation()
  const lang = useLang()
  const query = useAdminCategories()
  const reorder = useReorderCategories()
  const remove = useDeleteCategory()
  const [dialog, setDialog] = useState<{ category?: AdminCategory } | null>(null)
  const [toDelete, setToDelete] = useState<AdminCategory | null>(null)

  const items = useMemo(() => [...(query.data ?? [])].sort((a, b) => a.sortOrder - b.sortOrder), [query.data])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return
    const ids = items.map((category) => category.id)
    const next = arrayMove(ids, ids.indexOf(String(active.id)), ids.indexOf(String(over.id)))
    reorder.mutate(next, { onError: () => toast.error(t("categories.errors.generic")) })
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <PageHeader
        title={t("categories.title")}
        description={t("categories.subtitle")}
        actions={
          <Button className="gap-2" onClick={() => setDialog({})}>
            <Plus className="size-4" />
            {t("categories.add")}
          </Button>
        }
      />

      {query.isPending ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[72px] animate-pulse rounded-3xl bg-muted" />
          ))}
        </div>
      ) : query.isError ? (
        <EmptyState title={t("categories.errors.generic")} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Tags}
          title={t("categories.empty")}
          action={<p className="text-sm text-muted-foreground">{t("categories.emptyHint")}</p>}
        />
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((category) => category.id)} strategy={verticalListSortingStrategy}>
            <ul className="space-y-2">
              {items.map((category) => (
                <SortableRow
                  key={category.id}
                  category={category}
                  onEdit={() => setDialog({ category })}
                  onDelete={() => setToDelete(category)}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}

      {dialog && <CategoryForm category={dialog.category} onClose={() => setDialog(null)} />}

      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(open) => !open && setToDelete(null)}
        title={t("categories.delete.title")}
        description={
          toDelete ? t("categories.delete.desc", { name: toDelete.name[lang] || toDelete.name.ar }) : undefined
        }
        confirmLabel={t("common.delete")}
        loading={remove.isPending}
        onConfirm={() => {
          if (!toDelete) return
          remove.mutate(toDelete.id, {
            onSuccess: () => {
              toast.success(t("categories.toast.deleted"))
              setToDelete(null)
            },
            onError: (error) => {
              const hasProducts = axios.isAxiosError(error) && error.response?.status === 409
              toast.error(t(hasProducts ? "categories.errors.hasProducts" : "categories.errors.generic"))
              setToDelete(null)
            },
          })
        }}
      />
    </div>
  )
}