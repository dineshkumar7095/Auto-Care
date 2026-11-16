/** Native copy of the "Clean trust blue" tokens in packages/shared-ui/src/styles/theme.css. Keep the two in step. */
export const colors = {
  background: "#ffffff",
  surface: "#f6f9f5",
  mint: "#eef4ed",
  navy: "#0b2545",
  navy2: "#13315c",
  text: "#0b2545",
  muted: "#5b6b80",
  border: "#dfe6ee",
  accent: "#1f6fd1",
  success: "#18794e",
  successSoft: "#e3f5ea",
  warning: "#a35c00",
  warningSoft: "#fff3dc",
  danger: "#c42b2b",
  dangerSoft: "#fde8e8",
  infoSoft: "#e6f0fb",
} as const;

export const space = (n: number) => n * 4;
export const radius = { sm: 8, md: 12, lg: 16, pill: 999 } as const;
export const font = { display: "System", body: "System" } as const;
