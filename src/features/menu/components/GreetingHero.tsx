import { useEffect, useState, type CSSProperties } from "react"
import { useTranslation } from "react-i18next"
import "./greeting-hero.css"

const float = (rotate: string, delay: string) =>
  ({ "--r": rotate, animationDelay: delay }) as CSSProperties

function HeroDoodles() {
  return (
    <svg
      viewBox="0 0 300 200"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 end-0 h-full w-1/2 text-primary-foreground/30"
    >
      <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <g transform="translate(62 58)">
          <g className="hero-doodle" style={float("-14deg", "0s")}>
            <path d="M0 -34L-26 28Q0 40 26 28Z" />
            <path d="M-22 18Q0 28 22 18" />
            <circle cx="-3" cy="-6" r="5" />
            <circle cx="8" cy="12" r="4" />
            <circle cx="-10" cy="10" r="3" />
          </g>
        </g>

        <g transform="translate(180 46)">
          <g className="hero-doodle" style={float("8deg", "-1.4s")}>
            <path d="M-30 0A30 22 0 0 1 30 0Z" />
            <path d="M-30 8Q-22 14 -15 8Q-7 14 0 8Q8 14 15 8Q22 14 30 8" />
            <rect x="-30" y="15" width="60" height="9" rx="4.5" />
            <path d="M-30 31H30Q30 42 20 42H-20Q-30 42 -30 31Z" />
            <path d="M-14 -10v0M0 -13v0M14 -10v0" strokeWidth="3" />
          </g>
        </g>

        <g transform="translate(70 148)">
          <g className="hero-doodle" style={float("-6deg", "-2.6s")}>
            <path d="M-32 -2H32Q32 30 0 30Q-32 30 -32 -2Z" />
            <path d="M-38 -2H38" />
            <path className="hero-steam" d="M-12 -12Q-18 -20 -12 -28" />
            <path className="hero-steam" style={{ animationDelay: "0.8s" }} d="M2 -12Q-4 -20 2 -28" />
            <path className="hero-steam" style={{ animationDelay: "1.6s" }} d="M16 -12Q10 -20 16 -28" />
          </g>
        </g>

        <g transform="translate(190 148)">
          <g className="hero-doodle" style={float("10deg", "-3.4s")}>
            <path d="M-14 -4H14V14Q14 24 6 24H-6Q-14 24 -14 14Z" />
            <path d="M14 0H20Q26 0 26 8Q26 14 20 14H14" />
            <path className="hero-steam" d="M-5 -10Q-9 -16 -5 -22" />
            <path className="hero-steam" style={{ animationDelay: "1s" }} d="M5 -10Q1 -16 5 -22" />
          </g>
        </g>

        <g transform="translate(258 100)">
          <g className="hero-doodle" style={float("-10deg", "-0.8s")}>
            <path d="M-12 -2L0 34L12 -2Z" />
            <circle cx="0" cy="-10" r="12" />
            <path d="M-6 -22Q0 -30 6 -22" />
          </g>
        </g>
      </g>

      <g fill="currentColor">
        <circle cx="122" cy="100" r="3" />
        <circle cx="130" cy="24" r="2.5" />
        <circle cx="128" cy="176" r="2.5" />
        <circle cx="24" cy="104" r="2.5" />
      </g>
    </svg>
  )
}

export function GreetingHero({ words }: { words: string[] }) {
  const { t } = useTranslation()
  const [isMorning] = useState(() => new Date().getHours() < 12)
  const [index, setIndex] = useState(0)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    if (words.length < 2) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let swap = 0
    const id = window.setInterval(() => {
      setHidden(true)
      swap = window.setTimeout(() => {
        setIndex((i) => (i + 1) % words.length)
        setHidden(false)
      }, 320)
    }, 2800)

    return () => {
      window.clearInterval(id)
      window.clearTimeout(swap)
    }
  }, [words.length])

  const word = words.length > 0 ? words[index % words.length] : null

  return (
    <section className="relative h-44 overflow-hidden rounded-3xl bg-primary text-primary-foreground shadow-sm md:h-56">
      <HeroDoodles />

      <div className="relative flex h-full max-w-[75%] flex-col justify-center gap-2 p-6 md:p-10">
        <p className="text-sm opacity-90 md:text-base">
          {isMorning ? t("menu.greetingMorning") : t("menu.greetingEvening")}
        </p>
        <h2 className="flex flex-wrap items-baseline gap-x-3 text-2xl font-bold leading-tight md:text-4xl">
          <span>{t("menu.heroQuestion")}</span>
          {word && (
            <span aria-hidden="true" data-hidden={hidden} className="hero-word">
              {t("menu.heroWord", { name: word })}
            </span>
          )}
        </h2>
      </div>
    </section>
  )
}