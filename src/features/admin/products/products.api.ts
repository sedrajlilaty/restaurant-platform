import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { AdminProduct, ProductInput } from "./products.types"

const KEY = ["admin", "products"]

// بعد أي تعديل منحدّث قائمة الأدمن (وعدّاد الرئيسية) وقوائم الزبون
function useRefresh() {
  const queryClient = useQueryClient()
  return () => {
    void queryClient.invalidateQueries({ queryKey: ["admin"] })
    void queryClient.invalidateQueries({ queryKey: ["menu"] })
  }
}

export const useAdminProducts = () =>
  useQuery({
    queryKey: KEY,
    queryFn: async () => (await api.get<AdminProduct[]>("/admin/products")).data,
  })

export function useCreateProduct() {
  const refresh = useRefresh()
  return useMutation({
    mutationFn: async (input: ProductInput) => (await api.post<AdminProduct>("/admin/products", input)).data,
    onSuccess: refresh,
  })
}

export function useUpdateProduct() {
  const refresh = useRefresh()
  return useMutation({
    mutationFn: async ({ id, ...patch }: { id: string } & Partial<ProductInput>) =>
      (await api.patch<AdminProduct>(`/admin/products/${id}`, patch)).data,
    onSuccess: refresh,
  })
}

export function useDeleteProduct() {
  const refresh = useRefresh()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/products/${id}`)
    },
    onSuccess: refresh,
  })
}