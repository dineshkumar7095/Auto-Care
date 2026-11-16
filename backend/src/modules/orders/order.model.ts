import { Schema, model } from "mongoose";
import { ORDER_STATUSES } from "@automotive/shared-types";
import { idField, schemaOptions } from "../../db/schema";

const lineSchema = new Schema({ productId: String, title: String, quantity: Number, unitPricePaise: Number, gstRatePct: Number }, { _id: false });
const totalsSchema = new Schema({ subtotalPaise: Number, taxPaise: Number, shippingPaise: Number, discountPaise: Number, totalPaise: Number }, { _id: false });

/** One order per vendor. A cart with items from two sellers becomes two orders. */
const orderSchema = new Schema(
  {
    ...idField,
    number: { type: String, required: true, unique: true },
    customerId: { type: String, required: true, index: true },
    customerName: { type: String, required: true },
    vendorId: { type: String, required: true, index: true },
    channel: { type: String, enum: ["B2C", "B2B"], default: "B2C" },
    lines: { type: [lineSchema], required: true },
    totals: { type: totalsSchema, required: true },
    status: { type: String, enum: ORDER_STATUSES, default: "placed", index: true },
    fulfilment: { type: String, enum: ["delivery", "pickup"], default: "delivery" },
    address: { line1: String, city: String, state: String, pin: String },
    deliveredAt: { type: Date, default: null },
    history: [{ _id: false, status: String, at: Date, by: String }],
  },
  schemaOptions,
);
export const Order = model("Order", orderSchema);
