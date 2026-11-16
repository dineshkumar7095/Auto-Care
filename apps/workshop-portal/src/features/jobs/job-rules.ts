import { JOB_STAGES, JOB_TRANSITIONS, type EstimateLine, type JobStage } from "@automotive/shared-types";
import type { StatusTone } from "@automotive/shared-ui/domain/status-badge";
import { gstFromInclusive } from "@automotive/utilities";

/** Board columns: every stage except the archived "delivered". */
export const BOARD_STAGES = JOB_STAGES.filter((s) => s !== "delivered");

export const stageTone: Record<JobStage, StatusTone> = {
  booked: "neutral",
  checked_in: "info",
  diagnosis: "info",
  awaiting_approval: "warning",
  in_repair: "info",
  quality_check: "warning",
  ready: "success",
  delivered: "success",
};

/** The primary forward move from a stage (first allowed transition). */
export const primaryNext = (stage: JobStage): JobStage | null => JOB_TRANSITIONS[stage][0] ?? null;

/** Estimates are GST-inclusive at 18% for labour and parts in this pilot. */
export const estimateTotals = (lines: EstimateLine[]) => {
  const totalPaise = lines.reduce((s, l) => s + l.amountPaise, 0);
  return { totalPaise, gstPaise: gstFromInclusive(totalPaise, 18) };
};

/** Stages where parts on the estimate still have to be sourced. */
const SOURCING_STAGES: readonly JobStage[] = ["diagnosis", "awaiting_approval", "in_repair"];
export type PartRequest = { jobId: string; jobNumber: string; registration: string; label: string; amountPaise: number; approved: boolean };
/** Parts to order: each part line on open jobs. Unapproved lines wait for the customer before ordering. */
export const partRequests = (jobs: { id: string; number: string; registration: string; stage: JobStage; estimate: EstimateLine[] }[]): PartRequest[] =>
  jobs
    .filter((j) => SOURCING_STAGES.includes(j.stage))
    .flatMap((j) => j.estimate.filter((l) => l.kind === "part").map((l) => ({ jobId: j.id, jobNumber: j.number, registration: j.registration, label: l.label, amountPaise: l.amountPaise, approved: l.approved !== false && j.stage !== "awaiting_approval" })));

/** Only jobs that are ready or handed over can be invoiced, and only for approved lines. */
export const invoiceable = <J extends { stage: JobStage; estimate: EstimateLine[] }>(jobs: J[]) =>
  jobs.filter((j) => (j.stage === "ready" || j.stage === "delivered") && j.estimate.length).map((j) => ({ job: j, ...estimateTotals(j.estimate.filter((l) => l.approved !== false)) }));
