// الأرقام العربية (٠١٢٣) بتتحول للاتينية قبل التحقق
const latinDigits = (value: string) =>
  value.trim().replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))

// دولار: حتى منزلتين عشريتين
export function parseUsd(value: string): number | null {
  const text = latinDigits(value).replace(/[٫,]/g, ".")
  return /^\d+(\.\d{1,2})?$/.test(text) ? Number(text) : null
}

// ليرة: رقم صحيح، والفواصل والمسافات بتنشال (110,500)
export function parseSyp(value: string): number | null {
  const text = latinDigits(value).replace(/[,٬\s]/g, "")
  return /^\d+$/.test(text) ? Number(text) : null
}

// عدد صحيح صغير (مثل مدة الباقة بالأشهر)
export function parseCount(value: string): number | null {
  const text = latinDigits(value)
  return /^\d{1,4}$/.test(text) ? Number(text) : null
}