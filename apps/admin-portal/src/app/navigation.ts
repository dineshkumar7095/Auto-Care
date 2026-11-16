import { Headphones, LayoutDashboard, Scale, Settings, ShieldAlert, ShoppingBag, Siren, UserCheck, Wallet, Wrench } from "lucide-react";
import type { PortalNavGroup } from "@automotive/shared-ui/layouts/portal-shell";

export const BUSINESS = { name: "Dono Auto Care Operations", branch: "Hyderabad pilot city" };
export const SEARCH_PLACEHOLDER = "Search partners, orders, trips";

export const NAV: PortalNavGroup[] = [
  { title: "Overview", items: [
    { label: "Dashboard", icon: LayoutDashboard, to: "/", exact: true },
    { label: "Partner approvals", icon: UserCheck, to: "/partners" },
  ] },
  { title: "Operations", items: [{ label: "Orders", icon: ShoppingBag, to: "/orders" }, { label: "Service bookings", icon: Wrench, to: "/bookings" }, { label: "Towing trips", icon: Siren, to: "/trips" }] },
  { title: "Finance & risk", items: [{ label: "Settlements", icon: Wallet, to: "/settlements" }, { label: "Returns & refunds", icon: Scale, to: "/refunds" }, { label: "Risk & fraud", icon: ShieldAlert, to: "/risk" }] },
  { title: "Support", items: [{ label: "Tickets", icon: Headphones, to: "/tickets" }, { label: "Platform settings", icon: Settings, to: "/platform-settings" }] },
];
