import { createFileRoute } from "@tanstack/react-router";
import { Building2, ShieldCheck, Siren, Store, Truck, Wrench } from "lucide-react";
import { usePageTitle } from "@automotive/shared-ui/lib/use-page-title";
import { Button } from "@automotive/shared-ui/ui/button";

export const Route = createFileRoute("/_site/business")({ component: BusinessPage });

const PORTALS = [
  { icon: Store, name: "Seller portal", who: "Retail parts sellers", points: ["List parts with fitment", "Accept & ship orders", "Track payouts"], env: import.meta.env.VITE_SELLER_PORTAL_URL ?? "http://localhost:5174" },
  { icon: Building2, name: "Distributor portal", who: "Wholesalers", points: ["Trade price lists", "Quotes & credit terms", "Branch stock"], env: "http://localhost:5175" },
  { icon: Wrench, name: "Workshop portal", who: "Garages & service centres", points: ["Bookings & bay calendar", "Digital job cards", "Estimates customers approve"], env: import.meta.env.VITE_WORKSHOP_PORTAL_URL ?? "http://localhost:5176" },
  { icon: Siren, name: "Towing partner portal", who: "Towing operators & drivers", points: ["Receive nearby jobs", "Live trip status", "Proof of delivery"], env: "http://localhost:5177" },
  { icon: Truck, name: "Fleet portal", who: "Fleet owners", points: ["Vehicle registry", "Maintenance plans", "Approval workflows"], env: "http://localhost:5178" },
  { icon: ShieldCheck, name: "Admin portal", who: "Platform operations", points: ["Approve partners", "Monitor SLAs", "Handle disputes"], env: import.meta.env.VITE_ADMIN_PORTAL_URL ?? "http://localhost:5179" },
];

function BusinessPage() {
  usePageTitle("Partner with Dono Auto Care");
  return (
    <>
      <section className="bg-hero text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          <h1 className="max-w-2xl text-3xl font-semibold md:text-5xl">One marketplace. A portal built for your work.</h1>
          <p className="mt-3 max-w-xl text-primary-foreground/80">Each partner gets a focused workspace. Orders, bookings and trips flow between them automatically.</p>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:grid-cols-2 lg:grid-cols-3">
        {PORTALS.map((p) => (
          <div key={p.name} className="surface flex flex-col gap-3 p-5">
            <span className="grid size-11 place-items-center rounded-xl bg-primary-soft text-primary"><p.icon /></span>
            <div><h2 className="font-sans text-lg font-semibold">{p.name}</h2><p className="text-sm text-muted-foreground">{p.who}</p></div>
            <ul className="space-y-1 text-sm">{p.points.map((x) => <li key={x}>• {x}</li>)}</ul>
            <Button asChild variant="soft" className="mt-auto"><a href={p.env}>Open {p.name.toLowerCase()}</a></Button>
          </div>
        ))}
      </section>
    </>
  );
}
