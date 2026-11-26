import { useRef, useState } from "react"
import { ImagePlus, Loader2, Trash2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { IMAGE_MAX_BYTES, IMAGE_TYPES, uploadImage } from "@/lib/upload"
import { cn } from "@/lib/utils"

type Props = {
  value: string | null
  onChange: (url: string | null) => void
  variant?: "square" | "wide"
  className?: string
}

export function ImageUpload({ value, onChange, variant = "square", className }: Props) {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const wide = variant === "wide"

  async function handleFile(file: File) {
    if (!IMAGE_TYPES.includes(file.type)) {
      toast.error(t("upload.errors.type"))
      return
    }
    if (file.size > IMAGE_MAX_BYTES) {
      toast.error(t("upload.errors.size"))
      return
    }

    setUploading(true)
    try {
      onChange(await uploadImage(file))
    } catch {
      toast.error(t("upload.errors.failed"))
    } finally {
      setUploading(false)
    }
  }

  const choose = () => inputRef.current?.click()

  return (
    <div className={cn(wide ? "space-y-3" : "flex items-center gap-3", className)}>
      <button
        type="button"
        onClick={choose}
        disabled={uploading}
        className={cn(
          "group relative grid shrink-0 place-items-center overflow-hidden rounded-2xl border border-dashed bg-muted text-muted-foreground outline-none transition-all duration-200 hover:border-primary hover:bg-primary/5 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none",
          wide ? "aspect-[8/3] w-full" : "size-20",
        )}
      >
        {value ? (
          <img src={value} alt="" className="size-full object-cover" />
        ) : (
          <ImagePlus className="size-6 transition-transform duration-200 group-hover:scale-110 motion-reduce:transition-none" />
        )}
        {uploading && (
          <span className="absolute inset-0 grid place-items-center bg-background/70">
            <Loader2 className="size-5 animate-spin" />
          </span>
        )}
      </button>

      <div className="space-y-1.5">
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={choose} disabled={uploading}>
            {value ? t("upload.change") : t("upload.choose")}
          </Button>
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onChange(null)}
              aria-label={t("upload.remove")}
              className="text-destructive"
            >
              <Trash2 className="size-4" />
            </Button>
          )}
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">{t("upload.hint")}</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_TYPES.join(",")}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          e.target.value = ""
          if (file) void handleFile(file)
        }}
      />
    </div>
  )
}