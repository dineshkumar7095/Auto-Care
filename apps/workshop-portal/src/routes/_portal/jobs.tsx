import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { JobCard } from "@automotive/shared-types";
import { PageHeading } from "@automotive/shared-ui/domain/page-heading";
import { ErrorState, ListSkeleton } from "@automotive/shared-ui/domain/states";
import { jobsQuery } from "@/features/jobs/api";
import { JobBoard } from "@/features/jobs/components/job-board";
import { JobCardDialog } from "@/features/jobs/components/job-card-dialog";

export const Route = createFileRoute("/_portal/jobs")({ component: JobsPage });

function JobsPage() {
  const jobs = useQuery(jobsQuery());
  const [openId, setOpenId] = useState<string | null>(null);
  const open: JobCard | null = jobs.data?.find((j) => j.id === openId) ?? null;
  return (
    <>
      <PageHeading title="Job cards" subtitle="Move each vehicle through the workshop. Extra work always needs customer approval." />
      {jobs.isPending ? <ListSkeleton /> : jobs.isError ? <ErrorState message={jobs.error.message} /> : <JobBoard jobs={jobs.data} onOpen={(j) => setOpenId(j.id)} />}
      <JobCardDialog job={open} onClose={() => setOpenId(null)} />
    </>
  );
}
