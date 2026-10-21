import { persistentList } from "./db"

// الطلبات اللي انعملت بالتجربة (بس للعدّ بالرئيسية)
export const ordersDb = persistentList<{ id: string; createdAt: string }>("orders", () => [])