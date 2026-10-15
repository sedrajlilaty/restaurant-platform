import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query"
import axios from "axios"
import { api } from "@/lib/api"
import type { Banner, Category, ProductDetail, ProductsPage, ProductsQuery } from "./menu.types"

// رقم صغير للتجربة حتى يبين زر «عرض المزيد». بالإنتاج: 24
const PAGE_SIZE = 4

async function fetchBanners() {
  const { data } = await api.get<Banner[]>("/public/banners")
  return data
}

async function fetchCategories() {
  const { data } = await api.get<Category[]>("/public/categories")
  return data
}

async function fetchProducts(params: ProductsQuery) {
  const { data } = await api.get<ProductsPage>("/public/products", { params })
  return data
}

async function fetchProduct(id: string) {
  const { data } = await api.get<ProductDetail>(`/public/products/${id}`)
  return data
}

export const useBanners = () => useQuery({ queryKey: ["menu", "banners"], queryFn: fetchBanners })

export const useCategories = () => useQuery({ queryKey: ["menu", "categories"], queryFn: fetchCategories })

export const useProducts = (params: ProductsQuery) =>
  useQuery({
    queryKey: ["menu", "products", params],
    queryFn: () => fetchProducts(params),
    placeholderData: keepPreviousData,
  })

// قائمة منتجات بصفحات ("عرض المزيد")
export const useInfiniteProducts = (params: Omit<ProductsQuery, "page" | "limit">, enabled = true) =>
  useInfiniteQuery({
    queryKey: ["menu", "products", "infinite", params],
    queryFn: ({ pageParam }) => fetchProducts({ ...params, page: pageParam, limit: PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, page) => sum + page.items.length, 0)
      return loaded < lastPage.total ? allPages.length + 1 : undefined
    },
    enabled,
    placeholderData: keepPreviousData,
  })

export const useProduct = (id: string) =>
  useQuery({
    queryKey: ["menu", "product", id],
    queryFn: () => fetchProduct(id),
    enabled: id !== "",
    retry: (count, error) => !(axios.isAxiosError(error) && error.response?.status === 404) && count < 1,
  })