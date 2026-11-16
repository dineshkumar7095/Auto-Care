import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { MapPin, Search } from "lucide-react";
import { Badge } from "@automotive/shared-ui/ui/badge";
import { Button } from "@automotive/shared-ui/ui/button";
import { Input } from "@automotive/shared-ui/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@automotive/shared-ui/ui/select";
import heroImg from "@/assets/hero-workshop.jpg";
import { savedVehicles } from "@/features/vehicles/saved-vehicles";
import { QuickActions } from "./quick-actions";

export function HeroSearch() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [vehicle, setVehicle] = useState<string>(savedVehicles[0].id);
  return (
    <section className="relative overflow-hidden bg-hero text-primary-foreground">
      <img src={heroImg} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-luminosity" />
      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 pb-10 pt-8 md:pb-16 md:pt-14 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div className="min-w-0">
          <Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground">Now live in Hyderabad · expanding across India</Badge>
          <h1 className="mt-4 text-3xl font-semibold leading-tight md:text-5xl">What do you need for your vehicle?</h1>
          <p className="mt-3 max-w-lg text-sm text-primary-foreground/80 md:text-base">Parts that actually fit, workshops you can trust, and help on the road — from scooters to trucks.</p>
          <form
            className="mt-6 space-y-3 rounded-2xl bg-card p-3 text-card-foreground shadow-lift"
            onSubmit={(e) => {
              e.preventDefault();
              void navigate({ to: "/parts", search: { q: q || undefined, vehicle } });
            }}
          >
            <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
              <Select value={vehicle} onValueChange={setVehicle}>
                <SelectTrigger className="h-11 bg-muted"><SelectValue placeholder="Select vehicle" /></SelectTrigger>
                <SelectContent>
                  {savedVehicles.map((v) => <SelectItem key={v.id} value={v.id}>{v.label}</SelectItem>)}
                  <SelectItem value="none">Search without vehicle</SelectItem>
                </SelectContent>
              </Select>
              <button type="button" className="flex h-11 items-center gap-1.5 rounded-md bg-muted px-3 text-sm"><MapPin className="size-4 text-accent" /> 500034</button>
            </div>
            <div className="flex gap-2">
              <div className="relative min-w-0 flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Brake pads, 16510M68K00…" className="h-11 pl-9" />
              </div>
              <Button type="submit" size="xl" className="shrink-0">Search</Button>
            </div>
          </form>
        </div>
        <QuickActions />
      </div>
    </section>
  );
}
