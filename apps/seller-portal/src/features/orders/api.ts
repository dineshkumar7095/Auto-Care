import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@automotive/api-client";
import type { OrderStatus } from "@automotive/shared-types";

export const vendorOrdersQuery = () => queryOptions({ queryKey: ["orders", "vendor"], queryFn: () => api.orders.listForVendor() });

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) => api.orders.updateStatus(id, status),
    onSuccess: (order) => {
      toast.success(`${order.number} updated`);
      void qc.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err) => toast.error(err.message),
  });
}
