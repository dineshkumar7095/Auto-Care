import { Schema, model } from "mongoose";
import { idField, schemaOptions } from "../../db/schema";

const fleetVehicleSchema = new Schema(
  {
    ...idField,
    fleetId: { type: String, required: true, index: true },
    registration: { type: String, required: true },
    model: String,
    category: { type: String, enum: ["car", "truck", "bus", "three-wheeler", "ev"] },
    odometerKm: Number,
    nextServiceKm: Number,
    status: { type: String, enum: ["active", "in_service", "breakdown", "idle"], default: "active" },
    driver: { type: String, default: null },
  },
  schemaOptions,
);
export const FleetVehicle = model("FleetVehicle", fleetVehicleSchema);

const approvalSchema = new Schema(
  { ...idField, fleetId: { type: String, required: true, index: true }, title: String, amountPaise: Number, requestedBy: String, status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" } },
  schemaOptions,
);
export const FleetApproval = model("FleetApproval", approvalSchema);

const spendSchema = new Schema(
  { ...idField, fleetId: { type: String, required: true, index: true }, month: String, order: Number, partsPaise: Number, servicePaise: Number, towingPaise: Number },
  schemaOptions,
);
export const FleetSpend = model("FleetSpend", spendSchema);
