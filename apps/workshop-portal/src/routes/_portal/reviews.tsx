import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeading } from "@automotive/shared-ui/domain/page-heading";
import { ReviewList } from "@automotive/shared-ui/domain/review-list";
import { ErrorState, ListSkeleton } from "@automotive/shared-ui/domain/states";
import { myReviewsQuery } from "@/features/reviews/api";

export const Route = createFileRoute("/_portal/reviews")({ component: ReviewsPage });

function ReviewsPage() {
  const reviews = useQuery(myReviewsQuery());
  const avg = reviews.data?.length ? reviews.data.reduce((s, r) => s + r.rating, 0) / reviews.data.length : null;
  return (
    <>
      <PageHeading title="Reviews" subtitle={avg ? `Average ${avg.toFixed(1)} out of 5 from ${reviews.data!.length} recent reviews.` : "What customers say about your workshop."} />
      {reviews.isPending ? <ListSkeleton /> : reviews.isError ? <ErrorState message={reviews.error.message} /> : <ReviewList reviews={reviews.data} />}
    </>
  );
}
