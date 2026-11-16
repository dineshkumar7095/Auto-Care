import { Schema, model } from "mongoose";
import { idField, schemaOptions } from "../../db/schema";

const notificationSchema = new Schema(
  { ...idField, userId: { type: String, required: true, index: true }, title: String, body: String, channel: { type: String, enum: ["in_app", "sms", "email", "push"], default: "in_app" }, read: { type: Boolean, default: false } },
  schemaOptions,
);
export const Notification = model("Notification", notificationSchema);
