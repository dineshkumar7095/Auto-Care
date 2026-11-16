import { Schema, model } from "mongoose";
import { TICKET_STATUSES } from "@automotive/shared-types";
import { idField, schemaOptions } from "../../db/schema";

const teamMemberSchema = new Schema(
  {
    ...idField,
    ownerId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    title: { type: String, required: true },
    active: { type: Boolean, default: true },
    joinedAt: { type: Date, default: () => new Date() },
  },
  schemaOptions,
);
teamMemberSchema.index({ ownerId: 1, phone: 1 }, { unique: true });
export const TeamMember = model("TeamMember", teamMemberSchema);

/** One settings document per business; `values` is free-form, each portal decides its fields. */
const settingsSchema = new Schema(
  { ...idField, ownerId: { type: String, required: true, unique: true }, values: { type: Schema.Types.Mixed, default: {} } },
  { ...schemaOptions, minimize: false },
);
export const BusinessSettings = model("BusinessSettings", settingsSchema);

const ticketSchema = new Schema(
  {
    ...idField,
    number: { type: String, required: true, unique: true },
    subject: { type: String, required: true },
    raisedBy: { type: String, required: true },
    raisedByType: { type: String, enum: ["customer", "partner"], required: true },
    priority: { type: String, enum: ["high", "medium", "low"], default: "medium" },
    status: { type: String, enum: TICKET_STATUSES, default: "open", index: true },
  },
  schemaOptions,
);
export const SupportTicket = model("SupportTicket", ticketSchema);

const branchStockSchema = new Schema(
  {
    ...idField,
    vendorId: { type: String, required: true, index: true },
    branch: { type: String, required: true },
    title: { type: String, required: true },
    partNumber: { type: String, required: true },
    onHand: { type: Number, min: 0, default: 0 },
    reorderLevel: { type: Number, min: 0, default: 0 },
  },
  schemaOptions,
);
export const BranchStock = model("BranchStock", branchStockSchema);
