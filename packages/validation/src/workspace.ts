import { z } from "zod";
import { TICKET_STATUSES } from "@automotive/shared-types";
import { indianMobile } from "./common";

export const teamMemberSchema = z.object({
  name: z.string().trim().min(2, "Enter a name").max(80),
  phone: indianMobile,
  title: z.string().trim().min(2, "Enter a job title").max(60),
});
export type TeamMemberInput = z.input<typeof teamMemberSchema>;

export const teamMemberActiveSchema = z.object({ active: z.boolean() });

export const settingsSchema = z.object({
  values: z.record(z.string().max(60), z.union([z.string().max(500), z.number().finite(), z.boolean()])).refine((v) => Object.keys(v).length <= 50, "Too many settings"),
});

export const ticketStatusSchema = z.object({ status: z.enum(TICKET_STATUSES) });

export const branchStockSchema = z.object({ onHand: z.number().int().min(0).max(1_000_000) });
