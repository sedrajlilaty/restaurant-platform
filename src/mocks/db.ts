// نفس الفكرة لقيمة وحدة (مو قائمة)
export function persistentValue<T>(key: string, seed: () => T) {
  const storageKey = `mock-db:${key}`
  let fallback: T | null = null

  return {
    get value(): T {
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        try {
          return JSON.parse(raw) as T
        } catch {
          // بيانات تالفة: منرجع للقيم الأولية
        }
      }
      return fallback ?? seed()
    },
    set value(next: T) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(next))
        fallback = null
      } catch {
        localStorage.removeItem(storageKey)
        fallback = next
        console.warn(`[mock db] ${key}: storage is full, keeping the change in memory only`)
      }
    },
  }
}