import type { AdminCategory } from "@/features/admin"
import { categories as seed } from "./menuData"

export const categoriesDb: { list: AdminCategory[] } = {
  list: seed.map((category, index) => ({
    id: category.id,
    name: category.name,
    imageUrl: category.imageUrl,
    isActive: true,
    sortOrder: index,
  })),
}