import { Link } from "@tanstack/react-router";
import { BatteryCharging, ClipboardCheck, Disc3, MapPin, Siren, Wrench } from "lucide-react";

const ACTIONS = [
  { label: "Buy spare parts", icon: Disc3, to: "/parts" },
  { label: "Book service", icon: Wrench, to: "/services" },
  { label: "Find workshop", icon: MapPin, to: "/services" },
  { label: "Request towing", icon: Siren, to: "/towing" },
  { label: "Tyres & batteries", icon: BatteryCharging, to: "/parts" },
  { label: "Vehicle inspection", icon: ClipboardCheck, to: "/services" },
] as const;

export function QuickActions() {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      {ACTIONS.map((a) => (
        <Link key={a.label} to={a.to} className="flex flex-col items-center gap-2 rounded-xl border border-primary-foreground/15 bg-primary-foreground/10 p-3 text-center text-xs font-medium backdrop-blur transition-colors hover:bg-primary-foreground/20 sm:p-5 sm:text-sm">
          <span className="grid size-10 place-items-center rounded-lg bg-secondary text-secondary-foreground sm:size-12"><a.icon className="size-5 sm:size-6" /></span>
          {a.label}
        </Link>
      ))}
    </div>
  );
}
