import { useState, type ComponentProps } from "react"
import { Eye, EyeOff } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function PasswordInput({ className, ...props }: Omit<ComponentProps<typeof Input>, "type" | "dir">) {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const Icon = visible ? EyeOff : Eye

  return (
    <div dir="ltr" className="relative">
      <Input {...props} type={visible ? "text" : "password"} className={cn("pe-11", className)} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? t("account.password.hide") : t("account.password.show")}
        aria-pressed={visible}
        className="absolute end-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-muted-foreground outline-none transition-all duration-200 hover:scale-110 hover:bg-primary/10 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring active:scale-90 motion-reduce:transition-none"
      >
        <Icon key={String(visible)} className="size-4 animate-in fade-in zoom-in-75 duration-200 motion-reduce:animate-none" />
      </button>
    </div>
  )
}