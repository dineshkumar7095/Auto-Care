import { MapPin, Navigation, Phone } from "lucide-react";
import { TOWING_ISSUE_LABEL, type TowingTrip } from "@automotive/shared-types";
import { StatusBadge } from "@automotive/shared-ui/domain/status-badge";
import { Button } from "@automotive/shared-ui/ui/button";
import { formatINR } from "@automotive/utilities";
import { useUpdateTrip } from "../api";
import { nextTripAction, TRIP_LABEL, tripTone } from "../trip-rules";

export function TripCard({ trip }: { trip: TowingTrip }) {
  const update = useUpdateTrip();
  const next = nextTripAction(trip.status);
  return (
    <article className="surface flex flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-muted-foreground">{trip.number}</p>
          <h3 className="truncate font-sans text-base font-semibold">{TOWING_ISSUE_LABEL[trip.issue]} · {trip.customerName}</h3>
        </div>
        <StatusBadge label={TRIP_LABEL[trip.status]} tone={tripTone[trip.status]} />
      </div>
      <div className="space-y-1.5 text-sm">
        <p className="flex gap-2"><MapPin className="mt-0.5 size-4 shrink-0 text-destructive" /> {trip.pickup}</p>
        <p className="flex gap-2"><Navigation className="mt-0.5 size-4 shrink-0 text-accent" /> {trip.drop}</p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3 text-sm">
        <span>Quote <b>{formatINR(trip.quotedPaise)}</b>{trip.driverName && <span className="text-muted-foreground"> · {trip.driverName}</span>}</span>
        <div className="flex gap-2">
          <Button size="icon" variant="outline" aria-label="Call customer"><Phone /></Button>
          {next && <Button size="sm" disabled={update.isPending} onClick={() => update.mutate({ id: trip.id, status: next.to })}>{next.label}</Button>}
        </div>
      </div>
    </article>
  );
}
