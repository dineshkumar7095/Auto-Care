import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@automotive/api-client";

export const vendorReturnsQuery = () => queryOptions({ queryKey: ["returns", "vendor"], queryFn: () => api.returns.listForVendor() });

export function useDecideReturn() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, decision }: { id: string; decision: "approve" | "reject" }) => api.returns.decide(id, decision),
    onSuccess: (r) => {
      toast.success(`Return for ${r.orderNumber} ${r.status}`);
      void qc.invalidateQueries({ queryKey: ["returns"] });
      void qc.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (e) => toast.error(e.message),
  });
}
