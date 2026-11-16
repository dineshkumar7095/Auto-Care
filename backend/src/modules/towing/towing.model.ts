import { Schema, model } from "mongoose";
import { TOWING_ISSUES, TRIP_STATUSES, TRUCK_TYPES } from "@automotive/shared-types";
import { idField, schemaOptions } from "../../db/schema";

const providerSchema = new Schema(
  { ...idField, vendorId: { type: String, required: true, index: true }, name: String, etaMin: Number, distanceKm: Number, truck: String, evSafe: { type: Boolean, default: false }, pricePaise: Number, rating: Number, available: { type: Boolean, default: true } },
  schemaOptions,
);
export const TowingProvider = model("TowingProvider", providerSchema);

const tripSchema = new Schema(
  {
    ...idField,
    number: { type: String, required: true, unique: true },
    customerId: String,
    customerName: String,
    issue: { type: String, enum: TOWING_ISSUES, required: true },
    pickup: String,
    drop: String,
    vehicleLabel: String,
    providerId: { type: String, default: null, index: true },
    driverName: { type: String, default: null },
    status: { type: String, enum: TRIP_STATUSES, default: "requested", index: true },
    etaMin: { type: Number, default: null },
    quotedPaise: Number,
  },
  schemaOptions,
);
export const TowingTrip = model("TowingTrip", tripSchema);

const truckSchema = new Schema(
  {
    ...idField,
    vendorId: { type: String, required: true, index: true },
    registration: { type: String, required: true },
    type: { type: String, enum: TRUCK_TYPES },
    evSafe: { type: Boolean, default: false },
    driverName: { type: String, default: null },
    driverPhone: { type: String, default: null },
    status: { type: String, enum: ["available", "on_trip", "maintenance"], default: "available" },
  },
  schemaOptions,
);
export const TowTruck = model("TowTruck", truckSchema);
