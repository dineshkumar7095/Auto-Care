import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

/**
 * Payment gateway slot. The orders/payments module only talks to this interface, so switching
 * gateways (Razorpay, Cashfree, PhonePe, PayU…) means adding one adapter here — nothing else changes.
 */
export interface PaymentProvider {
  readonly name: string;
  /** Create a gateway order for an amount in paise; return the reference the frontend checkout needs. */
  createIntent(input: { amountPaise: number; receipt: string }): Promise<{ providerRef: string; checkout: Record<string, unknown> }>;
  /** Verify a webhook and return the paid reference, or null if the event isn't a successful payment. */
  verifyWebhook(rawBody: string, headers: Record<string, string | undefined>): { providerRef: string; status: "paid" | "failed" } | null;
}

/** Demo gateway: intents are created locally; webhooks are signed with PAYMENT_WEBHOOK_SECRET (HMAC-SHA256). */
export const mockPayments = (secret: string): PaymentProvider => ({
  name: "mock",
  async createIntent({ amountPaise, receipt }) {
    const providerRef = `mock_${randomUUID()}`;
    return { providerRef, checkout: { provider: "mock", amountPaise, receipt } };
  },
  verifyWebhook(rawBody, headers) {
    const sig = headers["x-mock-signature"];
    if (!sig) return null;
    const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
    if (sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
    const body = JSON.parse(rawBody) as { providerRef?: string; status?: string };
    if (!body.providerRef || (body.status !== "paid" && body.status !== "failed")) return null;
    return { providerRef: body.providerRef, status: body.status };
  },
});

let current: PaymentProvider | null = null;
export function payments(): PaymentProvider {
  if (current) return current;
  const provider = process.env["PAYMENT_PROVIDER"] ?? "mock";
  if (provider !== "mock") throw new Error(`PAYMENT_PROVIDER=${provider} has no adapter yet — add one in src/providers/payments.ts`);
  current = mockPayments(process.env["PAYMENT_WEBHOOK_SECRET"] ?? "dev-webhook-secret-change-me");
  return current;
}
export const setPaymentProvider = (p: PaymentProvider | null) => {
  current = p;
};
