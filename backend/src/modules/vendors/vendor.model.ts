import { Schema, model } from "mongoose";
import { VENDOR_STATUSES, VENDOR_TYPES } from "@automotive/shared-types";
import { idField, schemaOptions } from "../../db/schema";

/** Any business on the platform: seller, distributor, workshop, towing company or brand. */
const vendorSchema = new Schema(
  {
    ...idField,
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: VENDOR_TYPES, required: true, index: true },
    city: { type: String, required: true },
    gstin: String,
    /** GST registration state; decides CGST+SGST vs IGST on invoices. */
    state: { type: String, default: "Telangana" },
    status: { type: String, enum: VENDOR_STATUSES, default: "pending", index: true },
    risk: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    documents: [{ _id: false, label: String, verified: { type: Boolean, default: false } }],
    submittedAt: { type: Date, default: () => new Date() },
  },
  schemaOptions,
);
export const Vendor = model("Vendor", vendorSchema);
