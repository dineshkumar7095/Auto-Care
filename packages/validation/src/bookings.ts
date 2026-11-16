import { z } from "zod";
import { JOB_STAGES } from "@automotive/shared-types";
import { paise } from "./common";

export const createBookingSchema = z.object({
  workshopId: z.string().min(1),
  service: z.string().min(2).max(80),
  slot: z.string().min(2),
  vehicleLabel: z.string().min(2),
  issue: z.string().max(1000).optional(),
  pickup: z.boolean().default(false),
});

export const jobStageUpdateSchema = z.object({ stage: z.enum(JOB_STAGES) });
export const estimateSchema = z.object({
  lines: z.array(z.object({ label: z.string().min(2), kind: z.enum(["part", "labour", "material"]), amountPaise: paise })).min(1),
});
