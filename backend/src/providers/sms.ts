/**
 * SMS provider slot. Sign-in codes and alerts go through `sms()`; pick the provider with SMS_PROVIDER.
 * India needs a DLT-registered sender ID and template — register them with your provider first.
 */
export interface SmsProvider {
  readonly name: string;
  send(to: string, text: string, opts?: { templateId?: string }): Promise<void>;
}

/** Development default: prints a masked line instead of sending. */
export const consoleSms: SmsProvider = {
  name: "console",
  async send(to, text) {
    console.info(`[sms:console] to ${to.slice(0, -4)}xxxx: ${text.replace(/\d{6}/g, "••••••")}`);
  },
};

/** MSG91 — set SMS_PROVIDER=msg91, MSG91_AUTH_KEY, MSG91_TEMPLATE_ID. */
export const msg91Sms = (authKey: string, templateId: string): SmsProvider => ({
  name: "msg91",
  async send(to, text, opts) {
    const res = await fetch("https://control.msg91.com/api/v5/flow/", {
      method: "POST",
      headers: { authkey: authKey, "content-type": "application/json" },
      body: JSON.stringify({ template_id: opts?.templateId ?? templateId, recipients: [{ mobiles: to.replace(/^\+/, ""), message: text }] }),
    });
    if (!res.ok) throw new Error(`MSG91 send failed: ${res.status}`);
  },
});

/** Twilio — set SMS_PROVIDER=twilio, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM. */
export const twilioSms = (sid: string, token: string, from: string): SmsProvider => ({
  name: "twilio",
  async send(to, text) {
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: "POST",
      headers: { authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`, "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ To: to, From: from, Body: text }),
    });
    if (!res.ok) throw new Error(`Twilio send failed: ${res.status}`);
  },
});

let current: SmsProvider | null = null;
export function sms(): SmsProvider {
  if (current) return current;
  const e = process.env;
  switch (e["SMS_PROVIDER"] ?? "console") {
    case "msg91":
      current = msg91Sms(required("MSG91_AUTH_KEY"), required("MSG91_TEMPLATE_ID"));
      break;
    case "twilio":
      current = twilioSms(required("TWILIO_ACCOUNT_SID"), required("TWILIO_AUTH_TOKEN"), required("TWILIO_FROM"));
      break;
    default:
      current = consoleSms;
  }
  return current;
}
export const setSmsProvider = (p: SmsProvider | null) => {
  current = p;
};
function required(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is required for SMS_PROVIDER=${process.env["SMS_PROVIDER"]}`);
  return v;
}
