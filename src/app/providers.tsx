import type { ReactNode } from "react"
import { QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/sonner"
import { TenantProvider, useColorMode } from "@/features/tenant"
import { useDirection } from "@/hooks/useDirection"
import { queryClient } from "@/lib/queryClient"

function AppToaster() {
  const { mode } = useColorMode()
  const { dir } = useDirection()
  return <Toaster theme={mode} dir={dir} position="top-center" richColors />
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <TenantProvider>
        {children}
        <AppToaster />
      </TenantProvider>
    </QueryClientProvider>
  )
}