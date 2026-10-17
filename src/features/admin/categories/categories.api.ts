import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { AdminCategory, CategoryInput } from "./categories.types"

const KEY = ["admin", "categories"]
const CUSTOMER_KEY = ["menu", "categories"]

// بعد أي تعديل منحدّث كمان قائمة التصنيفات اللي بتظهر للزبون
function useRefresh() {
  const queryClient = useQueryClient()
  return () => {
    void queryClient.invalidateQueries({ queryKey: KEY })
    void queryClient.invalidateQueries({ queryKey: CUSTOMER_KEY })
  }
}

export const useAdminCategories = () =>
  useQuery({
    queryKey: KEY,
    queryFn: async () => (await api.get<AdminCategory[]>("/admin/categories")).data,
  })

export function useCreateCategory() {
  const refresh = useRefresh()
  return useMutation({
    mutationFn: async (input: CategoryInput) => (await api.post<AdminCategory>("/admin/categories", input)).data,
    onSuccess: refresh,
  })
}

export function useUpdateCategory() {
  const refresh = useRefresh()
  return useMutation({
    mutationFn: async ({ id, ...patch }: { id: string } & Partial<CategoryInput>) =>
      (await api.patch<AdminCategory>(`/admin/categories/${id}`, patch)).data,
    onSuccess: refresh,
  })
}

export function useDeleteCategory() {
  const refresh = useRefresh()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/categories/${id}`)
    },
    onSuccess: refresh,
  })
}

// إعادة الترتيب: بنغيّر القائمة فوراً (optimistic) وإذا فشل الطلب منرجّعها
export function useReorderCategories() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (ids: string[]) => {
      await api.put("/admin/categories/reorder", { ids })
    },
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: KEY })
      const previous = queryClient.getQueryData<AdminCategory[]>(KEY)
      if (previous) {
        const byId = new Map(previous.map((category) => [category.id, category]))
        queryClient.setQueryData<AdminCategory[]>(
          KEY,
          ids.flatMap((id, index) => {
            const category = byId.get(id)
            return category ? [{ ...category, sortOrder: index }] : []
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