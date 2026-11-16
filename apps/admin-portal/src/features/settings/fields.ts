import { COMMISSION_BPS, RETURN_WINDOW_DAYS } from "@automotive/utilities";
import type { SettingSection } from "@automotive/shared-ui/domain/settings-form";

/** Fields shown on this portal's settings page. Saved values override these defaults. */
export const SETTINGS_SECTIONS: SettingSection[] = [
  { title: "Commission", fields: [
    { key: "sellerCommissionPct", label: "Seller commission", type: "number", default: COMMISSION_BPS.seller / 100, min: 0, max: 30, suffix: "%" },
    { key: "workshopCommissionPct", label: "Workshop commission", type: "number", default: COMMISSION_BPS.workshop / 100, min: 0, max: 30, suffix: "%" },
    { key: "towingCommissionPct", label: "Towing commission", type: "number", default: COMMISSION_BPS.towing / 100, min: 0, max: 30, suffix: "%" },
  ] },
  { title: "Rules", fields: [
    { key: "sellerAcceptMinutes", label: "Seller must accept orders within", type: "number", default: 30, min: 5, max: 240, suffix: "minutes" },
    { key: "returnWindowDays", label: "Return window", type: "number", default: RETURN_WINDOW_DAYS, min: 0, max: 30, suffix: "days" },
    { key: "pilotCity", label: "Pilot city", type: "text", default: "Hyderabad" },
    { key: "newPartnerSignups", label: "Accept new partner applications", type: "switch", default: true },
  ] },
];
