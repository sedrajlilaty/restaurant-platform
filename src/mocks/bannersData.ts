import type { AdminBanner } from "@/features/admin/banners/banners.types"
import { persistentList } from "./db"
import { banners as seed } from "./menuData"

const BACKGROUNDS = ["#2b1d17", "#1b3a2a", "#3a2030"]

const PLATE =
  '<circle cx="236" cy="128" r="100" fill="#000" fill-opacity=".25"/>' +
  '<circle cx="230" cy="120" r="96" fill="#fff"/>' +
  '<circle cx="230" cy="120" r="82" fill="#f3e4de"/>'

const SCENES = [
  // بيتزا
  '<circle cx="230" cy="120" r="70" fill="#E9A04F"/><circle cx="230" cy="120" r="60" fill="#D4452A"/>' +
    '<circle cx="208" cy="100" r="11" fill="#FFF3C4"/><circle cx="252" cy="106" r="12" fill="#FFF3C4"/>' +
    '<circle cx="214" cy="142" r="12" fill="#FFF3C4"/><circle cx="246" cy="146" r="9" fill="#FFF3C4"/>' +
    '<ellipse cx="232" cy="120" rx="9" ry="5" fill="#3B6D11" transform="rotate(-30 232 120)"/>' +
    '<ellipse cx="200" cy="126" rx="8" ry="4.5" fill="#3B6D11" transform="rotate(20 200 126)"/>',
  // سلطة
  '<ellipse cx="205" cy="105" rx="26" ry="12" fill="#5a9a3c" transform="rotate(-25 205 105)"/>' +
    '<ellipse cx="256" cy="110" rx="24" ry="11" fill="#88c057" transform="rotate(30 256 110)"/>' +
    '<ellipse cx="232" cy="145" rx="28" ry="12" fill="#3B6D11" transform="rotate(8 232 145)"/>' +
    '<circle cx="226" cy="118" r="11" fill="#D4452A"/><circle cx="250" cy="132" r="10" fill="#D4452A"/>' +
    '<circle cx="204" cy="132" r="9" fill="#cfe8a8" stroke="#7aa84a" stroke-width="2"/>' +
    '<circle cx="258" cy="96" r="9" fill="#cfe8a8" stroke="#7aa84a" stroke-width="2"/>',
  // كيك
  '<rect x="185" y="128" width="90" height="26" rx="6" fill="#8a4b2a"/>' +
    '<rect x="185" y="110" width="90" height="18" rx="6" fill="#fff3e0"/>' +
    '<rect x="185" y="84" width="90" height="26" rx="6" fill="#8a4b2a"/>' +
    '<rect x="185" y="72" width="90" height="14" rx="6" fill="#fff3e0"/>' +
    '<circle cx="230" cy="64" r="9" fill="#c0182f"/>',
]

// صورة رسم تجريبية (SVG) بنسبة 8:3 لحتى ينعرض السلايد من غير ما نحتاج صور حقيقية
function placeholderArt(index: number) {
  const i = index % SCENES.length
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 360">` +
    `<rect width="960" height="360" fill="${BACKGROUNDS[i]}"/>` +
    `<circle cx="720" cy="80" r="120" fill="#fff" fill-opacity=".05"/>` +
    `<circle cx="860" cy="310" r="150" fill="#fff" fill-opacity=".05"/>` +
    `<g transform="translate(260 180) scale(1.35) translate(-230 -120)">${PLATE}${SCENES[i]}</g>` +
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