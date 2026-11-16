import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@automotive/api-client";
import type { TripStatus } from "@automotive/shared-types";

export const tripsQuery = () => queryOptions({ queryKey: ["trips"], queryFn: () => api.towing.listTrips(), refetchInterval: 15_000 });

export function useUpdateTrip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TripStatus }) => api.towing.updateTripStatus(id, status),
    onSuccess: (t) => {
      toast.success(`${t.number} updated`);
      void qc.invalidateQueries({ queryKey: ["trips"] });
    },
    onError: (e) => toast.error(e.message),
  });
}
