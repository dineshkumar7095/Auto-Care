import type { AuthSession, AuthUser, PortalId } from "@automotive/shared-types";
import type { OtpRequestInput } from "@automotive/validation";
import { request } from "../http";

export const authApi = {
  requestOtp: (input: OtpRequestInput) => request<{ sent: true; devCode?: string }>("POST", "/auth/otp/request", { body: input }),
  verifyOtp: (input: { phone: string; code: string; portal: PortalId }) => request<AuthSession>("POST", "/auth/otp/verify", { body: input }),
  me: () => request<AuthUser>("GET", "/auth/me"),
};
