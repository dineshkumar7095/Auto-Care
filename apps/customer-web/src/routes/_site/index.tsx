import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Bike, Car, CircleDot, Headphones, Lock, RotateCcw, ShieldCheck, Star, Tractor, Truck, Zap } from "lucide-react";
import { PART_CATEGORIES } from "@automotive/shared-types";
import { usePageTitle } from "@automotive/shared-ui/lib/use-page-title";
import { Badge } from "@automotive/shared-ui/ui/badge";
import { Button } from "@automotive/shared-ui/ui/button";
import { formatINR } from "@automotive/utilities";
import { productsQuery } from "@/features/catalogue/api";
import { ProductGrid } from "@/features/catalogue/components/product-grid";
import { HeroSearch } from "@/features/home/components/hero-search";
import { workshopsQuery } from "@/features/services/api";
import { defaultVehicle } from "@/features/vehicles/saved-vehicles";

export const Route = createFileRoute("/_site/")({ component: Home });

const VEHICLES = [
  { label: "Cars", icon: Car },
  { label: "Two-wheelers", icon: Bike },
  { label: "Three-wheelers", icon: CircleDot },
  { label: "Trucks & buses", icon: Truck },
  { label: "Tractors", icon: Tractor },
  { label: "EVs", icon: Zap },
];

function Home() {
  usePageTitle("Dono Auto Care — Parts, service & towing for every vehicle");
  const products = useQuery(productsQuery({ sort: "fit" }));
  const workshops = useQuery(workshopsQuery({}));
  return (
    <>
      <HeroSearch />
      <section className="mx-auto max-w-7xl px-4 pt-10">
        <h2 className="mb-4 text-xl font-semibold md:text-2xl">Shop by vehicle</h2>
        <div className="scrollbar-none -mx-4 flex gap-3 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0 lg:grid-cols-6">
          {VEHICLES.map((v) => (
            <Link key={v.label} to="/parts" className="surface flex min-w-28 flex-col items-center gap-2 p-4 text-sm font-medium transition-shadow hover:shadow-lift">
              <v.icon className="size-7 text-accent" strokeWidth={1.5} /> {v.label}
            </Link>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 pt-10">
        <h2 className="mb-4 text-xl font-semibold md:text-2xl">Popular categories</h2>
        <div className="flex flex-wrap gap-2">
          {PART_CATEGORIES.map((c) => (
            <Link key={c} to="/parts" search={{ category: c }} className="rounded-full border bg-card px-4 py-2 text-sm font-medium hover:border-primary hover:bg-primary-soft">{c}</Link>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 pt-10">
        <div className="mb-4 flex items-end justify-between gap-3">
          <h2 className="min-w-0 truncate text-xl font-semibold md:text-2xl">Fits your {defaultVehicle.label}</h2>
          <Link to="/parts" className="flex shrink-0 items-center gap-1 text-sm font-medium text-accent">See all <ArrowRight className="size-4" /></Link>
        </div>
        <ProductGrid products={products.data?.items.slice(0, 4) ?? []} loading={products.isPending} />
      </section>
      <section className="mx-auto max-w-7xl px-4 pt-10">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-semibold md:text-2xl">Workshops near you</h2>
          <Link to="/services" className="flex items-center gap-1 text-sm font-medium text-accent">View all <ArrowRight className="size-4" /></Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {workshops.data?.map((w) => (
            <Link key={w.id} to="/services" className="surface flex flex-col gap-2 p-4 hover:shadow-lift">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-xs text-muted-foreground">{w.area} · {w.distanceKm} km</span>
                {w.verified && <Badge variant="success">Verified</Badge>}
              </div>
              <h3 className="font-sans text-base font-semibold">{w.name}</h3>
              <p className="flex items-center gap-1 text-xs text-muted-foreground"><Star className="size-3.5 fill-warning text-warning" /> {w.rating} · {w.reviews} reviews</p>
              <div className="mt-auto flex items-center justify-between pt-2 text-sm">
                <span>From <b>{formatINR(w.fromPricePaise)}</b></span>
                <span className="text-xs font-medium text-success">{w.nextSlot}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 pt-10">
        <div className="grid gap-6 rounded-3xl bg-hero p-6 text-primary-foreground md:grid-cols-[1.3fr_1fr] md:p-10">
          <div>
            <h2 className="text-2xl font-semibold md:text-3xl">Run an auto business? Grow with Dono Auto Care.</h2>
            <p className="mt-2 text-sm text-primary-foreground/80">Sellers, distributors, workshops and towing operators each get their own portal.</p>
            <Button asChild variant="hero" className="mt-5"><Link to="/business">Partner with us <ArrowRight /></Link></Button>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 pt-10">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { icon: ShieldCheck, title: "Verified partners", text: "Every seller & workshop is document-checked" },
            { icon: RotateCcw, title: "Easy returns", text: "Clear return and warranty on every listing" },
            { icon: Lock, title: "Secure payments", text: "UPI, cards and net banking" },
            { icon: Headphones, title: "Real support", text: "Help for orders, bookings and trips" },
          ].map((t) => (
            <div key={t.title} className="surface p-4">
              <t.icon className="size-6 text-success" />
              <p className="mt-3 text-sm font-semibold">{t.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
