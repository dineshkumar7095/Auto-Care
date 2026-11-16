import { z } from "zod";
import { ORDER_STATUSES } from "@automotive/shared-types";
import { pinCode } from "./common";

export const createOrderSchema = z.object({
  lines: z.array(z.object({ productId: z.string().min(1), quantity: z.number().int().min(1).max(500) })).min(1),
  fulfilment: z.enum(["delivery", "pickup"]),
  address: z.object({ line1: z.string().min(3), city: z.string().min(2), state: z.string().min(2), pin: pinCode }).optional(),
  couponCode: z.string().max(30).optional(),
}).refine((o) => o.fulfilment === "pickup" || !!o.address, { path: ["address"], message: "Delivery needs an address" });

export const orderStatusUpdateSchema = z.object({ status: z.enum(ORDER_STATUSES), note: z.string().max(500).optional() });
export type CreateOrderInput = z.input<typeof createOrderSchema>;
