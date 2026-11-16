import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHeading } from "@automotive/shared-ui/domain/page-heading";
import { StatGrid } from "@automotive/shared-ui/domain/stat-card";
import { ListSkeleton } from "@automotive/shared-ui/domain/states";
import { formatINR } from "@automotive/utilities";
import { BUSINESS } from "@/app/navigation";
import { todaysBookingsQuery } from "@/features/bookings/api";
import { BookingsList } from "@/features/bookings/components/bookings-list";
import { jobsQuery } from "@/features/jobs/api";
import { estimateTotals } from "@/features/jobs/job-rules";

export const Route = createFileRoute("/_portal/")({ component: WorkshopDashboard });

function WorkshopDashboard() {
  const jobs = useQuery(jobsQuery());
  const bookings = useQuery(todaysBookingsQuery());
  const list = jobs.data ?? [];
  const inWorkshop = list.filter((j) => j.stage !== "booked" && j.stage !== "ready" && j.stage !== "delivered");
  const awaiting = list.filter((j) => j.stage === "awaiting_approval");

  return (
    <>
      <PageHeading title={`Today at ${BUSINESS.name}`} subtitle="Bookings, bays and approvals at a glance." />
      <StatGrid
        stats={[
          { label: "Bookings today", value: String(bookings.data?.length ?? "–"), hint: "From marketplace and walk-ins" },
          { label: "Vehicles in workshop", value: String(inWorkshop.length), hint: `${inWorkshop.length} of 6 bays busy`, tone: "warning" },
          { label: "Awaiting approval", value: String(awaiting.length), hint: "Customer must approve", tone: "warning" },
          { label: "Revenue today", value: formatINR(2134000), hint: "+9% this week", tone: "success" },
        ]}
      />
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="surface p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Bookings</h2>
            <Link to="/bookings" className="flex items-center gap-1 text-sm font-medium text-accent">All <ArrowRight className="size-4" /></Link>
          </div>
          {bookings.isPending ? <ListSkeleton /> : <BookingsList bookings={bookings.data ?? []} />}
        </section>
        <section className="surface p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Waiting on customers</h2>
            <Link to="/jobs" className="flex items-center gap-1 text-sm font-medium text-accent">Job board <ArrowRight className="size-4" /></Link>
          </div>
          <div className="space-y-2">
            {awaiting.map((j) => (
              <div key={j.id} className="flex flex-wrap items-center gap-3 rounded-xl bg-warning-soft p-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{j.number} · {j.vehicleLabel}</p>
                  <p className="truncate text-xs text-muted-foreground">{j.customerName} · {j.complaint}</p>
                </div>
                <span className="font-semibold">{formatINR(estimateTotals(j.estimate).totalPaise)}</span>
              </div>
            ))}
            {!awaiting.length && <p className="text-sm text-muted-foreground">No estimates pending.</p>}
          </div>
        </section>
      </div>
    </>
  );
}
