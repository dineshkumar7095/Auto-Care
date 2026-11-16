import { Router } from "express";
import rateLimit from "express-rate-limit";
import { otpRequestSchema, otpVerifySchema } from "@automotive/validation";
import { currentUser, requireAuth } from "../../common/auth";
import { notFound } from "../../common/http-error";
import { send } from "../../common/respond";
import { validateBody } from "../../common/validate";
import { env } from "../../config/env";
import { User } from "../users/user.model";
import { requestOtp, verifyOtp } from "./auth.service";

export const authRouter = Router();
const otpLimiter = rateLimit({ windowMs: 10 * 60_000, limit: 10, standardHeaders: "draft-8", legacyHeaders: false, skip: () => env().NODE_ENV === "test" });

authRouter.post("/otp/request", otpLimiter, validateBody(otpRequestSchema), async (req, res) => {
  send(res, await requestOtp(req.body.phone));
});

authRouter.post("/otp/verify", otpLimiter, validateBody(otpVerifySchema), async (req, res) => {
  send(res, await verifyOtp(req.body.phone, req.body.code, req.body.portal));
});

authRouter.get("/me", requireAuth, async (req, res) => {
  const u = await User.findById(currentUser(req).id);
  if (!u) throw notFound("User");
  send(res, { id: u._id, name: u.name, phone: u.phone, roles: u.roles, vendorId: u.vendorId ?? null, fleetId: u.fleetId ?? null });
});
