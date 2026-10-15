// بيحوّل الرقم لصيغة دولية بدون + (المطلوبة لروابط واتساب). 09xxxxxxxx ← 9639xxxxxxxx
export function toWhatsappNumber(raw: string) {
  let digits = raw.replace(/\D/g, "")
  if (digits.startsWith("00")) digits = digits.slice(2)
  if (/^09\d{8}$/.test(digits)) digits = `963${digits.slice(1)}`
  return digits
}

export function whatsappLink(number: string, text = "") {
  const base = `https://wa.me/${toWhatsappNumber(number)}`
  return text ? `${base}?text=${encodeURIComponent(text)}` : base
}