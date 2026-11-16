import { FileText, Landmark, LayoutDashboard, Package, Settings, ShoppingBag, Store, Users } from "lucide-react";
import type { PortalNavGroup } from "@automotive/shared-ui/layouts/portal-shell";

export const BUSINESS = { name: "AutoHub Wholesale Pvt Ltd", branch: "Secunderabad warehouse" };
export const SEARCH_PLACEHOLDER = "Search trade orders, buyers, SKUs";

export const NAV: PortalNavGroup[] = [
  { title: "Trade", items: [
    { label: "Dashboard", icon: LayoutDashboard, to: "/", exact: true },
    { label: "Trade orders", icon: ShoppingBag, to: "/orders" },
    { label: "Quotes (RFQ)", icon: FileText, to: "/rfqs" },
  ] },
  { title: "Catalogue", items: [{ label: "Price lists", icon: Package, to: "/price-lists" }, { label: "Branches & stock", icon: Store, to: "/branches" }] },
  { title: "Finance", items: [{ label: "Credit & terms", icon: Landmark, to: "/credit" }] },
  { title: "Settings", items: [{ label: "Sales team", icon: Users, to: "/sales-team" }, { label: "Settings", icon: Settings, to: "/settings" }] },
];
