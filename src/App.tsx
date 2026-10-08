import { RouterProvider } from "react-router/dom"
import { platformRouter, restaurantRouter } from "@/app/router"
import { useTenant } from "@/features/tenant/useTenant"

export default function App() {
  const tenant = useTenant()
  return <RouterProvider router={tenant.kind === "platform" ? platformRouter : restaurantRouter} />
}