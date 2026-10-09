import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { Banner, Category, ProductsPage, ProductsQuery } from "./menu.types"

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

export const useBanners = () => useQuery({ queryKey: ["menu", "banners"], queryFn: fetchBanners })

export const useCategories = () => useQuery({ queryKey: ["menu", "categories"], queryFn: fetchCategories })

export const useProducts = (params: ProductsQuery) =>
  useQuery({
    queryKey: ["menu", "products", params],
    queryFn: () => fetchProducts(params),
    placeholderData: keepPreviousData,
  })