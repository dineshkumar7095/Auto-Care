import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@automotive/api-client";

export const branchStockQuery = () => queryOptions({ queryKey: ["branch-stock"], queryFn: () => api.inventory.listBranchStock() });

export function useSetBranchStock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, onHand }: { id: string; onHand: number }) => api.inventory.setBranchStock(id, onHand),
    onSuccess: (b) => {
      toast.success(`${b.title}: ${b.onHand} in stock at ${b.branch}`);
      void qc.invalidateQueries({ queryKey: ["branch-stock"] });
    },
    onError: (e) => toast.error(e.message),
  });
}
