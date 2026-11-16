import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@automotive/api-client";
import { TICKET_STATUS_LABEL, type TicketStatus } from "@automotive/shared-types";

export const ticketsQuery = () => queryOptions({ queryKey: ["tickets"], queryFn: () => api.support.listTickets() });

export function useSetTicketStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TicketStatus }) => api.support.setStatus(id, status),
    onSuccess: (t) => {
      toast.success(`${t.number}: ${TICKET_STATUS_LABEL[t.status]}`);
      void qc.invalidateQueries({ queryKey: ["tickets"] });
    },
    onError: (e) => toast.error(e.message),
  });
}
