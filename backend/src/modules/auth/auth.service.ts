import { createHash, randomInt, timingSafeEqual } from "node:crypto";
import { canAccessPortal, type AuthSession, type PortalId } from "@automotive/shared-types";
import { signAccessToken } from "../../common/auth";
import { HttpError, forbidden } from "../../common/http-error";
import { env } from "../../config/env";
import { sms } from "../../providers/sms";
import { User } from "../users/user.model";
import { Otp } from "./otp.model";

const OTP_TTL_MS = 5 * 60_000;
const MAX_ATTEMPTS = 5;
const hash = (code: string) => createHash("sha256").update(code).digest("hex");

export async function requestOtp(phone: string): Promise<{ sent: true; devCode?: string }> {
  const devCode = env().OTP_DEV_CODE;
  const code = devCode ?? String(randomInt(100000, 1000000));
  await Otp.deleteMany({ phone });
  await Otp.create({ phone, codeHash: hash(code), expiresAt: new Date(Date.now() + OTP_TTL_MS) });
  if (!devCode) {
    await sms().send(phone, `${code} is your Dono Auto Care sign-in code. It expires in 5 minutes. Do not share it.`);
  }
  return devCode ? { sent: true, devCode } : { sent: true };
}

export async function verifyOtp(phone: string, code: string, portal: PortalId): Promise<AuthSession> {
  const otp = await Otp.findOne({ phone }).sort({ createdAt: -1 });
  if (!otp || otp.expiresAt.getTime() < Date.now()) throw new HttpError(401, "invalid_otp", "That code is incorrect or expired");
  if (otp.attempts >= MAX_ATTEMPTS) throw new HttpError(429, "too_many_attempts", "Too many tries. Request a new code.");
  const ok = timingSafeEqual(Buffer.from(otp.codeHash), Buffer.from(hash(code)));
  if (!ok) {
    otp.attempts += 1;
    await otp.save();
    throw new HttpError(401, "invalid_otp", "That code is incorrect or expired");
  }
  await otp.deleteOne();

  let user = await User.findOne({ phone });
  // Customers self-register on first sign-in; business accounts are created through partner onboarding.
  if (!user && portal === "customer-web") user = await User.create({ phone, name: "New customer", roles: ["customer"] });
  if (!user) throw new HttpError(403, "portal_forbidden", "No business account for this number. Apply as a partner first.");
  if (user.status !== "active") throw forbidden("This account is suspended");
  if (!canAccessPortal(user.roles, portal)) throw new HttpError(403, "portal_forbidden", "This account can't use this portal");

  const sessionUser = { id: user._id, name: user.name, roles: user.roles, vendorId: user.vendorId ?? null, fleetId: user.fleetId ?? null, portal };
  return {
    accessToken: signAccessToken(sessionUser),
    user: { id: user._id, name: user.name, phone: user.phone, roles: user.roles, vendorId: sessionUser.vendorId, fleetId: sessionUser.fleetId },
  };
}
