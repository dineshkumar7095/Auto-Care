import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@automotive/api-client";
import type { OrderStatus } from "@automotive/shared-types";

export const tradeOrdersQuery = () => queryOptions({ queryKey: ["orders", "trade"], queryFn: () => api.orders.listForVendor() });

export function useAdvanceTradeOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) => api.orders.updateStatus(id, status),
    onSuccess: (o) => {
      toast.success(`${o.number} updated`);
      void qc.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (e) => toast.error(e.message),
  });
}
