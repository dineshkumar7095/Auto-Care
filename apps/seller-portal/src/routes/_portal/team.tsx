import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeading } from "@automotive/shared-ui/domain/page-heading";
import { ErrorState, ListSkeleton } from "@automotive/shared-ui/domain/states";
import { TeamManager } from "@automotive/shared-ui/domain/team-manager";
import { teamQuery, useAddTeamMember, useSetTeamMemberActive } from "@/features/team/api";

export const Route = createFileRoute("/_portal/team")({ component: TeamPage });

function TeamPage() {
  const team = useQuery(teamQuery());
  const add = useAddTeamMember();
  const toggle = useSetTeamMemberActive();
  return (
    <>
      <PageHeading title="Team & roles" subtitle="Staff who can sign in to your store. Turn someone off to block their access." />
      {team.isPending ? <ListSkeleton /> : team.isError ? <ErrorState message={team.error.message} /> : (
        <TeamManager members={team.data} noun="staff member" titlePlaceholder="e.g. Packing & dispatch" saving={add.isPending} onAdd={(m) => add.mutateAsync(m)} onToggle={(id, active) => toggle.mutate({ id, active })} />
      )}
    </>
  );
}
