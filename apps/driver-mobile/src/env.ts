export const env = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:4000/api/v1",
  useMocks: (process.env.EXPO_PUBLIC_USE_MOCKS ?? "true") !== "false",
};
/** Drivers sign in with the towing-portal role check (role "driver"). */
export const PORTAL = "towing-portal" as const;
