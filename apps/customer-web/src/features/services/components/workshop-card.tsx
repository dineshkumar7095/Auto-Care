import { BadgeCheck, Clock, Star, Zap } from "lucide-react";
import type { Workshop } from "@automotive/shared-types";
import { Badge } from "@automotive/shared-ui/ui/badge";
import { Button } from "@automotive/shared-ui/ui/button";
import { formatINR } from "@automotive/utilities";

export function WorkshopCard({ workshop: w, onBook }: { workshop: Workshop; onBook: () => void }) {
  return (
    <article className="surface flex flex-col gap-3 p-4 sm:p-5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <h2 className="flex items-center gap-1.5 font-sans text-lg font-semibold"><span className="truncate">{w.name}</span> {w.verified && <BadgeCheck className="size-5 shrink-0 text-success" />}</h2>
          <p className="truncate text-sm text-muted-foreground">{w.area} · {w.distanceKm} km · {w.hours}</p>
        </div>
        <span className="flex items-center gap-1 rounded-lg bg-success-soft px-2 py-1 text-sm font-semibold text-success"><Star className="size-3.5 fill-current" /> {w.rating}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {w.specialties.map((s) => <Badge key={s} variant="muted">{s}</Badge>)}
        {w.evQualified && <Badge variant="info" className="gap-1"><Zap className="size-3" /> EV-qualified</Badge>}
        {w.pickup && <Badge variant="outline">Pickup & drop</Badge>}
      </div>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t pt-3">
        <div className="text-sm">
          <p>From <b>{formatINR(w.fromPricePaise)}</b></p>
          <p className="flex items-center gap-1 text-xs text-success"><Clock className="size-3" /> Next: {w.nextSlot}</p>
        </div>
        <Button onClick={onBook}>Book slot</Button>
      </div>
    </article>
  );
}
