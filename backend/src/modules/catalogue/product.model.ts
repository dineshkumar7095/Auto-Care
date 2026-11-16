import { Schema, model } from "mongoose";
import { FITMENT_STATUSES, PART_CATEGORIES, PART_CLASSES } from "@automotive/shared-types";
import { idField, schemaOptions } from "../../db/schema";

/** A vendor's listing. Stock lives here and is changed only through the inventory service. */
const productSchema = new Schema(
  {
    ...idField,
    vendorId: { type: String, required: true, index: true },
    sellerName: { type: String, required: true },
    sellerCity: { type: String, required: true },
    sellerVerified: { type: Boolean, default: false },
    title: { type: String, required: true, trim: true },
    brand: { type: String, required: true },
    partNumber: { type: String, required: true, index: true },
    category: { type: String, enum: PART_CATEGORIES, required: true, index: true },
    partClass: { type: String, enum: PART_CLASSES, required: true },
    fitment: { type: String, enum: FITMENT_STATUSES, default: "seller-confirmed" },
    pricePaise: { type: Number, required: true, min: 0, validate: Number.isInteger },
    mrpPaise: { type: Number, required: true, min: 0, validate: Number.isInteger },
    gstRatePct: { type: Number, default: 18 },
    stock: { type: Number, required: true, min: 0 },
    delivery: { type: String, default: "In 2–3 days" },
    warranty: { type: String, default: "—" },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    returnable: { type: Boolean, default: true },
    specs: { type: Map, of: String, default: {} },
    proofDocumentUrl: String,
    listingStatus: { type: String, enum: ["live", "pending_review", "paused"], default: "pending_review", index: true },
  },
  schemaOptions,
);
productSchema.index({ title: "text", brand: "text", partNumber: "text" });
export const Product = model("Product", productSchema);
