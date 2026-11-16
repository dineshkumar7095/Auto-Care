import { ChevronRight } from "lucide-react";
import { Can } from "@automotive/authentication";
import { JOB_STAGE_LABEL, type JobCard } from "@automotive/shared-types";
import { StatusBadge } from "@automotive/shared-ui/domain/status-badge";
import { Button } from "@automotive/shared-ui/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@automotive/shared-ui/ui/dialog";
import { formatINR } from "@automotive/utilities";
import { useUpdateJobStage } from "../api";
import { estimateTotals, primaryNext, stageTone } from "../job-rules";

export function JobCardDialog({ job, onClose }: { job: JobCard | null; onClose: () => void }) {
  const update = useUpdateJobStage();
  const next = job ? primaryNext(job.stage) : null;
  const totals = job ? estimateTotals(job.estimate) : null;
  return (
    <Dialog open={!!job} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        {job && (
          <>
            <DialogHeader>
              <DialogTitle className="flex flex-wrap items-center gap-2">{job.number} <StatusBadge label={JOB_STAGE_LABEL[job.stage]} tone={stageTone[job.stage]} /></DialogTitle>
              <DialogDescription>{job.vehicleLabel} · {job.registration} · {job.customerName}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 text-sm">
              <div className="rounded-lg bg-muted p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Customer complaint</p>
                <p className="mt-1">{job.complaint}</p>
              </div>
              {job.estimate.length > 0 && totals && (
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estimate</p>
                  <div className="divide-y rounded-lg border">
                    {job.estimate.map((l) => (
                      <div key={l.label} className="flex justify-between gap-3 px-3 py-2">
                        <span className="min-w-0">{l.label} <span className="text-xs text-muted-foreground">· {l.kind}</span></span>
                        <span className="shrink-0 font-medium">{formatINR(l.amountPaise)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between px-3 py-2 text-muted-foreground"><span>Includes GST</span><span>{formatINR(totals.gstPaise)}</span></div>
                    <div className="flex justify-between px-3 py-2 font-semibold"><span>Total</span><span>{formatINR(totals.totalPaise)}</span></div>
                  </div>
                </div>
              )}
              {job.stage === "awaiting_approval" && <p className="rounded-lg bg-warning-soft p-3 text-warning-foreground">Waiting for the customer to approve this estimate in their app. Repair can't start until they do.</p>}
            </div>
            <DialogFooter>
              <Can permission="jobs:advance">
                {next && job.stage !== "awaiting_approval" && (
                  <Button disabled={update.isPending} onClick={() => update.mutate({ id: job.id, stage: next }, { onSuccess: onClose })}>
                    Move to {JOB_STAGE_LABEL[next]} <ChevronRight />
                  </Button>
                )}
              </Can>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
