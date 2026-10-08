import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation } from "@tanstack/react-query"
import { Navigate, useLocation, useNavigate } from "react-router"
import { useTranslation } from "react-i18next"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher"
import { useTenant } from "@/features/tenant/useTenant"
import { login } from "./auth.api"
import { useAuth } from "./auth.store"

const schema = z.object({
  email: z.string().email("validation.email"),
  password: z.string().min(6, "validation.passwordMin"),
})
type FormValues = z.infer<typeof schema>

export function LoginPage() {
  const { t, i18n } = useTranslation()
  const tenant = useTenant()
  const navigate = useNavigate()
  const location = useLocation()
  const { token, user, setSession } = useAuth()

  const home = tenant.kind === "platform" ? "/super" : "/admin"
  const from = (location.state as { from?: string } | null)?.from ?? home
  const lang = i18n.language === "en" ? "en" : "ar"

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  })

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setSession(data.token, data.user)
      navigate(from, { replace: true })
    },
  })

  if (token && user) return <Navigate to={from} replace />

  const { errors } = form.formState
  const wrongCredentials = axios.isAxiosError(mutation.error) && mutation.error.response?.status === 401

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-3">
          <div className="flex justify-end">
            <LanguageSwitcher />
          </div>
          <CardTitle className="text-center text-xl">
            {tenant.kind === "restaurant" ? tenant.name[lang] : t("auth.platformTitle")}
          </CardTitle>
          <p className="text-center text-sm text-muted-foreground">{t("auth.title")}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit((values) => mutation.mutate(values))} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input id="email" type="email" dir="ltr" autoComplete="username" {...form.register("email")} />
              {errors.email?.message && <p className="text-sm text-destructive">{t(errors.email.message)}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("auth.password")}</Label>
              <Input id="password" type="password" dir="ltr" autoComplete="current-password" {...form.register("password")} />
              {errors.password?.message && <p className="text-sm text-destructive">{t(errors.password.message)}</p>}
            </div>
            {mutation.isError && (
              <p className="text-sm text-destructive">{wrongCredentials ? t("auth.invalid") : t("auth.error")}</p>
            )}
            <Button type="submit" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? t("auth.submitting") : t("auth.submit")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}