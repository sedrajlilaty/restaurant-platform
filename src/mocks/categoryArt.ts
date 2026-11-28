const BACKGROUNDS = ["#F3D9B1", "#F7C9B8", "#CFE8B8", "#BFE0F0", "#F4C6DC"]

const SCENES = [
  // برغر
  '<path d="M50 100A50 38 0 0 1 150 100Z" fill="#D98B3A"/>' +
    '<path d="M46 110q10 10 20 0t20 0t20 0t20 0t20 0" stroke="#5a9a3c" stroke-width="8" fill="none" stroke-linecap="round"/>' +
    '<rect x="48" y="116" width="104" height="16" rx="8" fill="#6b3a22"/>' +
    '<path d="M50 138H150Q150 162 130 162H70Q50 162 50 138Z" fill="#D98B3A"/>' +
    '<circle cx="80" cy="84" r="3" fill="#fff3e0"/><circle cx="104" cy="76" r="3" fill="#fff3e0"/><circle cx="126" cy="86" r="3" fill="#fff3e0"/>',
  // بيتزا
  '<path d="M100 36L48 152Q100 174 152 152Z" fill="#E9A04F"/>' +
    '<path d="M100 60L64 140Q100 154 136 140Z" fill="#D4452A"/>' +
    '<circle cx="98" cy="96" r="9" fill="#FFF3C4"/><circle cx="82" cy="124" r="8" fill="#FFF3C4"/><circle cx="116" cy="124" r="8" fill="#FFF3C4"/>',
  // سلطة
  '<ellipse cx="78" cy="96" rx="28" ry="13" fill="#5a9a3c" transform="rotate(-25 78 96)"/>' +
    '<ellipse cx="124" cy="92" rx="26" ry="12" fill="#88c057" transform="rotate(25 124 92)"/>' +
    '<ellipse cx="100" cy="82" rx="22" ry="11" fill="#3B6D11"/>' +
    '<circle cx="90" cy="104" r="10" fill="#D4452A"/><circle cx="116" cy="106" r="9" fill="#D4452A"/>' +
    '<path d="M42 108H158Q158 166 100 166Q42 166 42 108Z" fill="#fff"/>',
  // مشروب
  '<path d="M104 62L128 28" stroke="#D4452A" stroke-width="7" stroke-linecap="round"/>' +
    '<rect x="54" y="60" width="92" height="16" rx="7" fill="#D4452A"/>' +
    '<path d="M60 76H140L132 156Q131 166 120 166H80Q69 166 68 156Z" fill="#fff"/>' +
    '<path d="M64 108H136M66 130H134" stroke="#D4452A" stroke-width="10" stroke-opacity=".55"/>',
  // بوظة
  '<path d="M74 104L100 172L126 104Z" fill="#E9A04F"/>' +
    '<circle cx="100" cy="86" r="30" fill="#f4a6c7"/>' +
    '<circle cx="100" cy="58" r="24" fill="#fff3e0"/>' +
    '<circle cx="100" cy="32" r="7" fill="#c0182f"/>',
]

// صورة رسم تجريبية (SVG) لحتى تبين صور التصنيفات من غير ما نحتاج صور حقيقية
export function categoryArt(index: number) {
  const i = index % SCENES.length
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">` +
    `<rect width="200" height="200" fill="${BACKGROUNDS[i]}"/>${SCENES[i]}</svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}