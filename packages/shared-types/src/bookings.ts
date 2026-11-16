export const JOB_STAGES = ["booked", "checked_in", "diagnosis", "awaiting_approval", "in_repair", "quality_check", "ready", "delivered"] as const;
export type JobStage = (typeof JOB_STAGES)[number];

export const JOB_STAGE_LABEL: Record<JobStage, string> = {
  booked: "Booked",
  checked_in: "Checked in",
  diagnosis: "Diagnosis",
  awaiting_approval: "Awaiting approval",
  in_repair: "In repair",
  quality_check: "Quality check",
  ready: "Ready",
  delivered: "Delivered",
};

/** A job can only move forward one stage, except that a rejected estimate returns to diagnosis. */
export const JOB_TRANSITIONS: Record<JobStage, readonly JobStage[]> = {
  booked: ["checked_in"],
  checked_in: ["diagnosis"],
  diagnosis: ["awaiting_approval", "in_repair"],
  awaiting_approval: ["in_repair", "diagnosis"],
  in_repair: ["quality_check"],
  quality_check: ["ready", "in_repair"],
  ready: ["delivered"],
  delivered: [],
};

export type EstimateLine = { label: string; kind: "part" | "labour" | "material"; amountPaise: number; approved?: boolean };

export type Workshop = {
  id: string;
  vendorId: string;
  name: string;
  area: string;
  city: string;
  distanceKm: number;
  rating: number;
  reviews: number;
  verified: boolean;
  specialties: string[];
  fromPricePaise: number;
  nextSlot: string;
  hours: string;
  pickup: boolean;
  evQualified: boolean;
};

export type JobCard = {
  id: string;
  number: string;
  workshopId: string;
  vehicleLabel: string;
  registration: string;
  customerName: string;
  complaint: string;
  stage: JobStage;
  technician: string | null;
  estimate: EstimateLine[];
  promisedAt: string;
};

export type Booking = {
  id: string;
  workshopId: string;
  customerName: string;
  vehicleLabel: string;
  service: string;
  slot: string;
  source: "marketplace" | "walk_in";
};
