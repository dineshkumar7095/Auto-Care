import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@automotive/api-client";
import { JOB_STAGE_LABEL, type JobStage } from "@automotive/shared-types";

export const jobsQuery = () => queryOptions({ queryKey: ["jobs"], queryFn: () => api.bookings.listJobs() });

export function useUpdateJobStage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: JobStage }) => api.bookings.updateJobStage(id, stage),
    onSuccess: (job) => {
      toast.success(`${job.number} → ${JOB_STAGE_LABEL[job.stage]}`);
      void qc.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: (err) => toast.error(err.message),
  });
}
