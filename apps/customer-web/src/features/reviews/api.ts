import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@automotive/api-client";
import type { ReviewInput } from "@automotive/validation";

export const reviewsQuery = (productId: string) => queryOptions({ queryKey: ["reviews", productId], queryFn: () => api.reviews.listForProduct(productId) });

export function useCreateReview(productId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<ReviewInput, "productId">) => api.reviews.create({ ...input, productId }),
    onSuccess: () => {
      toast.success("Thanks for your review");
      void qc.invalidateQueries({ queryKey: ["reviews", productId] });
    },
    onError: (e) => toast.error(e.message),
  });
}
