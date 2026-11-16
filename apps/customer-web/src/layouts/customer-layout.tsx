import { Outlet } from "@tanstack/react-router";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export function CustomerLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1"><Outlet /></main>
      <SiteFooter />
    </div>
  );
}
