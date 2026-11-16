import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { TICKET_STATUS_LABEL, TICKET_TRANSITIONS, type TicketPriority, type TicketStatus } from "@automotive/shared-types";
import { PageHeading } from "@automotive/shared-ui/domain/page-heading";
import { EmptyState, ErrorState, ListSkeleton } from "@automotive/shared-ui/domain/states";
import { StatusBadge, type StatusTone } from "@automotive/shared-ui/domain/status-badge";
import { Button } from "@automotive/shared-ui/ui/button";
import { formatDateTime } from "@automotive/utilities";
import { ticketsQuery, useSetTicketStatus } from "@/features/support/api";

export const Route = createFileRoute("/_portal/tickets")({ component: TicketsPage });

const STATUS_TONE: Record<TicketStatus, StatusTone> = { open: "warning", in_progress: "info", resolved: "success" };
const PRIORITY_TONE: Record<TicketPriority, StatusTone> = { high: "danger", medium: "warning", low: "neutral" };
const ACTION: Record<TicketStatus, string> = { open: "Reopen", in_progress: "Start", resolved: "Resolve" };

function TicketsPage() {
  const tickets = useQuery(ticketsQuery());
  const set = useSetTicketStatus();
  return (
    <>
      <PageHeading title="Tickets" subtitle="Help requests from customers and partners." />
      {tickets.isPending ? <ListSkeleton /> : tickets.isError ? <ErrorState message={tickets.error.message} /> : !tickets.data.length ? <EmptyState title="No tickets" /> : (
        <ul className="divide-y rounded-xl border bg-card">
          {tickets.data.map((t) => (
            <li key={t.id} className="grid gap-3 p-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
              <div className="min-w-0">
                <p className="text-sm font-semibold">{t.subject}</p>
                <p className="truncate text-xs text-muted-foreground">{t.number} · {t.raisedBy} ({t.raisedByType === "customer" ? "customer" : "partner"}) · {formatDateTime(t.createdAt)}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge label={`${t.priority[0]!.toUpperCase()}${t.priority.slice(1)} priority`} tone={PRIORITY_TONE[t.priority]} />
                <StatusBadge label={TICKET_STATUS_LABEL[t.status]} tone={STATUS_TONE[t.status]} />
                {TICKET_TRANSITIONS[t.status].map((next) => (
                  <Button key={next} size="sm" variant={next === "resolved" ? "default" : "outline"} disabled={set.isPending} onClick={() => set.mutate({ id: t.id, status: next })}>{ACTION[next]}</Button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
