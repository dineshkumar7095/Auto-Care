import type { Vendor, VendorStatus } from "@automotive/shared-types";
import { request } from "../http";

export const vendorsApi = {
  list: (query: { status?: VendorStatus } = {}) => request<Vendor[]>("GET", "/vendors", { query }),
  decide: (id: string, input: { decision: "approve" | "reject"; note?: string }) => request<Vendor>("POST", `/vendors/${id}/decision`, { body: input }),
};
