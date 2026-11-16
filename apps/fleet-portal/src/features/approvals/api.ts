import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@automotive/api-client";

export const approvalsQuery = () => queryOptions({ queryKey: ["fleet", "approvals"], queryFn: () => api.fleet.listApprovals() });

export function useDecideApproval() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, decision }: { id: string; decision: "approve" | "reject" }) => api.fleet.decide(id, decision),
    onSuccess: (a) => {
      toast.success(`Request ${a.status}`);
      void qc.invalidateQueries({ queryKey: ["fleet", "approvals"] });
    },
    onError: (e) => toast.error(e.message),
  });
}
