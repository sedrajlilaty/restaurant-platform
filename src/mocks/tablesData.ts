import type { Table } from "@/features/admin"

// رموز الطاولات الأولى (table-1 ... table-5) هي نفسها اللي بتشتغل مع /t/table-1
export const tablesDb: { list: Table[] } = {
  list: ["1", "2", "3", "4", "5"].map((number) => ({
    id: `t${number}`,
    tableNumber: number,
    qrToken: `table-${number}`,
    isActive: true,
  })),
}