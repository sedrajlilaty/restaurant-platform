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
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Image as ImageIcon, Link2, Pencil, Plus, Trash2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { EmptyState } from "@/components/shared/EmptyState"
import { PageHeader } from "@/components/shared/PageHeader"
import { Reveal } from "@/components/shared/Reveal"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useLang } from "@/hooks/useLang"
import { cn } from "@/lib/utils"
import { BannerForm } from "./BannerForm"
import { useAdminBanners, useDeleteBanner, useReorderBanners, useUpdateBanner } from "./banners.api"
import type { AdminBanner } from "./banners.types"

const GRID = "grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3"

type CardProps = { banner: AdminBanner; index: number; onEdit: () => void; onDelete: () => void }

function SortableBanner({ banner, index, onEdit, onDelete }: CardProps) {
  const { t } = useTranslation()
  const lang = useLang()
  const update = useUpdateBanner()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: banner.id })

  const title = banner.title[lang] || banner.title.ar
  const subtitle = banner.subtitle ? banner.subtitle[lang] || banner.subtitle.ar : ""

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(isDragging && "relative z-10")}
    >
      <Reveal index={Math.min(index, 8)} step={60} className="h-full">
        <article
          className={cn(
            "group flex h-full flex-col overflow-hidden rounded-3xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0",
            !banner.isActive && "opacity-80",
            isDragging && "shadow-2xl",
          )}
        >
          <div className="relative aspect-[16/9] overflow-hidden bg-primary">
            {banner.imageUrl ? (
              <img
                src={banner.imageUrl}
                alt=""
                loading="lazy"
                className="size-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
            ) : (
              <span className="grid size-full place-items-center text-primary-foreground/60">
                <ImageIcon className="size-8" />
              </span>
            )}

            <button
              type="button"
              aria-label={t("banners.drag")}
              className="absolute start-3 top-3 grid size-9 cursor-grab touch-none place-items-center rounded-full bg-card/90 text-muted-foreground shadow-sm backdrop-blur transition-all duration-200 hover:scale-110 hover:text-foreground active:cursor-grabbing motion-reduce:transition-none"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="size-5" />
            </button>

            <span className="absolute bottom-3 start-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-bold text-white backdrop-blur">
              #{index + 1}
            </span>

            <div className="absolute end-3 top-3 flex gap-1.5">
              <Button
                variant="secondary"
                size="icon"
                onClick={onEdit}
                aria-label={t("common.edit")}
                className="rounded-full bg-card/90 shadow-sm backdrop-blur hover:bg-card"
              >
                <Pencil className="size-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={onDelete}
                aria-label={t("common.delete")}
                className="rounded-full bg-card/90 text-destructive shadow-sm backdrop-blur hover:bg-destructive hover:text-white"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-3 p-4">
            <div className="min-w-0 space-y-1">
              <h3 className="truncate font-semibold">{title}</h3>
              {subtitle && <p className="line-clamp-2 text-sm text-muted-foreground">{subtitle}</p>}
            </div>

            <p className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
              <Link2 className="size-3.5 shrink-0" />
              <span dir="ltr" className="truncate">
                {banner.ctaLink ?? t("banners.noLink")}
              </span>
            </p>

            <div className="mt-auto flex items-center justify-between gap-2 border-t pt-3">
              <span
                className={cn(
                  "flex items-center gap-2 text-sm",
                  banner.isActive ? "font-medium text-foreground" : "text-muted-foreground",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn("size-2 rounded-full", banner.isActive ? "bg-primary" : "bg-muted-foreground/40")}
                />
                {banner.isActive ? t("banners.active") : t("banners.hidden")}
              </span>
              <Switch
                aria-label={t("banners.form.visible")}
                checked={banner.isActive}
                disabled={update.isPending}
                onCheckedChange={(checked) =>
                  update.mutate(
                    { id: banner.id, isActive: checked },
                    { onError: () => toast.error(t("banners.errors.generic")) },
                  )
                }
              />
            </div>
          </div>
        </article>
      </Reveal>
    </li>
  )
}

export function BannersPage() {
  const { t } = useTranslation()
  const lang = useLang()
  const query = useAdminBanners()
  const reorder = useReorderBanners()
  const remove = useDeleteBanner()
  const [dialog, setDialog] = useState<{ banner?: AdminBanner } | null>(null)
  const [toDelete, setToDelete] = useState<AdminBanner | null>(null)

  const items = useMemo(() => [...(query.data ?? [])].sort((a, b) => a.sortOrder - b.sortOrder), [query.data])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return
    const ids = items.map((banner) => banner.id)
    const next = arrayMove(ids, ids.indexOf(String(active.id)), ids.indexOf(String(over.id)))
    reorder.mutate(next, { onError: () => toast.error(t("banners.errors.generic")) })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("banners.title")}
        description={t("banners.subtitle")}
        actions={
          <Button className="gap-2" onClick={() => setDialog({})}>
            <Plus className="size-4" />
            {t("banners.add")}
          </Button>
        }
      />

      {query.isPending ? (
        <div className={GRID}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-3xl bg-muted" />
          ))}
        </div>
      ) : query.isError ? (
        <EmptyState title={t("banners.errors.generic")} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title={t("banners.empty")}
          action={<p className="text-sm text-muted-foreground">{t("banners.emptyHint")}</p>}
        />
      ) : (
        <>
          <p className="text-sm text-muted-foreground">{t("banners.hint")}</p>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map((banner) => banner.id)} strategy={rectSortingStrategy}>
              <ul className={GRID}>
                {items.map((banner, index) => (
                  <SortableBanner
                    key={banner.id}
                    banner={banner}
                    index={index}
                    onEdit={() => setDialog({ banner })}
                    onDelete={() => setToDelete(banner)}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        </>
      )}

      {dialog && <BannerForm key={dialog.banner?.id ?? "new"} banner={dialog.banner} onClose={() => setDialog(null)} />}

      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(open) => !open && setToDelete(null)}
        title={t("banners.delete.title")}
        description={
          toDelete ? t("banners.delete.desc", { name: toDelete.title[lang] || toDelete.title.ar }) : undefined
        }
        confirmLabel={t("common.delete")}
        loading={remove.isPending}
        onConfirm={() => {
          if (!toDelete) return
          remove.mutate(toDelete.id, {
            onSuccess: () => {
              toast.success(t("banners.toast.deleted"))
              setToDelete(null)
            },
            onError: () => {
              toast.error(t("banners.errors.generic"))
              setToDelete(null)
            },
          })
        }}
      />
    </div>
  )
}