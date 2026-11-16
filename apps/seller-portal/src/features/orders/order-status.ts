import { ORDER_STATUS_LABEL, ORDER_TRANSITIONS, type OrderStatus } from "@automotive/shared-types";
import { ORDER_STATUS_TONE } from "@automotive/shared-ui/domain/order-status-badge";

export const orderTone = ORDER_STATUS_TONE;

/** The one forward action a seller takes next. Uses the shared transition rules. */
const forward: Partial<Record<OrderStatus, { to: OrderStatus; label: string }>> = {
  placed: { to: "accepted", label: "Accept" },
  accepted: { to: "packed", label: "Mark packed" },
  packed: { to: "dispatched", label: "Dispatch" },
};

export const nextSellerAction = (status: OrderStatus) => {
  const action = forward[status];
  return action && ORDER_TRANSITIONS[status].includes(action.to) ? action : null;
};

export const orderLabel = (status: OrderStatus) => ORDER_STATUS_LABEL[status];
