import { useState, type FormEvent } from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { otpRequestSchema } from "@automotive/validation";
import { BrandMark } from "@automotive/shared-ui/domain/brand-mark";
import { Button } from "@automotive/shared-ui/ui/button";
import { Input } from "@automotive/shared-ui/ui/input";
import { Label } from "@automotive/shared-ui/ui/label";
import { useAuth } from "./auth-context";

type Props = { portalLabel: string; tagline: string; demoPhone?: string; onSignedIn: () => void };

/** Mobile-number + OTP sign-in, shared by every portal. */
export function LoginScreen({ portalLabel, tagline, demoPhone, onSignedIn }: Props) {
  const auth = useAuth();
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState(demoPhone?.replace("+91", "") ?? "");
  const [code, setCode] = useState("");
  const [hint, setHint] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submitPhone = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = otpRequestSchema.safeParse({ phone });
    if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? "Check the number");
    setBusy(true);
    try {
      const res = await auth.requestOtp(parsed.data.phone);
      setHint(res.devCode ? `Demo code: ${res.devCode}` : "We sent a 6-digit code by SMS.");
      setPhone(parsed.data.phone);
      setStep("code");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't send the code");
    } finally {
      setBusy(false);
    }
  };

  const submitCode = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await auth.verifyOtp(phone, code);
      onSignedIn();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't sign you in");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-hero p-10 text-primary-foreground lg:flex">
        <BrandMark tone="light" suffix={portalLabel} />
        <div>
          <h1 className="text-4xl font-semibold leading-tight">{tagline}</h1>
          <p className="mt-3 flex items-center gap-2 text-sm text-primary-foreground/80">
            <ShieldCheck className="size-4" /> Secure sign-in with your mobile number
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <BrandMark suffix={portalLabel} />
          </div>
          <h2 className="text-2xl font-semibold">Sign in</h2>
          <p className="mt-1 text-sm text-muted-foreground">{step === "phone" ? "Enter your mobile number to get a code." : `Enter the code sent to ${phone}.`}</p>

          {step === "phone" ? (
            <form onSubmit={submitPhone} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="phone">Mobile number</Label>
                <div className="flex">
                  <span className="grid place-items-center rounded-l-md border border-r-0 bg-muted px-3 text-sm text-muted-foreground">+91</span>
                  <Input id="phone" inputMode="numeric" autoComplete="tel-national" value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-l-none" placeholder="98450 12345" />
                </div>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" size="xl" className="w-full" disabled={busy}>
                {busy ? "Sending…" : "Get code"}
              </Button>
            </form>
          ) : (
            <form onSubmit={submitCode} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="code">6-digit code</Label>
                <Input id="code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} placeholder="••••••" className="tracking-[0.5em]" />
                {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" size="xl" className="w-full" disabled={busy || code.length !== 6}>
                {busy ? "Checking…" : "Sign in"}
              </Button>
              <button type="button" onClick={() => setStep("phone")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="size-4" /> Change number
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
