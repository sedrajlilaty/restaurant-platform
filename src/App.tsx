import { Button } from "@/components/ui/button"

export default function App() {
  return (
    <div className="min-h-screen bg-background p-6 text-foreground">
      <h1 className="mb-4 text-2xl font-bold">اختبار الثيم</h1>
      <div className="flex gap-3">
        <Button>زر أساسي</Button>
        <Button variant="outline">زر ثانوي</Button>
        <span className="rounded-md bg-brand-accent px-3 py-2 text-brand-accent-foreground">عرض خاص</span>
      </div>
    </div>
  )
}