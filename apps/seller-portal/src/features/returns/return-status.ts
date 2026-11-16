import type { ReturnStatus } from "@automotive/shared-types";
import type { StatusTone } from "@automotive/shared-ui/domain/status-badge";

export const RETURN_STATUS: Record<ReturnStatus, { label: string; tone: StatusTone }> = {
  requested: { label: "Needs decision", tone: "warning" },
  approved: { label: "Approved · awaiting refund", tone: "info" },
  rejected: { label: "Rejected", tone: "neutral" },
  refunded: { label: "Refunded", tone: "success" },
};
