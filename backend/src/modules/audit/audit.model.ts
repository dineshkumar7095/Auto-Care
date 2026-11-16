import { Schema, model } from "mongoose";
import { idField, schemaOptions } from "../../db/schema";

/** Append-only record of sensitive actions (approvals, status changes, refunds). */
const auditSchema = new Schema(
  {
    ...idField,
    actorId: { type: String, required: true, index: true },
    action: { type: String, required: true },
    entity: { type: String, required: true },
    entityId: { type: String, required: true, index: true },
    note: String,
    meta: Schema.Types.Mixed,
  },
  schemaOptions,
);
export const AuditLog = model("AuditLog", auditSchema);

export const audit = (actorId: string, action: string, entity: string, entityId: string, note?: string, meta?: unknown) =>
  AuditLog.create({ actorId, action, entity, entityId, note, meta });
