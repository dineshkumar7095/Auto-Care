import type { ApprovalRequest, FleetSpendMonth, FleetVehicle } from "@automotive/shared-types";
import { request } from "../http";

export const fleetApi = {
  listVehicles: () => request<FleetVehicle[]>("GET", "/fleet/vehicles"),
  listApprovals: () => request<ApprovalRequest[]>("GET", "/fleet/approvals"),
  decide: (id: string, decision: "approve" | "reject") => request<ApprovalRequest>("POST", `/fleet/approvals/${id}/decision`, { body: { decision } }),
  spend: () => request<FleetSpendMonth[]>("GET", "/fleet/spend"),
};
