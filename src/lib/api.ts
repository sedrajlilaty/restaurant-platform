import axios from "axios"
import { getTenantHost } from "./tenantHost"

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  config.headers["X-Tenant-Host"] = getTenantHost()
  return config
})