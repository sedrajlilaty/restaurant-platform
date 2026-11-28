import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { AdminBanner, BannerInput } from "./banners.types"

const KEY = ["admin", "banners"]
const CUSTOMER_KEY = ["menu", "banners"]

// بعد أي تعديل منحدّث كمان بنرات الصفحة الرئيسية يلي بيشوفها الزبون
function useRefresh() {
  const queryClient = useQueryClient()
  return () => {
    void queryClient.invalidateQueries({ queryKey: KEY })
    void queryClient.invalidateQueries({ queryKey: CUSTOMER_KEY })
  }
}

export const useAdminBanners = () =>
  useQuery({
    queryKey: KEY,
    queryFn: async () => (await api.get<AdminBanner[]>("/admin/banners")).data,
  })

export function useCreateBanner() {
  const refresh = useRefresh()
  return useMutation({
    mutationFn: async (input: BannerInput) => (await api.post<AdminBanner>("/admin/banners", input)).data,
    onSuccess: refresh,
  })
}

export function useUpdateBanner() {
  const refresh = useRefresh()
  return useMutation({
    mutationFn: async ({ id, ...patch }: { id: string } & Partial<BannerInput>) =>
      (await api.patch<AdminBanner>(`/admin/banners/${id}`, patch)).data,
    onSuccess: refresh,
  })
}

export function useDeleteBanner() {
  const refresh = useRefresh()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/banners/${id}`)
    },
    onSuccess: refresh,
  })
}

// إعادة الترتيب: بنغيّر القائمة فوراً (optimistic) وإذا فشل الطلب منرجّعها
export function useReorderBanners() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (ids: string[]) => {
      await api.put("/admin/banners/reorder", { ids })
    },
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: KEY })
      const previous = queryClient.getQueryData<AdminBanner[]>(KEY)
      if (previous) {
        const byId = new Map(previous.map((banner) => [banner.id, banner]))
        queryClient.setQueryData<AdminBanner[]>(
          KEY,
          ids.flatMap((id, index) => {
            const banner = byId.get(id)
            return banner ? [{ ...banner, sortOrder: index }] : []
          }),
        )
      }
      return { previous }
    },
    onError: (_error, _ids, context) => {
      if (context?.previous) queryClient.setQueryData(KEY, context.previous)
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: KEY })
      void queryClient.invalidateQueries({ queryKey: CUSTOMER_KEY })
    },
  })
}