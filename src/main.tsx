import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import "@/lib/i18n"
import App from "./App.tsx"
import { Providers } from "@/app/providers"
import { installAuthInterceptor } from "@/features/auth/auth.interceptor"
installAuthInterceptor()
async function enableMocks() {
  if (import.meta.env.VITE_USE_MOCKS !== "true") return
  const { worker } = await import("@/mocks/browser")
  await worker.start({ onUnhandledRequest: "bypass" })
}

void enableMocks().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <Providers>
        <App />
      </Providers>
    </StrictMode>,
  )
})