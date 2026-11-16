import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Siren } from "lucide-react";
import { usePageTitle } from "@automotive/shared-ui/lib/use-page-title";
import { TowingWizard } from "@/features/towing/components/towing-wizard";

export const Route = createFileRoute("/_site/towing")({ component: TowingPage });

function TowingPage() {
  usePageTitle("Towing & roadside help — Dono Auto Care");
  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="flex gap-3 rounded-xl bg-destructive-soft p-4 text-sm text-destructive">
        <AlertTriangle className="size-5 shrink-0" />
        <p><b>Injured or in danger?</b> Call <b>112</b> first. Towing is not a replacement for emergency services.</p>
      </div>
      <h1 className="mt-6 flex items-center gap-2 text-2xl font-semibold"><Siren className="text-destructive" /> Roadside assistance</h1>
      <TowingWizard />
    </div>
  );
}
