import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PORTAL_ROLES, ROLES, hasPermission, type Permission, type PortalId, type Role } from "@automotive/shared-types";
import { z } from "zod";
import { env } from "../config/env";
import { forbidden, unauthenticated } from "./http-error";

export type RequestUser = { id: string; name: string; roles: Role[]; vendorId: string | null; fleetId: string | null; portal: PortalId };

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: RequestUser;
    }
  }
}

const claimsSchema = z.object({
  sub: z.string(),
  name: z.string(),
  roles: z.array(z.enum(ROLES)),
  vendorId: z.string().nullable(),
  fleetId: z.string().nullable(),
  portal: z.string(),
});

export const signAccessToken = (u: RequestUser) =>
  jwt.sign({ name: u.name, roles: u.roles, vendorId: u.vendorId, fleetId: u.fleetId, portal: u.portal }, env().JWT_SECRET, {
    subject: u.id,
    expiresIn: env().JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });

/** Verifies the bearer token issued by /auth/otp/verify. */
export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return next(unauthenticated());
  try {
    const claims = claimsSchema.parse(jwt.verify(header.slice(7), env().JWT_SECRET));
    req.user = { id: claims.sub, name: claims.name, roles: claims.roles, vendorId: claims.vendorId, fleetId: claims.fleetId, portal: claims.portal as PortalId };
    next();
  } catch {
    next(unauthenticated("Your session has expired. Please sign in again."));
  }
}

export const currentUser = (req: Request): RequestUser => {
  if (!req.user) throw unauthenticated();
  return req.user;
};

/** Allow only roles that belong to a portal (e.g. admin endpoints → admin-portal roles). */
export const requirePortal = (portal: PortalId) => (req: Request, _res: Response, next: NextFunction) => {
  const u = currentUser(req);
  if (!u.roles.some((r) => PORTAL_ROLES[portal].includes(r))) return next(forbidden());
  next();
};

export const requirePermission = (permission: Permission) => (req: Request, _res: Response, next: NextFunction) => {
  if (!hasPermission(currentUser(req).roles, permission)) return next(forbidden());
  next();
};

/** Vendor-scoped endpoints need the caller to belong to a vendor. */
export const vendorIdOf = (req: Request) => {
  const v = currentUser(req).vendorId;
  if (!v) throw forbidden("This account isn't linked to a business");
  return v;
};
