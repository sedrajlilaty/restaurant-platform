import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { applyTheme } from "@/features/theme/applyTheme"
import { DEFAULT_THEME } from "@/features/theme/presets"

document.documentElement.dir = "rtl"
document.documentElement.lang = "ar"
applyTheme(DEFAULT_THEME, "ar")
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
