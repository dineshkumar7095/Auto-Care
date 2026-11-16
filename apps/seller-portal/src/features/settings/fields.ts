import type { SettingSection } from "@automotive/shared-ui/domain/settings-form";

/** Fields shown on this portal's settings page. Saved values override these defaults. */
export const SETTINGS_SECTIONS: SettingSection[] = [
  { title: "Store", fields: [
    { key: "storeName", label: "Store name", type: "text", default: "Sri Ganesh Auto Parts" },
    { key: "pickupAddress", label: "Pickup address", type: "textarea", default: "Shop 12, Ameerpet Main Road, Hyderabad 500016", help: "Couriers collect orders from here." },
    { key: "supportPhone", label: "Customer support number", type: "text", default: "+91 98000 00002" },
  ] },
  { title: "Orders", fields: [
    { key: "dispatchHours", label: "Dispatch within", type: "number", default: 24, min: 2, max: 96, suffix: "hours" },
    { key: "codEnabled", label: "Accept cash on delivery", type: "switch", default: true },
    { key: "acceptReturns", label: "Accept returns within 7 days", type: "switch", default: true, help: "Required for marketplace listings." },
    { key: "holidayMode", label: "Holiday mode", type: "switch", default: false, help: "Hides your listings until you switch it off." },
  ] },
];
