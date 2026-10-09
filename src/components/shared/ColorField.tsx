import { HexColorInput, HexColorPicker } from "react-colorful"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type Props = {
  label: string
  value: string
  onChange: (hex: string) => void
  swatches?: string[]
  disabled?: boolean
}

export function ColorField({ label, value, onChange, swatches = [], disabled }: Props) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className="flex w-full items-center gap-3 rounded-2xl border bg-card px-3 py-2 text-start disabled:opacity-50"
          >
            <span className="size-8 rounded-full border" style={{ backgroundColor: value }} />
            <span dir="ltr" className="font-mono text-sm">
              {value.toUpperCase()}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64 space-y-3 rounded-3xl p-4">
          <HexColorPicker color={value} onChange={onChange} style={{ width: "100%" }} />
          <HexColorInput
            prefixed
            color={value}
            onChange={onChange}
            dir="ltr"
            className="w-full rounded-xl border bg-background px-3 py-2 font-mono text-sm uppercase"
          />
          {swatches.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {swatches.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  aria-label={hex}
                  onClick={() => onChange(hex)}
                  className="size-7 rounded-full border"
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}