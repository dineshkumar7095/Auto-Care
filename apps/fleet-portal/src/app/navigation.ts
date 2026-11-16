import { CheckSquare, ClipboardList, LayoutDashboard, Receipt, Settings, Truck, Wrench } from "lucide-react";
import type { PortalNavGroup } from "@automotive/shared-ui/layouts/portal-shell";

export const BUSINESS = { name: "Fleetline Logistics", branch: "Hyderabad depot · 5 vehicles" };
export const SEARCH_PLACEHOLDER = "Search vehicles, drivers";

export const NAV: PortalNavGroup[] = [
  { title: "Fleet", items: [
    { label: "Dashboard", icon: LayoutDashboard, to: "/", exact: true },
    { label: "Vehicles", icon: Truck, to: "/vehicles" },
    { label: "Approvals", icon: CheckSquare, to: "/approvals" },
  ] },
  { title: "Maintenance", items: [{ label: "Service plans", icon: ClipboardList, to: "/service-plans" }, { label: "Repairs", icon: Wrench, to: "/repairs" }] },
  { title: "Finance", items: [{ label: "Spend & invoices", icon: Receipt, to: "/spend" }] },
  { title: "Settings", items: [{ label: "Approval rules", icon: Settings, to: "/approval-rules" }] },
];
