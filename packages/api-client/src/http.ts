import type { ApiResponse } from "@automotive/shared-types";
import { getApiConfig } from "./config";
import { ApiError } from "./errors";
import { handleMockRequest } from "./mock/server";

export type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export type RequestOptions = { query?: Record<string, string | number | boolean | undefined>; body?: unknown; signal?: AbortSignal };

const toQueryString = (query: RequestOptions["query"]) => {
  if (!query) return "";
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) if (v !== undefined && v !== "") params.set(k, String(v));
  const s = params.toString();
  return s ? `?${s}` : "";
};

export async function request<T>(method: HttpMethod, path: string, opts: RequestOptions = {}): Promise<T> {
  const cfg = getApiConfig();
  const token = cfg.getToken();
  const fullPath = `${path}${toQueryString(opts.query)}`;

  let status: number;
  let payload: ApiResponse<T>;

  if (cfg.useMocks) {
    ({ status, payload } = await handleMockRequest<T>(method, fullPath, opts.body, token));
  } else {
    const res = await fetch(`${cfg.baseUrl}${fullPath}`, {
      method,
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
      signal: opts.signal,
    });
    status = res.status;
    payload = (await res.json().catch(() => ({ ok: false, error: { code: "bad_response", message: "Unexpected server response" } }))) as ApiResponse<T>;
  }

  if (status === 401) cfg.onUnauthorized?.();
  if (!payload.ok) throw new ApiError(status, payload.error.code, payload.error.message, payload.error.details);
  return payload.data;
}
