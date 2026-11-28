import type { AdminBanner } from "@/features/admin/banners/banners.types"
import { persistentList } from "./db"
import { banners as seed } from "./menuData"

const PALETTES = [
  ["#BF4E2C", "#E9A04F"],
  ["#6B4226", "#C98B5B"],
  ["#D62828", "#FFB400"],
]

// صورة رسم تجريبية (SVG) لحتى ينعرض السلايد من غير ما نحتاج صور حقيقية
function placeholderArt(index: number) {
  const [main, accent] = PALETTES[index % PALETTES.length]
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 360">` +
    `<rect width="960" height="360" fill="${main}"/>` +
    `<circle cx="780" cy="180" r="150" fill="${accent}" fill-opacity=".85"/>` +
    `<circle cx="780" cy="180" r="100" fill="#fff" fill-opacity=".9"/>` +
    `<circle cx="780" cy="180" r="62" fill="${main}" fill-opacity=".8"/>` +
    `<circle cx="160" cy="330" r="110" fill="#fff" fill-opacity=".12"/>` +
    `</svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export const bannersDb = persistentList<AdminBanner>("banners", () =>
  seed.map((banner, index) => ({
    ...banner,
    imageUrl: banner.imageUrl ?? placeholderArt(index),
    isActive: true,
    sortOrder: index,
  })),
)