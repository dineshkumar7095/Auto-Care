import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@automotive/api-client";
import type { TeamMemberInput } from "@automotive/validation";

export const teamQuery = () => queryOptions({ queryKey: ["team"], queryFn: () => api.team.list() });

export function useAddTeamMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: TeamMemberInput) => api.team.add(input),
    onSuccess: (m) => {
      toast.success(`${m.name} added`);
      void qc.invalidateQueries({ queryKey: ["team"] });
    },
    onError: (e) => toast.error(e.message),
  });
}

export function useSetTeamMemberActive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) => api.team.setActive(id, active),
    onSuccess: (m) => {
      toast.success(`${m.name} is now ${m.active ? "active" : "inactive"}`);
      void qc.invalidateQueries({ queryKey: ["team"] });
    },
    onError: (e) => toast.error(e.message),
  });
}
