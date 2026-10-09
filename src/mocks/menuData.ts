import type { Banner, Category, OptionGroup, Product } from "@/features/menu"
export const banners: Banner[] = [
  {
    id: "b1",
    title: { ar: "طعم لا يُنسى", en: "A taste you won't forget" },
    subtitle: { ar: "أطباق طازجة تُحضّر بحب", en: "Fresh dishes made with love" },
    ctaLabel: { ar: "اطلب الآن", en: "Order now" },
    ctaLink: "/search",
    imageUrl: null,
  },
  {
    id: "b2",
    title: { ar: "عرض نهاية الأسبوع", en: "Weekend special" },
    subtitle: { ar: "خصم 20% على كل الطلبات", en: "20% off all orders" },
    ctaLabel: { ar: "شاهد العروض", en: "See offers" },
    ctaLink: "/search",
    imageUrl: null,
  },
  {
    id: "b3",
    title: { ar: "حلويات جديدة", en: "New desserts" },
    subtitle: { ar: "جرّب براوني الشوكولا", en: "Try the chocolate brownie" },
    ctaLabel: null,
    ctaLink: null,
    imageUrl: null,
  },
]

export const categories: Category[] = [
  { id: "c1", name: { ar: "برغر", en: "Burgers" }, imageUrl: null },
  { id: "c2", name: { ar: "بيتزا", en: "Pizza" }, imageUrl: null },
  { id: "c3", name: { ar: "سلطات", en: "Salads" }, imageUrl: null },
  { id: "c4", name: { ar: "مشروبات", en: "Drinks" }, imageUrl: null },
  { id: "c5", name: { ar: "حلويات", en: "Desserts" }, imageUrl: null },
]

export type MockProduct = Product & { featured: boolean }

const base = { oldPrice: null, imageUrl: null, available: true } as const

export const products: MockProduct[] = [
  { ...base, id: "p1", categoryId: "c1", name: { ar: "برغر لحم كلاسيك", en: "Classic Beef Burger" }, description: { ar: "لحم بقري، جبنة، صلصة البيت", en: "Beef patty, cheese, house sauce" }, price: 8.5, badge: "bestseller", rating: { value: 4.8, count: 1200 }, hasOptions: true, featured: true },
  { ...base, id: "p2", categoryId: "c1", name: { ar: "برغر دجاج مقرمش", en: "Crispy Chicken Burger" }, description: { ar: "دجاج مقرمش مع مايونيز وخس", en: "Crispy chicken, mayo and lettuce" }, price: 7.25, badge: "hot", rating: { value: 4.6, count: 640 }, hasOptions: false, featured: true },
  { ...base, id: "p3", categoryId: "c2", name: { ar: "بيتزا مارغريتا", en: "Margherita Pizza" }, description: { ar: "جبنة موزاريلا وطماطم وريحان", en: "Mozzarella, tomato and basil" }, price: 9, badge: "popular", rating: { value: 4.7, count: 870 }, hasOptions: true, featured: true },
  { ...base, id: "p4", categoryId: "c2", name: { ar: "بيتزا خضار", en: "Veggie Pizza" }, description: { ar: "فطر وفلفل وزيتون وذرة", en: "Mushrooms, peppers, olives and corn" }, price: 8.75, badge: null, rating: { value: 4.4, count: 210 }, hasOptions: true, featured: false },
  { ...base, id: "p5", categoryId: "c3", name: { ar: "سلطة سيزر", en: "Caesar Salad" }, description: { ar: "خس رومين وجبنة بارميزان وصلصة سيزر", en: "Romaine, parmesan and Caesar dressing" }, price: 6.5, badge: "chefs_pick", rating: { value: 4.9, count: 456 }, hasOptions: false, featured: true },
  { ...base, id: "p6", categoryId: "c3", name: { ar: "سلطة يونانية", en: "Greek Salad" }, description: { ar: "خيار وطماطم وجبنة فيتا وزيتون", en: "Cucumber, tomato, feta and olives" }, price: 6, badge: null, rating: { value: 4.3, count: 130 }, hasOptions: false, featured: false },
  { ...base, id: "p7", categoryId: "c4", name: { ar: "ليموناضة بالنعناع", en: "Mint Lemonade" }, description: { ar: "ليمون طازج ونعناع وثلج", en: "Fresh lemon, mint and ice" }, price: 3, badge: "popular", rating: { value: 4.7, count: 920 }, hasOptions: false, featured: true },
  { ...base, id: "p8", categoryId: "c4", name: { ar: "قهوة مثلجة", en: "Iced Coffee" }, description: { ar: "إسبريسو مع حليب وثلج", en: "Espresso with milk and ice" }, price: 3.75, badge: null, rating: { value: 4.5, count: 310 }, hasOptions: false, featured: false },
  { ...base, id: "p9", categoryId: "c5", name: { ar: "براوني بالشوكولا", en: "Chocolate Brownie" }, description: { ar: "براوني دافئ مع صلصة الشوكولا", en: "Warm brownie with chocolate sauce" }, price: 4.5, badge: "new", rating: { value: 4.8, count: 540 }, hasOptions: false, featured: true },
  { ...base, id: "p10", categoryId: "c5", name: { ar: "تشيز كيك", en: "Cheesecake" }, description: { ar: "تشيز كيك بالتوت", en: "Cheesecake with berries" }, price: 5, oldPrice: 6, badge: null, rating: { value: 4.6, count: 300 }, hasOptions: false, featured: false },
  { ...base, id: "p11", categoryId: "c5", name: { ar: "كنافة بالجبنة", en: "Cheese Kunafa" }, description: { ar: "كنافة ناعمة بالجبنة والقطر", en: "Soft kunafa with cheese and syrup" }, price: 5.5, badge: null, rating: null, available: false, hasOptions: false, featured: false },
]
const sizeGroup = (id: string, withDefault = true): OptionGroup => ({
  id: `${id}-size`,
  name: { ar: "الحجم", en: "Size" },
  type: "single",
  required: true,
  min: 1,
  max: 1,
  choices: [
    { id: `${id}-s`, name: { ar: "صغير", en: "Small" }, price: 0, isDefault: withDefault },
    { id: `${id}-m`, name: { ar: "وسط", en: "Medium" }, price: 1.5, isDefault: false },
    { id: `${id}-l`, name: { ar: "كبير", en: "Large" }, price: 3, isDefault: false },
  ],
})

const extrasGroup = (id: string): OptionGroup => ({
  id: `${id}-extras`,
  name: { ar: "إضافات", en: "Extras" },
  type: "multiple",
  required: false,
  min: 0,
  max: 3,
  choices: [
    { id: `${id}-cheese`, name: { ar: "جبنة زيادة", en: "Extra cheese" }, price: 1, isDefault: false },
    { id: `${id}-bacon`, name: { ar: "لحم مقدد", en: "Bacon" }, price: 1.5, isDefault: false },
    { id: `${id}-mushroom`, name: { ar: "فطر", en: "Mushrooms" }, price: 1, isDefault: false },
    { id: `${id}-jalapeno`, name: { ar: "هالبينو", en: "Jalapeño" }, price: 0.5, isDefault: false },
  ],
})

export const optionGroupsByProduct: Record<string, OptionGroup[]> = {
  p1: [sizeGroup("p1"), extrasGroup("p1")],
  p3: [sizeGroup("p3"), extrasGroup("p3")],
  p4: [sizeGroup("p4", false), extrasGroup("p4")], // بدون اختيار افتراضي لتجربة التحقق
}