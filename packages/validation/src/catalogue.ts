import { z } from "zod";
import { FITMENT_STATUSES, PART_CATEGORIES, PART_CLASSES, VEHICLE_CATEGORIES } from "@automotive/shared-types";
import { paise, pagination, queryBoolean } from "./common";

export const productQuerySchema = pagination.extend({
  q: z.string().trim().max(100).optional(),
  category: z.enum(PART_CATEGORIES).optional(),
  vehicleId: z.string().optional(),
  verifiedOnly: queryBoolean.optional(),
  sort: z.enum(["fit", "price-asc", "price-desc", "rating"]).default("fit"),
});

export const productInputSchema = z
  .object({
    title: z.string().trim().min(3).max(140),
    brand: z.string().trim().min(1).max(60),
    partNumber: z.string().trim().min(2).max(40),
    category: z.enum(PART_CATEGORIES),
    partClass: z.enum(PART_CLASSES),
    fitment: z.enum(FITMENT_STATUSES).default("seller-confirmed"),
    pricePaise: paise.min(100),
    mrpPaise: paise,
    gstRatePct: z.union([z.literal(5), z.literal(12), z.literal(18), z.literal(28)]).default(18),
    stock: z.number().int().nonnegative(),
    warranty: z.string().max(60).default("—"),
    returnable: z.boolean().default(true),
    specs: z.record(z.string()).default({}),
    /** Required when claiming OEM/genuine — the blueprint forbids unproven claims. */
    proofDocumentUrl: z.string().url().optional(),
  })
  .refine((p) => p.pricePaise <= p.mrpPaise, { path: ["pricePaise"], message: "Price cannot exceed MRP" })
  .refine((p) => p.partClass !== "OEM" || !!p.proofDocumentUrl, { path: ["proofDocumentUrl"], message: "OEM listings need a proof document" });

export const vehicleInputSchema = z.object({
  registration: z.string().trim().toUpperCase().regex(/^[A-Z]{2}\s?\d{1,2}\s?[A-Z]{0,3}\s?\d{1,4}$/, "Enter a valid registration number"),
  make: z.string().min(1),
  model: z.string().min(1),
  variant: z.string().optional(),
  year: z.number().int().min(1980).max(new Date().getFullYear() + 1),
  fuel: z.enum(["petrol", "diesel", "cng", "electric", "hybrid"]),
  category: z.enum(VEHICLE_CATEGORIES),
});
export type ProductInput = z.input<typeof productInputSchema>;
