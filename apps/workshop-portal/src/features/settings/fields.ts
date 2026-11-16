import type { SettingSection } from "@automotive/shared-ui/domain/settings-form";

/** Fields shown on this portal's settings page. Saved values override these defaults. */
export const SETTINGS_SECTIONS: SettingSection[] = [
  { title: "Service prices", fields: [
    { key: "generalServiceRupees", label: "General service (car)", type: "number", default: 2499, min: 0, suffix: "₹" },
    { key: "acServiceRupees", label: "AC service", type: "number", default: 1899, min: 0, suffix: "₹" },
    { key: "diagnosticsRupees", label: "Diagnostics scan", type: "number", default: 699, min: 0, suffix: "₹" },
    { key: "labourHourRupees", label: "Labour rate", type: "number", default: 650, min: 0, suffix: "₹ / hour" },
  ] },
  { title: "Booking", fields: [
    { key: "bays", label: "Service bays", type: "number", default: 6, min: 1, max: 50 },
    { key: "hours", label: "Opening hours", type: "text", default: "9 am – 8 pm" },
    { key: "pickupDrop", label: "Offer pickup & drop", type: "switch", default: true },
    { key: "evHighVoltage", label: "High-voltage EV work", type: "switch", default: false, help: "Only switch on if your technicians hold EV high-voltage certification. Admin checks this." },
  ] },
];
