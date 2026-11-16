import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@automotive/api-client";
import type { ReturnRequestInput } from "@automotive/validation";

export const myReturnsQuery = () => queryOptions({ queryKey: ["returns", "mine"], queryFn: () => api.returns.listMine() });
export const invoiceQuery = (orderId: string) => queryOptions({ queryKey: ["invoice", orderId], queryFn: () => api.invoices.forOrder(orderId) });

export function useRequestReturn() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ReturnRequestInput) => api.returns.request(input),
    onSuccess: (r) => {
      toast.success(`Return requested for ${r.orderNumber}`, { description: "The seller will reply within 48 hours." });
      void qc.invalidateQueries({ queryKey: ["returns"] });
      void qc.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (e) => toast.error(e.message),
  });
}
