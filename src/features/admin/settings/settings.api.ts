import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { AdminSettings, SettingsSection } from "./settings.types"

const KEY = ["admin", "settings"]

export const useAdminSettings = () =>
  useQuery({
    queryKey: KEY,
    queryFn: async () => (await api.get<AdminSettings>("/admin/settings")).data,
  })

export function useSaveSettings<T>(section: SettingsSection) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: T) => {
      await api.put(`/admin/settings/${section}`, payload)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: KEY })
      void queryClient.invalidateQueries({ queryKey: ["settings"] }) // إعدادات واجهة الزبون
      void queryClient.invalidateQueries({ queryKey: ["tenant"] }) // الشعار واللغة الافتراضية
    },
  })
}