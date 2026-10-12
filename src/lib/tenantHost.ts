export function getTenantHost() {
  return (import.meta.env.VITE_TENANT_HOST as string | undefined) || window.location.hostname
}