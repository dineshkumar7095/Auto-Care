import { Clock, User } from "lucide-react";
import { JOB_STAGE_LABEL, type JobCard } from "@automotive/shared-types";
import { BOARD_STAGES } from "../job-rules";

export function JobBoard({ jobs, onOpen }: { jobs: JobCard[]; onOpen: (job: JobCard) => void }) {
  return (
    <div className="scrollbar-none -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-4 md:-mx-6 md:px-6 lg:-mx-8 lg:px-8">
      {BOARD_STAGES.map((stage) => {
        const col = jobs.filter((j) => j.stage === stage);
        return (
          <div key={stage} className="w-[78vw] max-w-72 shrink-0 snap-start sm:w-72">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-sans text-sm font-semibold">{JOB_STAGE_LABEL[stage]}</h2>
              <span className="rounded-full bg-card px-2 text-xs text-muted-foreground">{col.length}</span>
            </div>
            <div className="space-y-2">
              {col.map((j) => (
                <button key={j.id} onClick={() => onOpen(j)} className="surface block w-full p-3 text-left transition-shadow hover:shadow-lift">
                  <p className="text-xs font-semibold text-muted-foreground">{j.number}</p>
                  <p className="mt-0.5 text-sm font-semibold">{j.vehicleLabel}</p>
                  <p className="text-xs text-muted-foreground">{j.registration}</p>
                  <p className="mt-2 line-clamp-2 text-xs">{j.complaint}</p>
                  <div className="mt-3 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                    <span className="flex min-w-0 items-center gap-1"><User className="size-3 shrink-0" /> <span className="truncate">{j.technician ?? "Unassigned"}</span></span>
                    <span className="flex shrink-0 items-center gap-1"><Clock className="size-3" /> {j.promisedAt}</span>
                  </div>
                </button>
              ))}
              {!col.length && <p className="rounded-xl border border-dashed p-4 text-center text-xs text-muted-foreground">No vehicles</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
