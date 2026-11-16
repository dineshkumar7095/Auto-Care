import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "@tanstack/react-router";
import { Check, LocateFixed, MapPin, MessageSquare, Phone, Truck } from "lucide-react";
import { useAuth } from "@automotive/authentication";
import { TOWING_ISSUES, TOWING_ISSUE_LABEL, type TowingIssue } from "@automotive/shared-types";
import { cn } from "@automotive/shared-ui/lib/cn";
import { Button } from "@automotive/shared-ui/ui/button";
import { Input } from "@automotive/shared-ui/ui/input";
import { Progress } from "@automotive/shared-ui/ui/progress";
import { formatINR } from "@automotive/utilities";
import { defaultVehicle } from "@/features/vehicles/saved-vehicles";
import { providersQuery, useRequestTow } from "../api";

const STEPS = ["Issue", "Location", "Provider", "On the way"];

export function TowingWizard() {
  const auth = useAuth();
  const location = useLocation();
  const [step, setStep] = useState(0);
  const [issue, setIssue] = useState<TowingIssue | null>(null);
  const [pickup, setPickup] = useState("Road No. 36, near Jubilee Hills check post");
  const [drop, setDrop] = useState("Precision Car Care, Banjara Hills");
  const [providerId, setProviderId] = useState<string | null>(null);
  const providers = useQuery(providersQuery(issue));
  const chosen = providers.data?.find((p) => p.id === providerId) ?? providers.data?.[0];
  const request = useRequestTow(() => setStep(3));

  return (
    <>
      <div className="mt-4 flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex flex-1 flex-col gap-1.5">
            <div className={cn("h-1.5 rounded-full", i <= step ? "bg-primary" : "bg-border")} />
            <span className={cn("text-[11px] font-medium", i <= step ? "text-foreground" : "text-muted-foreground")}>{s}</span>
          </div>
        ))}
      </div>

      {step === 0 && (
        <section className="mt-6 space-y-4">
          <h2 className="text-lg font-semibold">What happened?</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {TOWING_ISSUES.map((t) => (
              <button key={t} onClick={() => setIssue(t)} className={cn("rounded-xl border bg-card p-3 text-left text-sm font-medium", issue === t && "border-primary bg-primary-soft text-primary")}>
                {TOWING_ISSUE_LABEL[t]}
              </button>
            ))}
          </div>
          <div className="surface p-4 text-sm">
            <p className="font-medium">Vehicle</p>
            <p className="text-muted-foreground">{defaultVehicle.label} · {defaultVehicle.reg}</p>
          </div>
          <Button size="xl" className="w-full" disabled={!issue} onClick={() => setStep(1)}>Continue</Button>
        </section>
      )}

      {step === 1 && (
        <section className="mt-6 space-y-4">
          <h2 className="text-lg font-semibold">Where are you?</h2>
          <div className="relative h-48 overflow-hidden rounded-2xl bg-secondary">
            <MapPin className="absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-full fill-destructive text-destructive-foreground" />
            <p className="absolute bottom-3 left-3 right-3 truncate rounded bg-card px-2 py-1 text-xs">{pickup}</p>
          </div>
          <Button variant="outline" className="w-full"><LocateFixed /> Use my current location</Button>
          <Input value={pickup} onChange={(e) => setPickup(e.target.value)} placeholder="Pickup location or landmark" />
          <Input value={drop} onChange={(e) => setDrop(e.target.value)} placeholder="Drop at (workshop or address)" />
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setStep(0)}>Back</Button>
            <Button size="xl" className="flex-1" onClick={() => setStep(2)}>Find providers</Button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="mt-6 space-y-3">
          <h2 className="text-lg font-semibold">Available near you</h2>
          {providers.data?.map((p) => (
            <button key={p.id} onClick={() => setProviderId(p.id)} className={cn("surface flex w-full items-center gap-3 p-4 text-left sm:gap-4", chosen?.id === p.id && "ring-2 ring-primary")}>
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary"><Truck /></span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold">{p.name}</span>
                <span className="block truncate text-xs text-muted-foreground">{p.truck} · {p.distanceKm} km · ★ {p.rating}</span>
              </span>
              <span className="shrink-0 text-right">
                <span className="block font-display font-semibold">{p.etaMin} min</span>
                <span className="block text-xs text-muted-foreground">~{formatINR(p.pricePaise)}</span>
              </span>
            </button>
          ))}
          <p className="text-xs text-muted-foreground">Estimate covers up to 10 km. Free cancellation until a driver is assigned.</p>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
            {auth.isAuthenticated ? (
              <Button size="xl" variant="emergency" className="flex-1" disabled={!chosen || !issue || request.isPending} onClick={() => issue && chosen && request.mutate({ issue, pickup, drop, vehicleLabel: defaultVehicle.label, providerId: chosen.id })}>
                Confirm request
              </Button>
            ) : (
              <Button asChild size="xl" variant="emergency" className="flex-1"><Link to="/login" search={{ redirect: location.href }}>Sign in to request</Link></Button>
            )}
          </div>
        </section>
      )}

      {step === 3 && chosen && (
        <section className="mt-6 space-y-4">
          <div className="surface overflow-hidden">
            <div className="relative h-44 bg-secondary">
              <Truck className="absolute left-[30%] top-[40%] size-8 text-primary" />
              <MapPin className="absolute left-[65%] top-[30%] size-8 fill-destructive text-destructive-foreground" />
            </div>
            <div className="space-y-3 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Driver arriving in</p>
                  <p className="font-display text-2xl font-semibold">{chosen.etaMin} min</p>
                </div>
                <span className="text-xs text-muted-foreground">Updated just now</span>
              </div>
              <Progress value={20} />
              <p className="text-sm">Waiting for <b>{chosen.name}</b> to assign a driver.</p>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline"><Phone /> Call</Button>
                <Button variant="outline"><MessageSquare /> Chat</Button>
              </div>
            </div>
          </div>
          <ol className="space-y-2 text-sm">
            {["Request sent", "Provider accepted", "Driver on the way", "Vehicle picked up", "Dropped at destination"].map((s, i) => (
              <li key={s} className="flex items-center gap-2">
                <span className={cn("grid size-6 place-items-center rounded-full", i < 1 ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground")}>{i < 1 ? <Check className="size-3.5" /> : i + 1}</span>
                <span className={i < 1 ? "font-medium" : "text-muted-foreground"}>{s}</span>
              </li>
            ))}
          </ol>
        </section>
      )}
    </>
  );
}
