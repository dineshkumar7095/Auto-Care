import { Schema, model } from "mongoose";
import { RETURN_REASONS, RETURN_STATUSES } from "@automotive/shared-types";
import { idField, schemaOptions } from "../../db/schema";

const returnSchema = new Schema(
  {
    ...idField,
    orderId: { type: String, required: true, index: true },
    orderNumber: String,
    customerId: { type: String, required: true, index: true },
    customerName: String,
    vendorId: { type: String, required: true, index: true },
    reason: { type: String, enum: RETURN_REASONS, required: true },
    note: { type: String, default: "" },
    amountPaise: Number,
    status: { type: String, enum: RETURN_STATUSES, default: "requested", index: true },
  },
  schemaOptions,
);
export const ReturnRequest = model("ReturnRequest", returnSchema);
