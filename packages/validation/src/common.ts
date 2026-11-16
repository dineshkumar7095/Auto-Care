import { z } from "zod";

export const indianMobile = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s-]/g, ""))
  .refine((v) => /^(\+91)?[6-9]\d{9}$/.test(v), "Enter a valid 10-digit Indian mobile number")
  .transform((v) => (v.startsWith("+91") ? v : `+91${v}`));

export const pinCode = z.string().regex(/^[1-9]\d{5}$/, "Enter a valid 6-digit PIN code");
export const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid id");
export const paise = z.number().int("Money must be whole paise").nonnegative();
export const pagination = z.object({ page: z.coerce.number().int().min(1).default(1), pageSize: z.coerce.number().int().min(1).max(100).default(20) });

/** Query-string flag: only "true"/"1" mean yes (z.coerce.boolean would treat "false" as true). */
export const queryBoolean = z
  .union([z.boolean(), z.enum(["true", "false", "1", "0"])])
  .transform((v) => v === true || v === "true" || v === "1");
