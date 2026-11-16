import { Schema, model } from "mongoose";
import { JOB_STAGES } from "@automotive/shared-types";
import { idField, schemaOptions } from "../../db/schema";

const bookingSchema = new Schema(
  {
    ...idField,
    workshopId: { type: String, required: true, index: true },
    customerId: String,
    customerName: { type: String, required: true },
    vehicleLabel: { type: String, required: true },
    service: { type: String, required: true },
    slot: { type: String, required: true },
    issue: String,
    pickup: { type: Boolean, default: false },
    source: { type: String, enum: ["marketplace", "walk_in"], default: "marketplace" },
  },
  schemaOptions,
);
export const Booking = model("Booking", bookingSchema);

const jobCardSchema = new Schema(
  {
    ...idField,
    number: { type: String, required: true, unique: true },
    workshopId: { type: String, required: true, index: true },
    bookingId: String,
    vehicleLabel: String,
    registration: String,
    customerName: String,
    complaint: String,
    stage: { type: String, enum: JOB_STAGES, default: "booked", index: true },
    technician: { type: String, default: null },
    estimate: [{ _id: false, label: String, kind: { type: String, enum: ["part", "labour", "material"] }, amountPaise: Number, approved: Boolean }],
    promisedAt: String,
  },
  schemaOptions,
);
export const JobCard = model("JobCard", jobCardSchema);
