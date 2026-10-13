import { useRef } from "react"

export function downloadSvgAsPng(svg: SVGSVGElement, filename: string, size = 1024) {
  const xml = new XMLSerializer().serializeToString(svg)
  const image = new Image()

  image.onload = () => {
    const canvas = document.createElement("canvas")
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const pad = size * 0.06
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, size, size)
    ctx.drawImage(image, pad, pad, size - pad * 2, size - pad * 2)

    const link = document.createElement("a")
    link.download = filename
    link.href = canvas.toDataURL("image/png")
    link.click()
  }
  image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`
}

export function useQrDownload(filename: string) {
  const ref = useRef<HTMLDivElement>(null)

  const download = () => {
    const svg = ref.current?.querySelector("svg")
    if (svg) downloadSvgAsPng(svg, filename)
  }

  return { ref, download }
}