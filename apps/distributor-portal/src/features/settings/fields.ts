import type { SettingSection } from "@automotive/shared-ui/domain/settings-form";

/** Fields shown on this portal's settings page. Saved values override these defaults. */
export const SETTINGS_SECTIONS: SettingSection[] = [
  { title: "Trade orders", fields: [
    { key: "minOrderRupees", label: "Minimum order value", type: "number", default: 5000, min: 0, suffix: "₹" },
    { key: "quoteValidityDays", label: "Quotes valid for", type: "number", default: 7, min: 1, max: 30, suffix: "days" },
  ] },
  { title: "Credit", fields: [
    { key: "creditTermDays", label: "Default credit term", type: "number", default: 30, min: 0, max: 90, suffix: "days" },
    { key: "autoHoldOverdue", label: "Hold buyers over 30 days overdue", type: "switch", default: true, help: "New orders are blocked until they pay." },
  ] },
  { title: "Delivery", fields: [
    { key: "deliveryAreas", label: "Delivery areas", type: "textarea", default: "Banjara Hills, Gachibowli, Madhapur, Kondapur" },
    { key: "sameDayCutoff", label: "Same-day delivery cut-off", type: "text", default: "1:00 pm" },
  ] },
];
