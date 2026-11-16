import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@automotive/api-client";

export const allPayoutsQuery = () => queryOptions({ queryKey: ["payouts", "all"], queryFn: () => api.payouts.listAll() });

export function useReleasePayout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.payouts.release(id),
    onSuccess: (p) => {
      toast.success(`Payout to ${p.vendorName} released`);
      void qc.invalidateQueries({ queryKey: ["payouts"] });
    },
    onError: (e) => toast.error(e.message),
  });
}
