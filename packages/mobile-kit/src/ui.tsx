import type { ReactNode } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View, type TextInputProps, type ViewStyle } from "react-native";
import { colors, radius, space } from "./theme";

import type { Tone } from "./tone";
export type { Tone };
const TONE: Record<Tone, { bg: string; fg: string }> = {
  neutral: { bg: colors.mint, fg: colors.navy2 },
  info: { bg: colors.infoSoft, fg: colors.accent },
  success: { bg: colors.successSoft, fg: colors.success },
  warning: { bg: colors.warningSoft, fg: colors.warning },
  danger: { bg: colors.dangerSoft, fg: colors.danger },
};

export function Badge({ label, tone = "neutral" }: { label: string; tone?: Tone }) {
  return (
    <View style={[s.badge, { backgroundColor: TONE[tone].bg }]}>
      <Text style={[s.badgeText, { color: TONE[tone].fg }]}>{label}</Text>
    </View>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[s.card, style]}>{children}</View>;
}

export function H1({ children }: { children: ReactNode }) {
  return <Text style={s.h1}>{children}</Text>;
}
export function H2({ children }: { children: ReactNode }) {
  return <Text style={s.h2}>{children}</Text>;
}
export function Body({ children, muted, bold }: { children: ReactNode; muted?: boolean; bold?: boolean }) {
  return <Text style={[s.body, muted && { color: colors.muted }, bold && { fontWeight: "700" }]}>{children}</Text>;
}

export function Button({ title, onPress, variant = "primary", disabled, loading }: { title: string; onPress: () => void; variant?: "primary" | "outline" | "danger"; disabled?: boolean; loading?: boolean }) {
  const bg = variant === "primary" ? colors.navy : variant === "danger" ? colors.danger : "transparent";
  const fg = variant === "outline" ? colors.navy : "#ffffff";
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled || !!loading }}
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [s.button, { backgroundColor: bg, opacity: disabled ? 0.5 : pressed ? 0.85 : 1 }, variant === "outline" && s.outline]}
    >
      {loading ? <ActivityIndicator color={fg} /> : <Text style={[s.buttonText, { color: fg }]}>{title}</Text>}
    </Pressable>
  );
}

export function Field({ label, ...props }: TextInputProps & { label: string }) {
  return (
    <View style={{ gap: space(1.5) }}>
      <Text style={s.label}>{label}</Text>
      <TextInput accessibilityLabel={label} placeholderTextColor={colors.muted} style={s.input} {...props} />
    </View>
  );
}

export function Loading() {
  return <ActivityIndicator style={{ marginTop: space(8) }} color={colors.navy} />;
}

export function Empty({ title }: { title: string }) {
  return <Text style={[s.body, { color: colors.muted, textAlign: "center", marginTop: space(8) }]}>{title}</Text>;
}

const s = StyleSheet.create({
  badge: { alignSelf: "flex-start", borderRadius: radius.pill, paddingHorizontal: space(2.5), paddingVertical: space(1) },
  badgeText: { fontSize: 12, fontWeight: "600" },
  card: { backgroundColor: colors.background, borderColor: colors.border, borderWidth: 1, borderRadius: radius.lg, padding: space(4), gap: space(2) },
  h1: { fontSize: 26, fontWeight: "700", color: colors.text },
  h2: { fontSize: 18, fontWeight: "700", color: colors.text },
  body: { fontSize: 15, color: colors.text, lineHeight: 21 },
  button: { minHeight: 48, borderRadius: radius.md, alignItems: "center", justifyContent: "center", paddingHorizontal: space(4) },
  outline: { borderWidth: 1, borderColor: colors.border },
  buttonText: { fontSize: 16, fontWeight: "600" },
  label: { fontSize: 13, fontWeight: "600", color: colors.muted },
  input: { minHeight: 48, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: space(3), fontSize: 16, color: colors.text, backgroundColor: colors.background },
});
