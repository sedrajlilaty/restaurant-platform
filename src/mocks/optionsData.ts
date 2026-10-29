import type { AdminOptionChoice, ProductOptions } from "@/features/admin"
import type { OptionChoice, OptionGroup } from "@/features/menu"
import { CLASSIFY_GROUP_ID } from "@/lib/constants"
import { persistentValue } from "./db"
import { optionGroupsByProduct } from "./menuData"
import { productsDb, toSyp } from "./productsData"

export type { ProductOptions }

// نسخة من خيارات الزبون الأصلية قبل أي تعديل (منها بتجي القيم الأولية)
const original = structuredClone(optionGroupsByProduct)

const fromChoice = (choice: OptionChoice): AdminOptionChoice => ({
  id: choice.id,
  name: choice.name,
  price: { usd: choice.price, syp: toSyp(choice.price) },
  isDefault: choice.isDefault,
})

const seed = (): Record<string, ProductOptions> =>
  Object.fromEntries(
    Object.entries(original).map(([productId, groups]) => [
      productId,
      {
        sizes: groups.find((g) => g.id === CLASSIFY_GROUP_ID)?.choices.map(fromChoice) ?? [],
        groups: groups
          .filter((g) => g.id !== CLASSIFY_GROUP_ID)
          .map((g) => ({
            id: g.id,
            name: g.name,
            type: g.type,
            required: g.required,
            min: g.min,
            max: g.max,
            choices: g.choices.map(fromChoice),
          })),
      },
    ]),
  )

const db = persistentValue<Record<string, ProductOptions>>("product-options", seed)

const toChoice = (choice: AdminOptionChoice): OptionChoice => ({
  id: choice.id,
  name: choice.name,
  price: choice.price.usd, // الزبون لسا بعملة وحدة
  isDefault: choice.isDefault,
})

function toPublic(options: ProductOptions): OptionGroup[] {
  const sizes: OptionGroup[] =
    options.sizes.length > 0
      ? [
          {
            id: CLASSIFY_GROUP_ID,
            name: { ar: "الحجم", en: "Size" },
            type: "single",
            required: true,
            min: 1,
            max: 1,
            choices: options.sizes.map(toChoice),
          },
        ]
      : []

  const groups: OptionGroup[] = options.groups.map((g) => ({
    id: g.id,
    name: g.name,
    type: g.type,
    required: g.required,
    min: g.min,
    max: g.max,
    choices: g.choices.map(toChoice),
  }))

  return [...sizes, ...groups]
}

// handlers الزبون بتقرأ من optionGroupsByProduct، فمنحدّثها من مكانها
function syncPublic() {
  for (const productId of Object.keys(optionGroupsByProduct)) delete optionGroupsByProduct[productId]
  for (const [productId, options] of Object.entries(db.value)) {
    const groups = toPublic(options)
    if (groups.length > 0) optionGroupsByProduct[productId] = groups
  }
  productsDb.refresh()
}
syncPublic()

export const optionsDb = {
  get: (productId: string): ProductOptions => db.value[productId] ?? { sizes: [], groups: [] },

  set(productId: string, options: ProductOptions) {
    db.value = { ...db.value, [productId]: options }
    syncPublic()
  },
}