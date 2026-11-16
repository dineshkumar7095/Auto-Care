import { BarChart3, LayoutDashboard, Package, RotateCcw, Settings, ShoppingBag, Users, Wallet } from "lucide-react";
import type { PortalNavGroup } from "@automotive/shared-ui/layouts/portal-shell";

export const BUSINESS = { name: "Sri Ganesh Auto Spares", branch: "Banjara Hills branch · GSTIN verified" };
export const SEARCH_PLACEHOLDER = "Search orders, SKUs, customers";

export const NAV: PortalNavGroup[] = [
  { title: "Daily", items: [
    { label: "Dashboard", icon: LayoutDashboard, to: "/", exact: true },
    { label: "Orders", icon: ShoppingBag, to: "/orders" },
    { label: "Returns", icon: RotateCcw, to: "/returns" },
  ] },
  { title: "Catalogue", items: [{ label: "Products & stock", icon: Package, to: "/products" }] },
  { title: "Finance", items: [{ label: "Payouts", icon: Wallet, to: "/payouts" }, { label: "Reports", icon: BarChart3 }] },
  { title: "Settings", items: [{ label: "Team & roles", icon: Users, to: "/team" }, { label: "Store settings", icon: Settings, to: "/settings" }] },
];
