import { request } from "../http";

export type AdminOverview = {
  grossValuePaise: number;
  counts: { orders: number; bookings: number; trips: number };
  activePartners: number;
  pendingPartners: number;
  openDisputes: number;
  alerts: { level: "high" | "medium" | "low"; text: string }[];
  weekly: { day: string; parts: number; services: number; towing: number }[];
};

export const adminApi = {
  overview: () => request<AdminOverview>("GET", "/admin/overview"),
};
