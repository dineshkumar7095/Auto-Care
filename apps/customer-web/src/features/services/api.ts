import { queryOptions, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@automotive/api-client";

export const workshopsQuery = (q: { service?: string; pickup?: boolean }) => queryOptions({ queryKey: ["workshops", q], queryFn: () => api.bookings.listWorkshops(q) });

export function useCreateBooking(onDone: () => void) {
  return useMutation({
    mutationFn: api.bookings.create,
    onSuccess: (b) => {
      toast.success("Booking requested", { description: `${b.service} · ${b.slot}` });
      onDone();
    },
    onError: (e) => toast.error(e.message),
  });
}
