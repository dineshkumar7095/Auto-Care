/** Reviews, returns & refunds, partner payouts, notifications and GST invoices. Money is integer paise. */
export type Review = {
  id: string;
  productId: string;
  authorId: string;
  authorName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  /** True only when the author has a delivered order containing this product. */
  verifiedPurchase: boolean;
  createdAt: string;
};

export const RETURN_REASONS = ["wrong_part", "does_not_fit", "damaged", "defective", "not_needed"] as const;
export type ReturnReason = (typeof RETURN_REASONS)[number];
export const RETURN_REASON_LABEL: Record<ReturnReason, string> = {
  wrong_part: "Wrong part sent",
  does_not_fit: "Doesn't fit my vehicle",
  damaged: "Arrived damaged",
  defective: "Defective / not working",
  not_needed: "No longer needed",
};

export const RETURN_STATUSES = ["requested", "approved", "rejected", "refunded"] as const;
export type ReturnStatus = (typeof RETURN_STATUSES)[number];
export const RETURN_TRANSITIONS: Record<ReturnStatus, readonly ReturnStatus[]> = {
  requested: ["approved", "rejected"],
  approved: ["refunded"],
  rejected: [],
  refunded: [],
};

export type ReturnRequest = {
  id: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  vendorId: string;
  reason: ReturnReason;
  note: string;
  amountPaise: number;
  status: ReturnStatus;
  createdAt: string;
};

export const PAYOUT_STATUSES = ["scheduled", "paid", "on_hold"] as const;
export type PayoutStatus = (typeof PAYOUT_STATUSES)[number];

export type Payout = {
  id: string;
  vendorId: string;
  vendorName: string;
  periodLabel: string;
  grossPaise: number;
  commissionPaise: number;
  /** TDS withheld under section 194-O (e-commerce operators). */
  tdsPaise: number;
  refundsPaise: number;
  netPaise: number;
  status: PayoutStatus;
  payoutDate: string;
};

export type NotificationChannel = "in_app" | "sms" | "email" | "push";
export type AppNotification = {
  id: string;
  userId: string;
  title: string;
  body: string;
  channel: NotificationChannel;
  read: boolean;
  createdAt: string;
};

export type InvoiceLine = {
  title: string;
  quantity: number;
  taxablePaise: number;
  gstRatePct: number;
  cgstPaise: number;
  sgstPaise: number;
  igstPaise: number;
  totalPaise: number;
};

export type GstInvoice = {
  invoiceNumber: string;
  orderNumber: string;
  sellerName: string;
  sellerState: string;
  buyerName: string;
  buyerState: string;
  /** Same state → CGST + SGST; different states → IGST. */
  interState: boolean;
  lines: InvoiceLine[];
  taxablePaise: number;
  cgstPaise: number;
  sgstPaise: number;
  igstPaise: number;
  totalPaise: number;
  issuedAt: string;
};
