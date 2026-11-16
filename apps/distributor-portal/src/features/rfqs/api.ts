import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@automotive/api-client";

export const rfqsQuery = () => queryOptions({ queryKey: ["trade", "rfqs"], queryFn: () => api.trade.listRfqs() });

export function useQuoteRfq() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, totalPaise }: { id: string; totalPaise: number }) => api.trade.quoteRfq(id, totalPaise),
    onSuccess: (r) => {
      toast.success(`Quote sent for ${r.number}`);
      void qc.invalidateQueries({ queryKey: ["trade", "rfqs"] });
    },
    onError: (e) => toast.error(e.message),
  });
}
