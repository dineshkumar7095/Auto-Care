import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { api, configureApiClient } from "@automotive/api-client";
import { canAccessPortal, hasPermission, type AuthUser, type Permission, type PortalId, type Role } from "@automotive/shared-types";
import { sessionStore } from "./storage";

export type AuthState = {
  portal: PortalId;
  user: AuthUser | null;
  isAuthenticated: boolean;
  /** True when the signed-in user holds a role allowed in this portal. */
  canUsePortal: boolean;
  hasRole: (role: Role) => boolean;
  hasAnyRole: (roles: readonly Role[]) => boolean;
  can: (permission: Permission) => boolean;
  requestOtp: (phone: string) => Promise<{ devCode?: string }>;
  verifyOtp: (phone: string, code: string) => Promise<AuthUser>;
  signOut: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ portal, children, apiBaseUrl, useMocks }: { portal: PortalId; children: ReactNode; apiBaseUrl: string; useMocks: boolean }) {
  const [session, setSession] = useState(() => sessionStore.read(portal));

  const signOut = useCallback(() => {
    sessionStore.clear(portal);
    setSession(null);
  }, [portal]);

  // Wire the shared API client to this portal's session. Done during render (idempotent) so it is ready
  // before any child query fires — child effects run before parent effects.
  configureApiClient({ baseUrl: apiBaseUrl, useMocks, getToken: () => sessionStore.read(portal)?.accessToken ?? null, onUnauthorized: signOut });

  const value = useMemo<AuthState>(() => {
    const user = session?.user ?? null;
    const roles = user?.roles ?? [];
    return {
      portal,
      user,
      isAuthenticated: !!user,
      canUsePortal: canAccessPortal(roles, portal),
      hasRole: (r) => roles.includes(r),
      hasAnyRole: (rs) => rs.some((r) => roles.includes(r)),
      can: (p) => hasPermission(roles, p),
      requestOtp: async (phone) => api.auth.requestOtp({ phone }),
      verifyOtp: async (phone, code) => {
        const next = await api.auth.verifyOtp({ phone, code, portal });
        sessionStore.write(portal, next);
        setSession(next);
        return next.user;
      },
      signOut,
    };
  }, [session, portal, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
