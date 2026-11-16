import { Schema, model } from "mongoose";
import { idField, schemaOptions } from "../../db/schema";

const workshopSchema = new Schema(
  {
    ...idField,
    vendorId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    area: String,
    city: { type: String, required: true, index: true },
    distanceKm: Number,
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
    specialties: [String],
    fromPricePaise: Number,
    nextSlot: String,
    hours: String,
    pickup: { type: Boolean, default: false },
    /** Only EV-qualified workshops may take high-voltage EV jobs. */
    evQualified: { type: Boolean, default: false },
  },
  schemaOptions,
);
export const Workshop = model("Workshop", workshopSchema);
