import { History, LayoutDashboard, Receipt, Settings, Truck, Users } from "lucide-react";
import type { PortalNavGroup } from "@automotive/shared-ui/layouts/portal-shell";

export const BUSINESS = { name: "Swift Recovery Services", branch: "Hyderabad · 4 trucks on duty" };
export const SEARCH_PLACEHOLDER = "Search trips, plates";

export const NAV: PortalNavGroup[] = [
  { title: "Dispatch", items: [
    { label: "Live jobs", icon: LayoutDashboard, to: "/", exact: true },
    { label: "Trip history", icon: History, to: "/trips" },
  ] },
  { title: "Fleet", items: [{ label: "Trucks", icon: Truck, to: "/trucks" }, { label: "Drivers", icon: Users, to: "/drivers" }] },
  { title: "Finance", items: [{ label: "Payouts", icon: Receipt, to: "/payouts" }] },
  { title: "Settings", items: [{ label: "Service area & rates", icon: Settings, to: "/service-area" }] },
];
