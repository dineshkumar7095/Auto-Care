import { z } from "zod";
import { PORTALS } from "@automotive/shared-types";
import { indianMobile } from "./common";

export const otpRequestSchema = z.object({ phone: indianMobile });
export const otpVerifySchema = z.object({ phone: indianMobile, code: z.string().regex(/^\d{6}$/, "Enter the 6-digit code"), portal: z.enum(PORTALS) });
export type OtpRequestInput = z.input<typeof otpRequestSchema>;
export type OtpVerifyInput = z.input<typeof otpVerifySchema>;
