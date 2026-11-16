import { Schema, model } from "mongoose";
import { VEHICLE_CATEGORIES } from "@automotive/shared-types";
import { idField, schemaOptions } from "../../db/schema";

const vehicleSchema = new Schema(
  {
    ...idField,
    ownerId: { type: String, required: true, index: true },
    registration: { type: String, required: true, uppercase: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    variant: String,
    year: { type: Number, required: true },
    fuel: { type: String, enum: ["petrol", "diesel", "cng", "electric", "hybrid"], required: true },
    category: { type: String, enum: VEHICLE_CATEGORIES, required: true },
  },
  schemaOptions,
);
vehicleSchema.index({ ownerId: 1, registration: 1 }, { unique: true });
export const Vehicle = model("Vehicle", vehicleSchema);
