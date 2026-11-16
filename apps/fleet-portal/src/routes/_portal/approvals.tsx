import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeading } from "@automotive/shared-ui/domain/page-heading";
import { EmptyState, ListSkeleton } from "@automotive/shared-ui/domain/states";
import { approvalsQuery } from "@/features/approvals/api";
import { ApprovalList } from "@/features/approvals/components/approval-list";

export const Route = createFileRoute("/_portal/approvals")({ component: ApprovalsPage });

function ApprovalsPage() {
  const approvals = useQuery(approvalsQuery());
  return (
    <>
      <PageHeading title="Approvals" subtitle="Repairs and purchases above your auto-approve limit." />
      {approvals.isPending ? <ListSkeleton /> : approvals.data?.length ? <ApprovalList items={approvals.data} /> : <EmptyState title="Nothing to approve" />}
    </>
  );
}
