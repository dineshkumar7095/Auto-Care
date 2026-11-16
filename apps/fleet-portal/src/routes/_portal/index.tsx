import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHeading } from "@automotive/shared-ui/domain/page-heading";
import { StatGrid } from "@automotive/shared-ui/domain/stat-card";
import { ListSkeleton } from "@automotive/shared-ui/domain/states";
import { approvalsQuery } from "@/features/approvals/api";
import { ApprovalList } from "@/features/approvals/components/approval-list";
import { fleetVehiclesQuery } from "@/features/vehicles/api";
import { isServiceDue } from "@/features/vehicles/vehicle-rules";

export const Route = createFileRoute("/_portal/")({ component: FleetDashboard });

function FleetDashboard() {
  const vehicles = useQuery(fleetVehiclesQuery());
  const approvals = useQuery(approvalsQuery());
  const v = vehicles.data ?? [];
  return (
    <>
      <PageHeading title="Fleet overview" subtitle="Uptime, maintenance and spend waiting for approval." />
      <StatGrid
        stats={[
          { label: "On the road", value: `${v.filter((x) => x.status === "active").length} of ${v.length}`, tone: "success" },
          { label: "In service", value: String(v.filter((x) => x.status === "in_service").length) },
          { label: "Breakdowns", value: String(v.filter((x) => x.status === "breakdown").length), tone: "danger", hint: "Towing requested" },
          { label: "Service due", value: String(v.filter(isServiceDue).length), tone: "warning", hint: "Within 1,000 km" },
        ]}
      />
      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Waiting for your approval</h2>
          <Link to="/approvals" className="flex items-center gap-1 text-sm font-medium text-accent">All <ArrowRight className="size-4" /></Link>
        </div>
        {approvals.isPending ? <ListSkeleton /> : <ApprovalList items={(approvals.data ?? []).filter((a) => a.status === "pending")} />}
      </section>
    </>
  );
}
