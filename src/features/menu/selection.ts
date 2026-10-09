import type { CartOption } from "@/features/cart"
import type { OptionGroup } from "./menu.types"

export type Selection = Record<string, string[]>
export type SelectionError = "required" | "min" | "max"
export type SelectionErrors = Record<string, SelectionError>

export function defaultSelection(groups: OptionGroup[]): Selection {
  const result: Selection = {}
  for (const group of groups) {
    const defaults = group.choices.filter((c) => c.isDefault).map((c) => c.id)
    result[group.id] = group.type === "single" ? defaults.slice(0, 1) : defaults.slice(0, group.max ?? defaults.length)
  }
  return result
}

export function toggleChoice(group: OptionGroup, current: string[], choiceId: string): string[] {
  if (group.type === "single") return [choiceId]
  if (current.includes(choiceId)) return current.filter((id) => id !== choiceId)
  if (group.max !== null && current.length >= group.max) return current
  return [...current, choiceId]
}

export function requiredCount(group: OptionGroup) {
  return group.type === "single" ? (group.required ? 1 : 0) : Math.max(group.min, group.required ? 1 : 0)
}

export function validateSelection(groups: OptionGroup[], selection: Selection): SelectionErrors {
  const errors: SelectionErrors = {}
  for (const group of groups) {
    const count = selection[group.id]?.length ?? 0
    const min = requiredCount(group)
    if (count < min) errors[group.id] = min <= 1 ? "required" : "min"
    else if (group.max !== null && count > group.max) errors[group.id] = "max"
  }
  return errors
}

export function selectedOptions(groups: OptionGroup[], selection: Selection): CartOption[] {
  return groups.flatMap((group) =>
    group.choices
      .filter((choice) => (selection[group.id] ?? []).includes(choice.id))
      .map((choice) => ({
        groupId: group.id,
        choiceId: choice.id,
        groupName: group.name,
        name: choice.name,
        price: choice.price,
      })),
  )
}