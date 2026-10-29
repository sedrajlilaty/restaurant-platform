import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { ProductOptions } from "./options.types"

const key = (productId: string) => ["admin", "options", productId]

export const useProductOptions = (productId: string) =>
  useQuery({
    queryKey: key(productId),
    queryFn: async () => (await api.get<ProductOptions>(`/admin/products/${productId}/options`)).data,
    enabled: productId !== "",
  })

export function useSaveProductOptions(productId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (options: ProductOptions) => {
      await api.put(`/admin/products/${productId}/options`, options)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: key(productId) })
      void queryClient.invalidateQueries({ queryKey: ["menu"] }) // صفحة المنتج عند الزبون
    },
  })
}