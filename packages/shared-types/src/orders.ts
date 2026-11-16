export const ORDER_STATUSES = ["placed", "accepted", "packed", "dispatched", "delivered", "cancelled", "return_requested", "returned"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

/** Allowed order status transitions — shared by backend and frontend so the rules live in one place. */
export const ORDER_TRANSITIONS: Record<OrderStatus, readonly OrderStatus[]> = {
  placed: ["accepted", "cancelled"],
  accepted: ["packed", "cancelled"],
  packed: ["dispatched"],
  dispatched: ["delivered"],
  delivered: ["return_requested"],
  cancelled: [],
  return_requested: ["returned", "delivered"],
  returned: [],
};

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  placed: "New",
  accepted: "Accepted",
  packed: "Packed",
  dispatched: "Dispatched",
  delivered: "Delivered",
  cancelled: "Cancelled",
  return_requested: "Return requested",
  returned: "Returned",
};

export type OrderChannel = "B2C" | "B2B";

export type OrderLine = { productId: string; title: string; quantity: number; unitPricePaise: number; gstRatePct: number };

export type OrderTotals = { subtotalPaise: number; taxPaise: number; shippingPaise: number; discountPaise: number; totalPaise: number };

export type Order = {
  id: string;
  number: string;
  customerId: string;
  customerName: string;
  vendorId: string;
  channel: OrderChannel;
  lines: OrderLine[];
  totals: OrderTotals;
  status: OrderStatus;
  createdAt: string;
  /** Set when the order is marked delivered; starts the return window. */
  deliveredAt?: string | null;
};
