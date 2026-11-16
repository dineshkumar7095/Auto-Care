export const env = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:4000/api/v1",
  useMocks: (process.env.EXPO_PUBLIC_USE_MOCKS ?? "true") !== "false",
};
export const PORTAL = "customer-web" as const;
/** Emergency first: towing screens always show this before anything else. */
export const EMERGENCY_NUMBER = "112";
