import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { Plan, PlanInput } from "./plans.types"

const KEY = ["super", "plans"]

function useRefresh() {
  const queryClient = useQueryClient()
  return () => void queryClient.invalidateQueries({ queryKey: KEY })
}

export const usePlans = () =>
  useQuery({
    queryKey: KEY,
    queryFn: async () => (await api.get<Plan[]>("/super/plans")).data,
  })

export function useCreatePlan() {
  const refresh = useRefresh()
  return useMutation({
    mutationFn: async (input: PlanInput) => (await api.post<Plan>("/super/plans", input)).data,
    onSuccess: refresh,
  })
}

export function useUpdatePlan() {
  const refresh = useRefresh()
  return useMutation({
    mutationFn: async ({ id, ...patch }: { id: string } & Partial<PlanInput>) =>
      (await api.patch<Plan>(`/super/plans/${id}`, patch)).data,
    onSuccess: refresh,
  })
}