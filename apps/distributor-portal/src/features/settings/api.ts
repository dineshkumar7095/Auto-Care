import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@automotive/api-client";
import type { SettingValue } from "@automotive/shared-types";

export const settingsQuery = () => queryOptions({ queryKey: ["settings"], queryFn: () => api.settings.get() });

export function useSaveSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (values: Record<string, SettingValue>) => api.settings.save(values),
    onSuccess: (doc) => {
      toast.success("Settings saved");
      qc.setQueryData(["settings"], doc);
    },
    onError: (e) => toast.error(e.message),
  });
}
