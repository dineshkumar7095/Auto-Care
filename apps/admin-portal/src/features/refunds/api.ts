import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@automotive/api-client";

export const allReturnsQuery = () => queryOptions({ queryKey: ["returns", "all"], queryFn: () => api.returns.listAll() });

export function useAdminReturnDecision() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, decision }: { id: string; decision: "approve" | "reject" | "refund" }) => api.returns.decide(id, decision),
    onSuccess: (r) => {
      toast.success(`${r.orderNumber}: ${r.status}`);
      void qc.invalidateQueries({ queryKey: ["returns"] });
    },
    onError: (e) => toast.error(e.message),
  });
}
