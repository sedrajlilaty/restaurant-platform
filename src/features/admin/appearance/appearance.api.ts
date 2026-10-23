import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { AdminThemes, SaveAppearanceInput } from "./appearance.types"

const KEY = ["admin", "themes"]

export const useAdminThemes = () =>
  useQuery({
    queryKey: KEY,
    queryFn: async () => (await api.get<AdminThemes>("/admin/themes")).data,
  })

export function useSaveAppearance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: SaveAppearanceInput) => {
      await api.put("/admin/appearance", payload)
    },
    onSuccess: () => {
      // TenantProvider بيعيد تطبيق الألوان لما يجي القالب الجديد
      void queryClient.invalidateQueries({ queryKey: ["tenant"] })
    },
  })
}