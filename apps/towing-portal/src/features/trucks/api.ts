import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@automotive/api-client";
import type { TowTruck } from "@automotive/shared-types";

export const trucksQuery = () => queryOptions({ queryKey: ["trucks"], queryFn: () => api.towing.listTrucks() });

export function useSetTruckStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TowTruck["status"] }) => api.towing.setTruckStatus(id, status),
    onSuccess: (t) => {
      toast.success(`${t.registration} updated`);
      void qc.invalidateQueries({ queryKey: ["trucks"] });
    },
    onError: (e) => toast.error(e.message),
  });
}
