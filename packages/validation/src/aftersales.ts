import { z } from "zod";
import { RETURN_REASONS } from "@automotive/shared-types";

export const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  text: z.string().trim().min(10, "Write at least 10 characters").max(1000),
});
export type ReviewInput = z.input<typeof reviewSchema>;

export const returnRequestSchema = z.object({
  orderId: z.string().min(1),
  reason: z.enum(RETURN_REASONS),
  note: z.string().trim().max(500).default(""),
});
export type ReturnRequestInput = z.input<typeof returnRequestSchema>;

export const returnDecisionSchema = z.object({ decision: z.enum(["approve", "reject", "refund"]) });

export const rfqQuoteSchema = z.object({ totalPaise: z.number().int().min(100).max(10_000_000_000) });

export const truckStatusSchema = z.object({ status: z.enum(["available", "on_trip", "maintenance"]) });
