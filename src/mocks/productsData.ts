import type { AdminProduct, ProductInput } from "@/features/admin"
import { persistentList } from "./db"
import { optionGroupsByProduct, products, type MockProduct } from "./menuData"

export type { ProductInput }

// الحقول اللي بيحتاجها الزبون وما بيعدّلها الأدمن بتضل محفوظة مع المنتج
type StoredProduct = AdminProduct & Pick<MockProduct, "featured" | "badge" | "rating">

// سعر صرف لبيانات التجربة فقط، حتى يكون لكل منتج سعر بالليرة
const SAMPLE_RATE = 13000
export const toSyp = (usd: number) => Math.round((usd * SAMPLE_RATE) / 500) * 500

// نسخة من المنتجات الأصلية قبل أي تعديل (منها بتجي القيم الأولية)
const original = products.map((product) => ({ ...product }))

const seed = (): StoredProduct[] =>
  original.map((p) => ({
    id: p.id,
    categoryId: p.categoryId,
    name: p.name,
    description: p.description,
    price: { usd: p.price, syp: toSyp(p.price) },
    oldPrice: p.oldPrice != null ? { usd: p.oldPrice, syp: toSyp(p.oldPrice) } : null,
    imageUrl: p.imageUrl,
    isAvailable: p.available,
    featured: p.featured,
    badge: p.badge,
    rating: p.rating,
  }))

const db = persistentList<StoredProduct>("products", seed)

const toAdmin = (p: StoredProduct): AdminProduct => ({
  id: p.id,
  categoryId: p.categoryId,
  name: p.name,
  description: p.description,
  price: p.price,
  oldPrice: p.oldPrice,
  imageUrl: p.imageUrl,
  isAvailable: p.isAvailable,
})

const toPublic = (p: StoredProduct): MockProduct => ({
  id: p.id,
  categoryId: p.categoryId,
  name: p.name,
  description: p.description,
  price: p.price.usd, // الزبون لسا بعملة وحدة، لحد ما ينحسم سؤال العملة
  oldPrice: p.oldPrice?.usd ?? null,
  imageUrl: p.imageUrl,
  available: p.isAvailable,
  badge: p.badge,
  rating: p.rating,
  hasOptions: (optionGroupsByProduct[p.id]?.length ?? 0) > 0,
  featured: p.featured,
})

// handlers الزبون بتقرأ من المصفوفة products، فمنحدّثها من مكانها بدل ما نعدّل handlers
function syncPublic() {
  products.splice(0, products.length, ...db.list.map(toPublic))
}
syncPublic()

export const productsDb = {
  list: (): AdminProduct[] => db.list.map(toAdmin),

  create(input: ProductInput): AdminProduct {
    const created: StoredProduct = {
      id: crypto.randomUUID(),
      ...input,
      featured: false,
      badge: null,
      rating: null,
    }
    db.list = [...db.list, created]
    syncPublic()
    return toAdmin(created)
  },

  update(id: string, patch: Partial<ProductInput>): AdminProduct | null {
    const current = db.list.find((p) => p.id === id)
    if (!current) return null
    const updated: StoredProduct = { ...current, ...patch }
    db.list = db.list.map((p) => (p.id === id ? updated : p))
    syncPublic()
    return toAdmin(updated)
  },

  remove(id: string) {
    db.list = db.list.filter((p) => p.id !== id)
    syncPublic()
  },

  // بعد تعديل الخيارات: hasOptions بيتحسب من جديد
  refresh: syncPublic,
}