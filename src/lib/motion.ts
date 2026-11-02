// دخول تدريجي للعناصر، وبيتعطّل لمن فعّل تقليل الحركة بجهازو
export const REVEAL =
  "animate-in fade-in slide-in-from-bottom-3 duration-500 [animation-fill-mode:backwards] motion-reduce:animate-none"

// تأخير متتالي: كل عنصر بيتأخر 70ms عن اللي قبلو (حتى 10 عناصر)
export const stagger = (index: number) => ({ animationDelay: `${Math.min(index, 10) * 70}ms` })