import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@automotive/api-client";

export const pendingPartnersQuery = () => queryOptions({ queryKey: ["vendors", "pending"], queryFn: () => api.vendors.list({ status: "pending" }) });

export function useDecidePartner(onDone: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { id: string; decision: "approve" | "reject"; note?: string }) => api.vendors.decide(v.id, { decision: v.decision, note: v.note }),
    onSuccess: (vendor) => {
      toast.success(`${vendor.name} ${vendor.status}`);
      void qc.invalidateQueries({ queryKey: ["vendors"] });
      void qc.invalidateQueries({ queryKey: ["admin"] });
      onDone();
    },
    onError: (err) => toast.error(err.message),
  });
}
