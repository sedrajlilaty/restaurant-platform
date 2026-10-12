import type { Table } from "./tables.types"

// الـ QR بيحمل رابط الدومين الحالي (بالإنتاج: دومين المطعم)
export const tableUrl = (token: string) => `${window.location.origin}/t/${token}`
export const restaurantUrl = () => window.location.origin

export function sortTables(tables: Table[]) {
  return [...tables].sort((a, b) => a.tableNumber.localeCompare(b.tableNumber, undefined, { numeric: true }))
}