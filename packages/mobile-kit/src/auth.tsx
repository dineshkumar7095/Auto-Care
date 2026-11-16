import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import * as SecureStore from "expo-secure-store";
import { api, configureApiClient } from "@automotive/api-client";
import { canAccessPortal, type AuthSession, type PortalId } from "@automotive/shared-types";
import { normaliseIndianPhone } from "./phone";

type MobileAuth = {
  session: AuthSession | null;
  ready: boolean;
  requestOtp: (phone: string) => Promise<{ devCode?: string }>;
  verifyOtp: (phone: string, code: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<MobileAuth | null>(null);

/**
 * Same central OTP sign-in as the websites. The app signs in "as" a portal so the backend applies that portal's
 * role check (customer-mobile → customer-web roles, driver-mobile → towing-portal roles). Tokens live in the
 * device keychain via expo-secure-store, never in plain storage.
 */
export function MobileAuthProvider({ portal, apiUrl, useMocks, children }: { portal: PortalId; apiUrl: string; useMocks: boolean; children: ReactNode }) {
  const key = `dono_session_${portal.replace(/-/g, "_")}`;
  const [session, setSession] = useState<AuthSession | null>(null);
  const [ready, setReady] = useState(false);

  const signOut = useCallback(async () => {
    await SecureStore.deleteItemAsync(key);
    setSession(null);
  }, [key]);

  useEffect(() => {
    let token: string | null = null;
    configureApiClient({ baseUrl: apiUrl, useMocks, getToken: () => token, onUnauthorized: () => void signOut() });
    void SecureStore.getItemAsync(key).then((raw) => {
      const saved = raw ? (JSON.parse(raw) as AuthSession) : null;
      token = saved?.accessToken ?? null;
      setSession(saved);
      setReady(true);
    });
  }, [apiUrl, useMocks, key, signOut]);

  useEffect(() => {
    configureApiClient({ getToken: () => session?.accessToken ?? null });
  }, [session]);

  const value = useMemo<MobileAuth>(
    () => ({
      session,
      ready,
      requestOtp: (phone) => api.auth.requestOtp({ phone: normaliseIndianPhone(phone) }),
      verifyOtp: async (phone, code) => {
        const s = await api.auth.verifyOtp({ phone: normaliseIndianPhone(phone), code, portal });
        if (!canAccessPortal(s.user.roles, portal)) throw new Error("This account can't use this app");
        await SecureStore.setItemAsync(key, JSON.stringify(s));
        setSession(s);
      },
      signOut,
    }),
    [session, ready, portal, key, signOut],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useMobileAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useMobileAuth must be used inside MobileAuthProvider");
  return v;
}
