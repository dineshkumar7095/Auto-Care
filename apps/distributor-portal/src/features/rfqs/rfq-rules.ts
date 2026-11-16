import type { Rfq, RfqStatus } from "@automotive/shared-types";
import type { StatusTone } from "@automotive/shared-ui/domain/status-badge";

export const RFQ_STATUS: Record<RfqStatus, { label: string; tone: StatusTone }> = {
  open: { label: "Needs quote", tone: "warning" },
  quoted: { label: "Quoted", tone: "info" },
  won: { label: "Won", tone: "success" },
  lost: { label: "Lost", tone: "danger" },
  expired: { label: "Expired", tone: "neutral" },
};

/** Suggested quote: buyer's target price where given, else nothing (the rep types it). */
export const suggestedQuotePaise = (rfq: Pick<Rfq, "lines">): number | null => {
  if (rfq.lines.some((l) => l.targetUnitPaise === null)) return null;
  return rfq.lines.reduce((s, l) => s + (l.targetUnitPaise ?? 0) * l.quantity, 0);
};

export const hoursLeft = (expiresAt: string, now = new Date()) => Math.max(0, Math.round((new Date(expiresAt).getTime() - now.getTime()) / 3_600_000));
