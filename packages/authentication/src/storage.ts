import type { AuthSession, PortalId } from "@automotive/shared-types";

/**
 * Sessions are stored per portal so signing in to the seller portal doesn't sign you in to admin.
 * sessionStorage keeps tokens out of long-lived storage; swap for httpOnly cookies when the backend issues them.
 */
const key = (portal: PortalId) => `dono.session.${portal}`;

export const sessionStore = {
  read(portal: PortalId): AuthSession | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.sessionStorage.getItem(key(portal));
      return raw ? (JSON.parse(raw) as AuthSession) : null;
    } catch {
      return null;
    }
  },
  write(portal: PortalId, session: AuthSession) {
    window.sessionStorage.setItem(key(portal), JSON.stringify(session));
  },
  clear(portal: PortalId) {
    window.sessionStorage.removeItem(key(portal));
  },
};
