import { CalendarDays, ClipboardList, LayoutDashboard, Package, Receipt, Settings, Star, Users } from "lucide-react";
import type { PortalNavGroup } from "@automotive/shared-ui/layouts/portal-shell";

export const BUSINESS = { name: "Precision Car Care", branch: "Banjara Hills · 6 bays" };
export const SEARCH_PLACEHOLDER = "Search job cards, plates, customers";

export const NAV: PortalNavGroup[] = [
  { title: "Daily", items: [
    { label: "Dashboard", icon: LayoutDashboard, to: "/", exact: true },
    { label: "Job cards", icon: ClipboardList, to: "/jobs" },
    { label: "Bookings", icon: CalendarDays, to: "/bookings" },
  ] },
  { title: "Operations", items: [{ label: "Technicians", icon: Users, to: "/technicians" }, { label: "Parts requests", icon: Package, to: "/parts-requests" }] },
  { title: "Finance", items: [{ label: "Invoices", icon: Receipt, to: "/invoices" }, { label: "Reviews", icon: Star, to: "/reviews" }] },
  { title: "Settings", items: [{ label: "Services & rates", icon: Settings, to: "/services" }] },
];
