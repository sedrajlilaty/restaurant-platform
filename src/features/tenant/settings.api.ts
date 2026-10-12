import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { StoreSettings } from "./tenant.types"

async function fetchSettings() {
  const { data } = await api.get<StoreSettings>("/public/settings")
  return data
}

export const useStoreSettings = () =>
  useQuery({ queryKey: ["settings"], queryFn: fetchSettings, staleTime: 5 * 60_000 })