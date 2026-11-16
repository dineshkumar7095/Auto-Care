import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Truck } from "lucide-react";
import type { Workshop } from "@automotive/shared-types";
import { EmptyState, ListSkeleton } from "@automotive/shared-ui/domain/states";
import { cn } from "@automotive/shared-ui/lib/cn";
import { usePageTitle } from "@automotive/shared-ui/lib/use-page-title";
import { workshopsQuery } from "@/features/services/api";
import { BookingDialog } from "@/features/services/components/booking-dialog";
import { WorkshopCard } from "@/features/services/components/workshop-card";
import { defaultVehicle } from "@/features/vehicles/saved-vehicles";

const SERVICES = ["General service", "AC repair", "Diagnostics", "Denting & painting", "EV diagnostics", "Bike service"];

export const Route = createFileRoute("/_site/services")({ component: ServicesPage });

function ServicesPage() {
  usePageTitle("Book a verified workshop — Dono Auto Care");
  const [service, setService] = useState<string | null>(null);
  const [pickup, setPickup] = useState(false);
  const [booking, setBooking] = useState<Workshop | null>(null);
  const workshops = useQuery(workshopsQuery({ service: service ?? undefined, pickup: pickup || undefined }));
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="text-2xl font-semibold md:text-3xl">Book a service</h1>
      <p className="mt-1 truncate text-sm text-muted-foreground">Banjara Hills, Hyderabad · for your {defaultVehicle.label}</p>
      <div className="scrollbar-none -mx-4 mt-5 flex gap-2 overflow-x-auto px-4">
        {SERVICES.map((s) => (
          <button key={s} onClick={() => setService(service === s ? null : s)} className={cn("shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium", service === s ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted")}>{s}</button>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-3 border-y py-3">
        <button onClick={() => setPickup(!pickup)} className={cn("flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm", pickup && "border-primary bg-primary-soft text-primary")}><Truck className="size-4" /> Pickup & drop</button>
        <span className="text-sm text-muted-foreground">{workshops.data?.length ?? 0} workshops</span>
      </div>
      <div className="mt-5">
        {workshops.isPending ? <ListSkeleton /> : workshops.data?.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {workshops.data.map((w) => <WorkshopCard key={w.id} workshop={w} onBook={() => setBooking(w)} />)}
          </div>
        ) : <EmptyState title="No workshops for this service yet" description={service === "EV diagnostics" ? "Only EV-qualified workshops can take high-voltage jobs." : undefined} />}
      </div>
      <BookingDialog workshop={booking} service={service ?? "General service"} onClose={() => setBooking(null)} />
    </div>
  );
}
