export const FITMENT_STATUSES = ["verified", "seller-confirmed", "possible", "not-verified"] as const;
export type Fitment = (typeof FITMENT_STATUSES)[number];
/** Customer-facing fitment wording, shared by web and mobile. */
export const FITMENT_LABEL: Record<Fitment, string> = {
  verified: "Verified fit",
  "seller-confirmed": "Seller-confirmed",
  possible: "Possible match",
  "not-verified": "Fit not verified",
};

export const PART_CLASSES = ["OEM", "OES", "Aftermarket", "Refurbished", "Used"] as const;
export type PartClass = (typeof PART_CLASSES)[number];

export const VEHICLE_CATEGORIES = ["car", "two-wheeler", "three-wheeler", "truck", "bus", "tractor", "ev", "specialist"] as const;
export type VehicleCategory = (typeof VEHICLE_CATEGORIES)[number];

export const PART_CATEGORIES = ["Brakes", "Engine", "Electrical", "Filters", "Suspension", "Tyres", "Batteries", "Lubricants", "Accessories"] as const;
export type PartCategory = (typeof PART_CATEGORIES)[number];

export type Product = {
  id: string;
  title: string;
  brand: string;
  partNumber: string;
  category: PartCategory;
  partClass: PartClass;
  fitment: Fitment;
  /** Integer paise. Never floating point. */
  pricePaise: number;
  mrpPaise: number;
  gstRatePct: number;
  stock: number;
  delivery: string;
  warranty: string;
  rating: number;
  reviews: number;
  vendorId: string;
  sellerName: string;
  sellerCity: string;
  sellerVerified: boolean;
  returnable: boolean;
  specs: Record<string, string>;
  listingStatus: "live" | "pending_review" | "paused";
};

export type Offer = { vendorId: string; sellerName: string; pricePaise: number; delivery: string; rating: number; verified: boolean };

export type Vehicle = {
  id: string;
  ownerId: string;
  registration: string;
  make: string;
  model: string;
  variant?: string;
  year: number;
  fuel: "petrol" | "diesel" | "cng" | "electric" | "hybrid";
  category: VehicleCategory;
};
