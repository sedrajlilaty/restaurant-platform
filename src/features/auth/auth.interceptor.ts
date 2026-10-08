import axios from "axios"
import { api } from "@/lib/api"
import { useAuth } from "./auth.store"

let installed = false

export function installAuthInterceptor() {
  if (installed) return
  installed = true

  api.interceptors.request.use((config) => {
    const token = useAuth.getState().token
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  })

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const isLogin = axios.isAxiosError(error) && error.config?.url?.includes("/auth/login")
      if (axios.isAxiosError(error) && error.response?.status === 401 && !isLogin) {
        useAuth.getState().logout()
      }
      return Promise.reject(error)
    },
  )
}