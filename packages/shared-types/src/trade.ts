/** B2B trade between distributors and their buyers (retailers, workshops, fleets). Money is integer paise. */
export const RFQ_STATUSES = ["open", "quoted", "won", "lost", "expired"] as const;
export type RfqStatus = (typeof RFQ_STATUSES)[number];

export type RfqLine = { title: string; partNumber: string; quantity: number; targetUnitPaise: number | null };

export type Rfq = {
  id: string;
  number: string;
  vendorId: string;
  buyerName: string;
  buyerType: BuyerGroup;
  lines: RfqLine[];
  status: RfqStatus;
  expiresAt: string;
  quotedTotalPaise: number | null;
  createdAt: string;
};

export const BUYER_GROUPS = ["retailer", "workshop", "fleet"] as const;
export type BuyerGroup = (typeof BUYER_GROUPS)[number];
export const BUYER_GROUP_LABEL: Record<BuyerGroup, string> = { retailer: "Retailers", workshop: "Workshops", fleet: "Fleets" };

export type PriceList = {
  id: string;
  vendorId: string;
  name: string;
  buyerGroup: BuyerGroup;
  /** Whole-number percent off list price, e.g. 12 = 12%. */
  discountPct: number;
  minOrderPaise: number;
  skuCount: number;
  active: boolean;
};

export type CreditAccount = {
  id: string;
  vendorId: string;
  buyerName: string;
  limitPaise: number;
  usedPaise: number;
  termsDays: number;
  /** Days the oldest unpaid invoice is past its due date; 0 when nothing is overdue. */
  overdueDays: number;
};
