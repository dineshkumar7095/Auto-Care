import type { Booking } from "@automotive/shared-types";
import { Badge } from "@automotive/shared-ui/ui/badge";

export function BookingsList({ bookings }: { bookings: Booking[] }) {
  return (
    <div className="divide-y">
      {bookings.map((b) => (
        <div key={b.id} className="flex items-center gap-4 py-3">
          <span className="w-14 shrink-0 font-display text-sm font-semibold">{b.slot}</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{b.customerName} · {b.vehicleLabel}</p>
            <p className="truncate text-xs text-muted-foreground">{b.service}</p>
          </div>
          <Badge variant={b.source === "marketplace" ? "info" : "muted"} className="shrink-0">{b.source === "marketplace" ? "Marketplace" : "Walk-in"}</Badge>
        </div>
      ))}
    </div>
  );
}
