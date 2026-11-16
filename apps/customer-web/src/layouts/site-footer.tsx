import { Link } from "@tanstack/react-router";
import { BrandMark } from "@automotive/shared-ui/domain/brand-mark";
import { PORTAL_LINKS } from "@/app/navigation";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t bg-muted">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <BrandMark />
          <p className="text-sm text-muted-foreground">Parts, service, towing and fleet care — one connected marketplace for every vehicle.</p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-semibold">Shop</p>
          <Link to="/parts" className="block text-muted-foreground hover:text-foreground">Spare parts</Link>
          <Link to="/services" className="block text-muted-foreground hover:text-foreground">Book a service</Link>
          <Link to="/towing" className="block text-muted-foreground hover:text-foreground">Towing & roadside</Link>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-semibold">For business</p>
          {PORTAL_LINKS.map((p) => <a key={p.href} href={p.href} className="block text-muted-foreground hover:text-foreground">{p.label}</a>)}
          <Link to="/business" className="block text-muted-foreground hover:text-foreground">Partner with us</Link>
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">Help</p>
          <p>About · Contact · Terms · Privacy</p>
          <p>Seller policy · Service-provider policy · Grievance officer</p>
        </div>
      </div>
      <p className="border-t py-4 text-center text-xs text-muted-foreground">© 2026 Dono Auto Care</p>
    </footer>
  );
}
