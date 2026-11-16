import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Car, LogIn, MapPin, Menu, Search, ShoppingCart, Siren, User } from "lucide-react";
import { useAuth } from "@automotive/authentication";
import { BrandMark } from "@automotive/shared-ui/domain/brand-mark";
import { Button } from "@automotive/shared-ui/ui/button";
import { Input } from "@automotive/shared-ui/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@automotive/shared-ui/ui/sheet";
import { PORTAL_LINKS, SITE_NAV } from "@/app/navigation";
import { defaultVehicle } from "@/features/vehicles/saved-vehicles";

export function SiteHeader() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [q, setQ] = useState("");
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 lg:gap-6">
        <Link to="/" className="shrink-0"><BrandMark /></Link>
        <button className="hidden shrink-0 items-center gap-1.5 rounded-lg px-2 py-1 text-left text-xs hover:bg-muted md:flex">
          <MapPin className="size-4 text-accent" />
          <span>
            <span className="block text-muted-foreground">Deliver to</span>
            <span className="font-semibold text-foreground">Hyderabad 500034</span>
          </span>
        </button>
        <form
          className="relative hidden min-w-0 flex-1 md:block"
          onSubmit={(e) => {
            e.preventDefault();
            void navigate({ to: "/parts", search: { q: q || undefined } });
          }}
        >
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search part, part number, service or workshop" className="h-10 bg-muted pl-9" />
        </form>
        <div className="ml-auto flex shrink-0 items-center gap-1 md:ml-0">
          {auth.isAuthenticated ? (
            <Button asChild variant="ghost" size="icon" aria-label="My account"><Link to="/account"><User /></Link></Button>
          ) : (
            <Button asChild variant="ghost" size="sm"><Link to="/login" search={{ redirect: undefined }}><LogIn /> <span className="hidden sm:inline">Sign in</span></Link></Button>
          )}
          <Button variant="ghost" size="icon" aria-label="Cart"><ShoppingCart /></Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu" className="lg:hidden"><Menu /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader><SheetTitle className="text-left">Menu</SheetTitle></SheetHeader>
              <nav className="mt-2 flex flex-col gap-1 px-4">
                {SITE_NAV.map((n) => (
                  <Link key={n.to} to={n.to} className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted">{n.label}</Link>
                ))}
                <div className="my-3 border-t" />
                <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Business portals</p>
                {PORTAL_LINKS.map((p) => (
                  <a key={p.href} href={p.href} className="rounded-lg px-3 py-2.5 text-sm hover:bg-muted">{p.label}</a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div className="mx-auto hidden max-w-7xl items-center gap-1 px-4 pb-2 lg:flex">
        {SITE_NAV.map((n) => (
          <Link key={n.to} to={n.to} className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground" activeProps={{ className: "bg-primary-soft text-primary" }}>
            {n.label}
          </Link>
        ))}
        <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          <Car className="size-4" /> {defaultVehicle.label}
          <Link to="/towing" className="ml-3 flex items-center gap-1 font-semibold text-destructive"><Siren className="size-4" /> Need help on the road?</Link>
        </div>
      </div>
    </header>
  );
}
