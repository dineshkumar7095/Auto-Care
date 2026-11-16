import type { Booking, JobCard, JobStage, Workshop } from "@automotive/shared-types";
import { request } from "../http";

export const bookingsApi = {
  listWorkshops: (query: { service?: string; pickup?: boolean } = {}) => request<Workshop[]>("GET", "/bookings/workshops", { query }),
  create: (input: { workshopId: string; service: string; slot: string; vehicleLabel: string; issue?: string }) => request<Booking>("POST", "/bookings", { body: input }),
  listToday: () => request<Booking[]>("GET", "/bookings/workshop/today"),
  listJobs: () => request<JobCard[]>("GET", "/bookings/jobs"),
  updateJobStage: (id: string, stage: JobStage) => request<JobCard>("PATCH", `/bookings/jobs/${id}/stage`, { body: { stage } }),
};
