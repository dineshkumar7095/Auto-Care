import { Badge, type BadgeProps } from "../ui/badge";

export type StatusTone = "neutral" | "info" | "warning" | "success" | "danger";
const variant: Record<StatusTone, BadgeProps["variant"]> = { neutral: "muted", info: "info", warning: "warning", success: "success", danger: "danger" };

/** Domain-agnostic status pill. Each portal maps its own statuses to a tone. */
export function StatusBadge({ label, tone = "neutral" }: { label: string; tone?: StatusTone }) {
  return <Badge variant={variant[tone]} className="w-fit">{label}</Badge>;
}
