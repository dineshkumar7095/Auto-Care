import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeading } from "@automotive/shared-ui/domain/page-heading";
import { ErrorState, ListSkeleton } from "@automotive/shared-ui/domain/states";
import { TeamManager } from "@automotive/shared-ui/domain/team-manager";
import { teamQuery, useAddTeamMember, useSetTeamMemberActive } from "@/features/team/api";

export const Route = createFileRoute("/_portal/technicians")({ component: TeamPage });

function TeamPage() {
  const team = useQuery(teamQuery());
  const add = useAddTeamMember();
  const toggle = useSetTeamMemberActive();
  return (
    <>
      <PageHeading title="Technicians" subtitle="People you can assign to job cards." />
      {team.isPending ? <ListSkeleton /> : team.isError ? <ErrorState message={team.error.message} /> : (
        <TeamManager members={team.data} noun="technician" titlePlaceholder="e.g. AC specialist" saving={add.isPending} onAdd={(m) => add.mutateAsync(m)} onToggle={(id, active) => toggle.mutate({ id, active })} />
      )}
    </>
  );
}
