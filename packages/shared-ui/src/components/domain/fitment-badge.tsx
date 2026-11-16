import { AlertTriangle, BadgeCheck, HelpCircle, ShieldCheck } from "lucide-react";
import { FITMENT_LABEL, type Fitment } from "@automotive/shared-types";
import { Badge } from "../ui/badge";

export { FITMENT_LABEL };

const map = {
  verified: { variant: "success", Icon: ShieldCheck },
  "seller-confirmed": { variant: "info", Icon: BadgeCheck },
  possible: { variant: "warning", Icon: HelpCircle },
  "not-verified": { variant: "muted", Icon: AlertTriangle },
} as const;

export function FitmentBadge({ fitment }: { fitment: Fitment }) {
  const { variant, Icon } = map[fitment];
  return (
    <Badge variant={variant} className="gap-1 font-medium">
      <Icon className="size-3.5" />
      {FITMENT_LABEL[fitment]}
    </Badge>
  );
}
