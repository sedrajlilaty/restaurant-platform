import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"

export type DashboardSummary = {
  categories: number
  products: number
  tables: number
  ordersToday: number
}

export const useDashboard = () =>
  useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => (await api.get<DashboardSummary>("/admin/dashboard")).data,
    staleTime: 0, // الأرقام بتتحدّث كل ما فتحتي الصفحة
  })