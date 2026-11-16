import { Schema, model } from "mongoose";
import { BUYER_GROUPS, RFQ_STATUSES } from "@automotive/shared-types";
import { idField, schemaOptions } from "../../db/schema";

const rfqSchema = new Schema(
  {
    ...idField,
    number: { type: String, required: true, unique: true },
    vendorId: { type: String, required: true, index: true },
    buyerName: String,
    buyerType: { type: String, enum: BUYER_GROUPS },
    lines: [{ _id: false, title: String, partNumber: String, quantity: Number, targetUnitPaise: { type: Number, default: null } }],
    status: { type: String, enum: RFQ_STATUSES, default: "open" },
    expiresAt: Date,
    quotedTotalPaise: { type: Number, default: null },
  },
  schemaOptions,
);
export const Rfq = model("Rfq", rfqSchema);

const priceListSchema = new Schema(
  { ...idField, vendorId: { type: String, required: true, index: true }, name: String, buyerGroup: { type: String, enum: BUYER_GROUPS }, discountPct: Number, minOrderPaise: Number, skuCount: Number, active: { type: Boolean, default: true } },
  schemaOptions,
);
export const PriceList = model("PriceList", priceListSchema);

const creditSchema = new Schema(
  { ...idField, vendorId: { type: String, required: true, index: true }, buyerName: String, limitPaise: Number, usedPaise: Number, termsDays: Number, overdueDays: { type: Number, default: 0 } },
  schemaOptions,
);
export const CreditAccount = model("CreditAccount", creditSchema);
