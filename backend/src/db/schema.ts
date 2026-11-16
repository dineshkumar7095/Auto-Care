import { randomUUID } from "node:crypto";
import type { SchemaOptions } from "mongoose";

/** UUID string ids (never sequential), and API-friendly JSON: `id` instead of `_id`, no `__v`. */
export const idField = { _id: { type: String, default: () => randomUUID() } };

export const schemaOptions = {
  timestamps: true,
  versionKey: false,
  toJSON: {
    virtuals: false,
    transform: (_doc, ret: Record<string, unknown>) => {
      ret["id"] = ret["_id"];
      delete ret["_id"];
      return ret;
    },
  },
} satisfies SchemaOptions;
