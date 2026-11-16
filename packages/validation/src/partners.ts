import { z } from "zod";
import { TOWING_ISSUES, VENDOR_TYPES } from "@automotive/shared-types";

export const vendorApplicationSchema = z.object({
  name: z.string().trim().min(3).max(120),
  type: z.enum(VENDOR_TYPES),
  city: z.string().min(2),
  gstin: z.string().regex(/^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/, "Enter a valid GSTIN").optional(),
});

export const vendorDecisionSchema = z
  .object({ decision: z.enum(["approve", "reject"]), note: z.string().max(500).optional() })
  .refine((d) => d.decision === "approve" || (d.note?.trim().length ?? 0) >= 5, { path: ["note"], message: "Give a reason when rejecting" });

export const towingRequestSchema = z.object({
  issue: z.enum(TOWING_ISSUES),
  pickup: z.string().min(3),
  drop: z.string().min(3),
  vehicleLabel: z.string().min(2),
  providerId: z.string().optional(),
});
