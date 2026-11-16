/** Business workspace: team members, per-business settings and support tickets. */

/** A person working for a business (vendor or fleet). `ownerId` is the vendorId or fleetId. */
export type TeamMember = {
  id: string;
  ownerId: string;
  name: string;
  phone: string;
  title: string;
  active: boolean;
  joinedAt: string;
};

export type SettingValue = string | number | boolean;
/** Free-form settings document per business; each portal defines which fields it shows. */
export type BusinessSettings = { ownerId: string; values: Record<string, SettingValue>; updatedAt: string };

/** Admins share one settings document under this owner id. */
export const PLATFORM_OWNER_ID = "platform";

export const TICKET_STATUSES = ["open", "in_progress", "resolved"] as const;
export type TicketStatus = (typeof TICKET_STATUSES)[number];
export const TICKET_STATUS_LABEL: Record<TicketStatus, string> = { open: "Open", in_progress: "In progress", resolved: "Resolved" };
export const TICKET_TRANSITIONS: Record<TicketStatus, readonly TicketStatus[]> = {
  open: ["in_progress", "resolved"],
  in_progress: ["resolved", "open"],
  resolved: ["open"],
};
export type TicketPriority = "high" | "medium" | "low";
export type SupportTicket = {
  id: string;
  number: string;
  subject: string;
  raisedBy: string;
  raisedByType: "customer" | "partner";
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
};

/** Stock of one part at one branch/warehouse of a distributor. */
export type BranchStock = {
  id: string;
  vendorId: string;
  branch: string;
  title: string;
  partNumber: string;
  onHand: number;
  reorderLevel: number;
};
export const isLowStock = (s: Pick<BranchStock, "onHand" | "reorderLevel">) => s.onHand <= s.reorderLevel;
