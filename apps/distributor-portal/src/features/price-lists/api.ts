import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@automotive/api-client";

export const priceListsQuery = () => queryOptions({ queryKey: ["trade", "price-lists"], queryFn: () => api.trade.listPriceLists() });

export function useTogglePriceList() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) => api.trade.togglePriceList(id, active),
    onSuccess: (p) => {
      toast.success(`${p.name} ${p.active ? "switched on" : "switched off"}`);
      void qc.invalidateQueries({ queryKey: ["trade", "price-lists"] });
    },
    onError: (e) => toast.error(e.message),
  });
}
