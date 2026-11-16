import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@automotive/api-client";

export const notificationsQuery = () => queryOptions({ queryKey: ["notifications"], queryFn: () => api.notifications.list() });

export function useMarkRead() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: string) => api.notifications.markRead(id), onSuccess: () => void qc.invalidateQueries({ queryKey: ["notifications"] }) });
}
