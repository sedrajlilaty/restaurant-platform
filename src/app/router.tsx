import type { ReactNode } from "react"
import { createBrowserRouter, Navigate } from "react-router"
import { NotFoundPage } from "@/components/shared/NotFoundPage"
import { PlaceholderPage } from "@/components/shared/PlaceholderPage"
import { LoginPage } from "@/features/auth/LoginPage"
import type { FeatureKey } from "@/features/tenant/tenant.types"
import { AdminLayout } from "./layouts/AdminLayout"
import { CustomerLayout } from "./layouts/CustomerLayout"
import { SuperAdminLayout } from "./layouts/SuperAdminLayout"
import { RequireAuth } from "./guards/RequireAuth"
import { RequireFeature } from "./guards/RequireFeature"

// مؤقت: كل صفحة بنبنيها بنبدّل سطرها بالصفحة الحقيقية
const page = (titleKey: string): ReactNode => <PlaceholderPage titleKey={titleKey} />
const gated = (feature: FeatureKey, titleKey: string): ReactNode => (
  <RequireFeature feature={feature}>{page(titleKey)}</RequireFeature>
)

export const restaurantRouter = createBrowserRouter([
  {
    path: "/",
    element: <CustomerLayout />,
    children: [
      { index: true, element: page("nav.home") },
      { path: "category/:id", element: page("nav.category") },
      { path: "product/:id", element: page("nav.product") },
      { path: "search", element: page("nav.search") },
      { path: "about", element: page("nav.about") },
      { path: "cart", element: page("nav.cart") },
      { path: "checkout", element: page("nav.checkout") },
      { path: "order-success", element: page("nav.orderSuccess") },
      { path: "t/:tableId", element: page("nav.table") },
    ],
  },
  { path: "/login", element: <LoginPage /> },
  {
    path: "/admin",
    element: (
      <RequireAuth roles={["owner", "staff"]}>
        <AdminLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: page("nav.home") },
      { path: "categories", element: page("nav.categories") },
      { path: "products", element: page("nav.products") },
      { path: "options", element: page("nav.options") },
      { path: "coupons", element: gated("coupons", "nav.coupons") },
      { path: "banners", element: gated("banners", "nav.banners") },
      { path: "tables", element: gated("tables_qr", "nav.tables") },
      { path: "delivery-zones", element: gated("delivery_zones", "nav.deliveryZones") },
      { path: "analytics", element: gated("analytics", "nav.analytics") },
      { path: "appearance", element: page("nav.appearance") },
      { path: "settings", element: page("nav.settings") },
      { path: "import-export", element: gated("import_export", "nav.importExport") },
      { path: "snapshots", element: gated("snapshots", "nav.snapshots") },
      { path: "account", element: page("nav.account") },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
])

export const platformRouter = createBrowserRouter([
  { path: "/", element: <Navigate to="/super" replace /> },
  { path: "/login", element: <LoginPage /> },
  {
    path: "/super",
    element: (
      <RequireAuth roles={["superadmin"]}>
        <SuperAdminLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="restaurants" replace /> },
      { path: "restaurants", element: page("nav.restaurants") },
      { path: "plans", element: page("nav.plans") },
      { path: "subscriptions", element: page("nav.subscriptions") },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
])