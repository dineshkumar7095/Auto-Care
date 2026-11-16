import { Schema, model } from "mongoose";
import { idField, schemaOptions } from "../../db/schema";

/** Payment attempts. Only provider references are stored — never card numbers. */
const paymentSchema = new Schema(
  {
    ...idField,
    orderId: { type: String, required: true, index: true },
    customerId: { type: String, required: true },
    amountPaise: { type: Number, required: true },
    provider: { type: String, default: "mock" },
    providerRef: String,
    status: { type: String, enum: ["created", "authorised", "captured", "failed", "refunded"], default: "created" },
  },
  schemaOptions,
);
export const Payment = model("Payment", paymentSchema);
