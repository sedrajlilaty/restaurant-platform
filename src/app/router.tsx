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
import { ThemeDemoPage } from "../app/dev/ThemeDemoPage"
import { CartPage } from "@/features/cart"
import { CheckoutPage, OrderSuccessPage, TableEntryPage } from "@/features/checkout"
import { AccountPage, AppearancePage, CategoriesPage, OptionsPage, ProductsPage, TablesPage, TablesPrintPage, SettingsPage, DashboardPage } from "@/features/admin"
import { AboutPage, CategoryPage, HomePage, ProductPage, SearchPage } from "@/features/menu"
import { PlansPage } from "@/features/superadmin"
const page = (titleKey: string): ReactNode => <PlaceholderPage titleKey={titleKey} />
const gated = (feature: FeatureKey, titleKey: string): ReactNode => (
  <RequireFeature feature={feature}>{page(titleKey)}</RequireFeature>
)

export const restaurantRouter = createBrowserRouter([
  {
    path: "/",
    element: <CustomerLayout />,
    children: [
      // { index: true, element: page("nav.home") },
      { index: true, element: <HomePage /> },
 { path: "category/:id", element: <CategoryPage /> },{ path: "product/:id", element: <ProductPage /> }, 
      { path: "search", element: <SearchPage /> },
      { path: "about", element: <AboutPage /> },
     { path: "cart", element: <CartPage /> },
{ path: "checkout", element: <CheckoutPage /> },
{ path: "order-success", element: <OrderSuccessPage /> },
{ path: "t/:token", element: <TableEntryPage /> },
       ...(import.meta.env.DEV ? [{ path: "dev/theme", element: <ThemeDemoPage /> }] : []),
    ],
  },
  { path: "/login", element: <LoginPage /> },
    {
    path: "/admin/tables/print",
    element: (
      <RequireAuth roles={["owner", "staff"]}>
        <RequireFeature feature="tables_qr">
          <TablesPrintPage />
        </RequireFeature>
      </RequireAuth>
    ),
  },
  {
    path: "/admin",
    element: (
      <RequireAuth roles={["owner", "staff"]}>
        <AdminLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <DashboardPage /> },      
      { path: "categories", element: <CategoriesPage /> },    
{ path: "products", element: <ProductsPage /> },     
{ path: "options", element: <OptionsPage /> },
      { path: "coupons", element: gated("coupons", "nav.coupons") },
      { path: "banners", element: gated("banners", "nav.banners") },
      {
        path: "tables",
        element: (
          <RequireFeature feature="tables_qr">
            <TablesPage />
          </RequireFeature>
        ),
      },      { path: "delivery-zones", element: gated("delivery_zones", "nav.deliveryZones") },
      { path: "analytics", element: gated("analytics", "nav.analytics") },
      { path: "appearance", element: <AppearancePage /> },      { path: "settings", element: <SettingsPage /> },      { path: "import-export", element: gated("import_export", "nav.importExport") },
      { path: "snapshots", element: gated("snapshots", "nav.snapshots") },
      { path: "account", element: <AccountPage /> },    ],
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
{ path: "plans", element: <PlansPage /> },
      { path: "subscriptions", element: page("nav.subscriptions") },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
])