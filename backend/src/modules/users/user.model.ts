import { Schema, model, type InferSchemaType } from "mongoose";
import { ROLES } from "@automotive/shared-types";
import { idField, schemaOptions } from "../../db/schema";

/** One identity across all portals. Roles decide which portals a user may enter. */
const userSchema = new Schema(
  {
    ...idField,
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, trim: true, lowercase: true },
    roles: { type: [String], enum: ROLES, default: ["customer"] },
    vendorId: { type: String, default: null, index: true },
    fleetId: { type: String, default: null, index: true },
    status: { type: String, enum: ["active", "suspended"], default: "active" },
  },
  schemaOptions,
);
export type UserDoc = InferSchemaType<typeof userSchema> & { _id: string };
export const User = model("User", userSchema);
