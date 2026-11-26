const SIZE = 72

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

// أيقونة السلة الظاهرة هلأ: بالهيدر عالكمبيوتر، وبالشريط السفلي عالموبايل
function findCartTarget(): HTMLElement | null {
  const links = document.querySelectorAll<HTMLElement>('a[href$="/cart"]')
  for (const link of links) {
    const rect = link.getBoundingClientRect()
    if (rect.width > 0 && rect.height > 0) return link
  }
  return null
}

function bump(target: HTMLElement) {
  target.animate(
    [
      { transform: "scale(1) rotate(0deg)" },
      { transform: "scale(1.3) rotate(-12deg)" },
      { transform: "scale(0.92) rotate(8deg)" },
      { transform: "scale(1.1) rotate(-4deg)" },
      { transform: "scale(1) rotate(0deg)" },
    ],
    { duration: 500, easing: "ease-out" },
  )
}

// بترجع Promise بتنحل لما توصل الصورة للسلة، أو فوراً إذا ما في حركة (تقليل الحركة أو ما في سلة ظاهرة)
export function flyToCart(source: HTMLElement, imageUrl: string | null): Promise<void> {
  const target = findCartTarget()
  if (!target || reducedMotion() || typeof source.animate !== "function") {
    return Promise.resolve()
  }

  const from = source.getBoundingClientRect()
  const to = target.getBoundingClientRect()
  const startX = from.left + from.width / 2
  const startY = from.top + from.height / 2
  const dx = to.left + to.width / 2 - startX
  const dy = to.top + to.height / 2 - startY

  // أعلى نقطة بالقوس، بدون ما تطلع برا الشاشة من فوق
  const peak = Math.min(0, dy) - 50
  const highest = -(startY - SIZE / 2 - 8)
  const midY = Math.max(peak, highest)

  const el = document.createElement("div")
  el.setAttribute("aria-hidden", "true")
  Object.assign(el.style, {
    position: "fixed",
    left: `${startX - SIZE / 2}px`,
    top: `${startY - SIZE / 2}px`,
    width: `${SIZE}px`,
    height: `${SIZE}px`,
    boxSizing: "border-box",
    borderRadius: "9999px",
    border: "3px solid var(--card)",
    backgroundColor: "var(--primary)",
    boxShadow: "0 10px 28px rgba(0, 0, 0, 0.28)",
    pointerEvents: "none",
    zIndex: "9999",
    willChange: "transform, opacity",
  })
  if (imageUrl) {
    el.style.backgroundImage = `url("${imageUrl.replace(/"/g, "%22")}")`
    el.style.backgroundSize = "cover"
    el.style.backgroundPosition = "center"
  }
  document.body.appendChild(el)

  const animation = el.animate(
    [
      { transform: "translate(0px, 0px) scale(1)", opacity: 1, easing: "cubic-bezier(0.2, 0.7, 0.3, 1)" },
      {
        transform: `translate(${dx * 0.55}px, ${midY}px) scale(0.62)`,
        opacity: 1,
        offset: 0.55,
        easing: "cubic-bezier(0.5, 0, 0.9, 0.6)",
      },
      { transform: `translate(${dx}px, ${dy}px) scale(0.18)`, opacity: 0.35 },
    ],
    { duration: 800, fill: "forwards" },
  )

  return animation.finished
    .then(() => bump(target))
    .catch(() => undefined)
    .finally(() => el.remove())
}