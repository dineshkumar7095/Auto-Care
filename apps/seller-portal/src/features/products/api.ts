import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@automotive/api-client";
import type { ProductInput } from "@automotive/validation";

export const myListingsQuery = () => queryOptions({ queryKey: ["listings", "mine"], queryFn: () => api.catalogue.listMyListings() });

export function useCreateListing(onDone: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ProductInput) => api.catalogue.createListing(input),
    onSuccess: () => {
      toast.success("Submitted for review");
      void qc.invalidateQueries({ queryKey: ["listings"] });
      onDone();
    },
    onError: (err) => toast.error(err.message),
  });
}
