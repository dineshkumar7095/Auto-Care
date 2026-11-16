import type { SettingSection } from "@automotive/shared-ui/domain/settings-form";

/** Fields shown on this portal's settings page. Saved values override these defaults. */
export const SETTINGS_SECTIONS: SettingSection[] = [
  { title: "Service area", fields: [
    { key: "areas", label: "Areas you cover", type: "textarea", default: "Banjara Hills, Gachibowli, Madhapur, Kondapur, Outer Ring Road" },
    { key: "maxRadiusKm", label: "Maximum pickup distance", type: "number", default: 25, min: 1, max: 200, suffix: "km" },
    { key: "nightService", label: "Take jobs at night (10 pm – 6 am)", type: "switch", default: true },
  ] },
  { title: "Rates", fields: [
    { key: "baseRupees", label: "Base fare (first 5 km)", type: "number", default: 1200, min: 0, suffix: "₹" },
    { key: "perKmRupees", label: "Per extra km", type: "number", default: 45, min: 0, suffix: "₹" },
    { key: "flatbedSurchargeRupees", label: "Flatbed surcharge", type: "number", default: 500, min: 0, suffix: "₹" },
  ] },
];
