import { useMutation } from "@tanstack/react-query"
import { useAuth, type AuthUser } from "@/features/auth"
import { api } from "@/lib/api"
import type { ChangePasswordInput, UpdateProfileInput } from "./account.types"

export function useUpdateProfile() {
  const setSession = useAuth((s) => s.setSession)

  return useMutation({
    mutationFn: async (payload: UpdateProfileInput) => (await api.patch<AuthUser>("/admin/account", payload)).data,
    onSuccess: (user) => {
      // الاسم بيظهر بالرئيسية وغيرها من الجلسة، فمنحدّثها وبنحافظ على التوكن
      const token = useAuth.getState().token
      if (token) setSession(token, user)
    },
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (payload: ChangePasswordInput) => {
      await api.put("/admin/account/password", payload)
    },
  })
}