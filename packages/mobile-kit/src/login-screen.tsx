import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import { useMobileAuth } from "./auth";
import { colors, space } from "./theme";
import { Body, Button, Field, H1 } from "./ui";

/** Phone + OTP sign-in, shared by both apps. */
export function LoginScreen({ appName, demoPhone }: { appName: string; demoPhone?: string }) {
  const auth = useMobileAuth();
  const [phone, setPhone] = useState(demoPhone ?? "");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={s.wrap}>
      <View style={s.logo}><Text style={s.logoText}>DA</Text></View>
      <H1>{appName}</H1>
      <Body muted>Sign in with your mobile number. We'll text you a 6-digit code.</Body>
      {step === "phone" ? (
        <>
          <Field label="Mobile number" keyboardType="phone-pad" autoComplete="tel" value={phone} onChangeText={setPhone} placeholder="98000 00001" />
          <Button title="Send code" loading={busy} disabled={phone.replace(/\D/g, "").length < 10} onPress={() => run(async () => {
            const r = await auth.requestOtp(phone);
            setHint(r.devCode ? `Demo code: ${r.devCode}` : null);
            setStep("code");
          })} />
        </>
      ) : (
        <>
          <Field label="6-digit code" keyboardType="number-pad" autoComplete="one-time-code" maxLength={6} value={code} onChangeText={(t) => setCode(t.replace(/\D/g, ""))} />
          {hint && <Body muted>{hint}</Body>}
          <Button title="Sign in" loading={busy} disabled={code.length !== 6} onPress={() => run(() => auth.verifyOtp(phone, code))} />
          <Button title="Change number" variant="outline" onPress={() => setStep("phone")} />
        </>
      )}
      {error && <Text style={s.error}>{error}</Text>}
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, padding: space(6), justifyContent: "center", gap: space(4), backgroundColor: colors.background },
  logo: { width: 56, height: 56, borderRadius: 16, backgroundColor: colors.navy, alignItems: "center", justifyContent: "center" },
  logoText: { color: "#ffffff", fontWeight: "800", fontSize: 20 },
  error: { color: colors.danger, fontSize: 14 },
});
