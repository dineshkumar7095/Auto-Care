export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");

/** Mask a phone number for display, e.g. "+91 98xxxxxx21". */
export const maskPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 6) return phone;
  return `${digits.slice(0, digits.length - 8)} ${digits.slice(-10, -8)}xxxxxx${digits.slice(-2)}`.trim();
};

export const formatDateTime = (iso: string, timeZone = "Asia/Kolkata") =>
  new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone }).format(new Date(iso));

export const formatDate = (iso: string, timeZone = "Asia/Kolkata") =>
  new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", timeZone }).format(new Date(iso));
