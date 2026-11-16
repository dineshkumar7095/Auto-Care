import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeading } from "@automotive/shared-ui/domain/page-heading";
import { SettingsForm } from "@automotive/shared-ui/domain/settings-form";
import { ErrorState, ListSkeleton } from "@automotive/shared-ui/domain/states";
import { settingsQuery, useSaveSettings } from "@/features/settings/api";
import { SETTINGS_SECTIONS } from "@/features/settings/fields";

export const Route = createFileRoute("/_portal/approval-rules")({ component: SettingsPage });

function SettingsPage() {
  const settings = useQuery(settingsQuery());
  const save = useSaveSettings();
  return (
    <>
      <PageHeading title="Approval rules" subtitle="When a repair or part needs your sign-off before work starts." />
      {settings.isPending ? <ListSkeleton /> : settings.isError ? <ErrorState message={settings.error.message} /> : (
        <SettingsForm sections={SETTINGS_SECTIONS} saved={settings.data.values} saving={save.isPending} onSave={(v) => save.mutate(v)} />
      )}
    </>
  );
}
