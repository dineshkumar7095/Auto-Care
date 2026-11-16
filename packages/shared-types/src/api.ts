import type { Role } from "./roles";

/** Every API response uses one envelope. */
export type ApiSuccess<T> = { ok: true; data: T };
export type ApiFailure = { ok: false; error: { code: string; message: string; details?: unknown } };
export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export type Paginated<T> = { items: T[]; total: number; page: number; pageSize: number };

export type AuthUser = { id: string; name: string; phone: string; email?: string; roles: Role[]; vendorId?: string | null; fleetId?: string | null };
export type AuthSession = { accessToken: string; user: AuthUser };

export type DashboardStat = { label: string; value: string; hint?: string; tone?: "default" | "success" | "warning" | "danger" };
