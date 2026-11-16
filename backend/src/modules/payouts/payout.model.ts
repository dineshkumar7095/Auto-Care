import { Schema, model } from "mongoose";
import { PAYOUT_STATUSES } from "@automotive/shared-types";
import { idField, schemaOptions } from "../../db/schema";

/** Weekly settlement per partner. Amounts come from utilities.computePayout so rates live in one place. */
const payoutSchema = new Schema(
  {
    ...idField,
    vendorId: { type: String, required: true, index: true },
    vendorName: String,
    periodLabel: String,
    grossPaise: Number,
    commissionPaise: Number,
    tdsPaise: Number,
    refundsPaise: Number,
    netPaise: Number,
    status: { type: String, enum: PAYOUT_STATUSES, default: "scheduled" },
    payoutDate: Date,
  },
  schemaOptions,
);
export const Payout = model("Payout", payoutSchema);
