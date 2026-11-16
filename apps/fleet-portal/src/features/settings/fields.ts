import type { SettingSection } from "@automotive/shared-ui/domain/settings-form";

/** Fields shown on this portal's settings page. Saved values override these defaults. */
export const SETTINGS_SECTIONS: SettingSection[] = [
  { title: "Approvals", fields: [
    { key: "autoApproveRupees", label: "Auto-approve repairs up to", type: "number", default: 5000, min: 0, suffix: "₹" },
    { key: "secondApproverRupees", label: "Need a second approver above", type: "number", default: 50000, min: 0, suffix: "₹" },
    { key: "approvalSlaHours", label: "Reply to approvals within", type: "number", default: 4, min: 1, max: 48, suffix: "hours" },
  ] },
  { title: "Parts", fields: [
    { key: "verifiedFitOnly", label: "Only allow verified-fit parts", type: "switch", default: true },
    { key: "preferredWorkshops", label: "Preferred workshops", type: "textarea", default: "Precision Car Care (Banjara Hills), VoltWorks EV Service (Gachibowli)" },
  ] },
];
