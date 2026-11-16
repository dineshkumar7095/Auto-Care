import { ORDER_STATUS_LABEL, type OrderStatus } from "@automotive/shared-types";
import { StatusBadge, type StatusTone } from "./status-badge";

export const ORDER_STATUS_TONE: Record<OrderStatus, StatusTone> = {
  placed: "info",
  accepted: "info",
  packed: "warning",
  dispatched: "warning",
  delivered: "success",
  cancelled: "neutral",
  return_requested: "danger",
  returned: "neutral",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <StatusBadge label={ORDER_STATUS_LABEL[status]} tone={ORDER_STATUS_TONE[status]} />;
}
