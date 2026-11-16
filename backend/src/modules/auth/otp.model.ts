import { Schema, model } from "mongoose";
import { idField, schemaOptions } from "../../db/schema";

/** Hashed one-time codes. Mongo TTL index deletes them after expiry. */
const otpSchema = new Schema(
  {
    ...idField,
    phone: { type: String, required: true, index: true },
    codeHash: { type: String, required: true },
    attempts: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
  },
  schemaOptions,
);
export const Otp = model("Otp", otpSchema);
