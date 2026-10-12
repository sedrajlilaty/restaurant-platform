import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { Table } from "./tables.types"

const KEY = ["admin", "tables"]

export const useTables = () =>
  useQuery({
    queryKey: KEY,
    queryFn: async () => (await api.get<Table[]>("/admin/tables")).data,
  })

export function useCreateTables() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (tableNumbers: string[]) => (await api.post<Table[]>("/admin/tables", { tableNumbers })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  })
}

export function useUpdateTable() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...patch }: { id: string; tableNumber?: string; isActive?: boolean }) =>
      (await api.patch<Table>(`/admin/tables/${id}`, patch)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  })
}

export function useDeleteTable() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/tables/${id}`)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  })
}