import { queryOptions, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@automotive/api-client";
import type { TowingIssue } from "@automotive/shared-types";

export const providersQuery = (issue: TowingIssue | null) => queryOptions({ queryKey: ["towing", "providers", issue], queryFn: () => api.towing.listProviders({ issue: issue ?? undefined }), enabled: !!issue });

export function useRequestTow(onDone: () => void) {
  return useMutation({ mutationFn: api.towing.requestTrip, onSuccess: onDone, onError: (e) => toast.error(e.message) });
}
