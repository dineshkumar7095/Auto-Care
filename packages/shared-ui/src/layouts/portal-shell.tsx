import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { Bell, ChevronDown, HelpCircle, LogOut, Menu, Search } from "lucide-react";
import { initials } from "@automotive/utilities";
import { BrandMark } from "../components/domain/brand-mark";
import { Button } from "../components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import { Input } from "../components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../components/ui/sheet";

/** A nav item without `to` renders as a disabled "Soon" entry, so menus never link to unbuilt screens. */
export type PortalNavItem = { label: string; icon: LucideIcon; to?: string; exact?: boolean };
export type PortalNavGroup = { title: string; items: PortalNavItem[] };

export type PortalShellProps = {
  portalLabel: string;
  business: string;
  branch: string;
  user: { name: string; roleLabel: string };
  nav: PortalNavGroup[];
  searchPlaceholder?: string;
  onSignOut: () => void;
  children: ReactNode;
};

function NavList({ nav }: { nav: PortalNavGroup[] }) {
  return (
    <nav className="flex flex-col gap-6" aria-label="Portal">
      {nav.map((g) => (
        <div key={g.title}>
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">{g.title}</p>
          <div className="flex flex-col gap-0.5">
            {g.items.map((item) =>
              item.to ? (
                <Link
                  key={item.label}
                  // Shared layout: each app passes its own typed paths; the router validates them at runtime.
                  to={item.to as never}
                  activeOptions={{ exact: item.exact ?? false }}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  activeProps={{ className: "bg-sidebar-primary font-semibold text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground" }}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              ) : (
                <span key={item.label} className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/45">
                  <item.icon className="size-4" />
                  {item.label}
                  <span className="ml-auto rounded bg-sidebar-accent px-1.5 py-0.5 text-[10px] uppercase">Soon</span>
                </span>
              ),
            )}
          </div>
        </div>
      ))}
    </nav>
  );
}

export function PortalShell({ portalLabel, business, branch, user, nav, searchPlaceholder = "Search", onSignOut, children }: PortalShellProps) {
  return (
    <div className="flex min-h-screen bg-muted">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-8 overflow-y-auto bg-sidebar p-4 lg:flex">
        <Link to={"/" as never} className="px-2 pt-1">
          <BrandMark tone="light" suffix={portalLabel} />
        </Link>
        <NavList nav={nav} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b bg-background px-4 py-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 border-sidebar-border bg-sidebar p-4">
              <SheetHeader className="p-0">
                <SheetTitle className="sr-only">{portalLabel} navigation</SheetTitle>
                <BrandMark tone="light" suffix={portalLabel} />
              </SheetHeader>
              <div className="mt-6">
                <NavList nav={nav} />
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex min-w-0 items-center gap-2 px-2 py-1">
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-foreground">{business}</span>
              <span className="block truncate text-xs text-muted-foreground">{branch}</span>
            </span>
          </div>
          <div className="relative ml-auto hidden max-w-sm flex-1 md:block">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder={searchPlaceholder} className="h-9 bg-muted pl-9" />
          </div>
          <div className="ml-auto flex items-center gap-1 md:ml-0">
            <Button variant="ghost" size="icon" aria-label="Help" className="hidden sm:inline-flex">
              <HelpCircle />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
              <Bell />
              <span className="absolute right-2 top-2 size-2 rounded-full bg-destructive" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger className="ml-1 flex items-center gap-2 rounded-lg p-1 hover:bg-muted" aria-label="Account menu">
                <span className="grid size-8 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">{initials(user.name)}</span>
                <span className="hidden text-left text-xs leading-tight xl:block">
                  <span className="block font-semibold text-foreground">{user.name}</span>
                  <span className="text-muted-foreground">{user.roleLabel}</span>
                </span>
                <ChevronDown className="hidden size-4 text-muted-foreground xl:block" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={onSignOut}>
                  <LogOut /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
