export const VENDOR_TYPES = ["seller", "distributor", "workshop", "towing", "brand"] as const;
export type VendorType = (typeof VENDOR_TYPES)[number];

export const VENDOR_STATUSES = ["pending", "approved", "rejected", "suspended"] as const;
export type VendorStatus = (typeof VENDOR_STATUSES)[number];

export type VendorDocument = { label: string; verified: boolean };

export type Vendor = {
  id: string;
  name: string;
  type: VendorType;
  city: string;
  status: VendorStatus;
  risk: "low" | "medium" | "high";
  documents: VendorDocument[];
  submittedAt: string;
};
